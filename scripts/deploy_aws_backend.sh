#!/usr/bin/env bash
set -e

REGION="${AWS_REGION:-ap-southeast-2}"
FUNCTION_NAME="jbac-backend-api"
ROLE_NAME="jbac-backend-lambda-role"
ZIP_FILE="backend/backend-deploy.zip"

echo "=========================================================="
echo "Deploying JBAC Node.js Express Backend to AWS Lambda in ${REGION}"
echo "=========================================================="

if [ ! -f "${ZIP_FILE}" ]; then
  echo "Error: ${ZIP_FILE} not found! Please build it first."
  exit 1
fi

# 1. Ensure IAM Role exists
echo "[1/5] Checking IAM Execution Role: ${ROLE_NAME}..."
ROLE_ARN=$(aws iam get-role --role-name "${ROLE_NAME}" --query "Role.Arn" --output text 2>/dev/null || true)

if [ -z "${ROLE_ARN}" ] || [ "${ROLE_ARN}" = "None" ]; then
  echo "Creating IAM Role: ${ROLE_NAME}..."
  ROLE_ARN=$(aws iam create-role \
    --role-name "${ROLE_NAME}" \
    --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' \
    --query "Role.Arn" --output text)
  
  aws iam attach-role-policy \
    --role-name "${ROLE_NAME}" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  
  echo "Waiting 12 seconds for IAM Role propagation..."
  sleep 12
fi
echo "Using IAM Role ARN: ${ROLE_ARN}"

# 2. Create or Update Lambda Function
echo "[2/5] Deploying Lambda Function: ${FUNCTION_NAME}..."
ENV_VARS="Variables={DB_HOST=jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com,DB_USER=admin,DB_PASSWORD=biUt2TrZ9EZAqn6GXhiA,DB_NAME=jbac_jbac,DB_PORT=3306}"

if aws lambda get-function --function-name "${FUNCTION_NAME}" --region "${REGION}" >/dev/null 2>&1; then
  echo "Updating existing function code..."
  aws lambda update-function-code \
    --function-name "${FUNCTION_NAME}" \
    --zip-file "fileb://${ZIP_FILE}" \
    --region "${REGION}"
  
  echo "Waiting for function update to complete..."
  aws lambda wait function-updated --function-name "${FUNCTION_NAME}" --region "${REGION}"

  echo "Updating function configuration..."
  aws lambda update-function-configuration \
    --function-name "${FUNCTION_NAME}" \
    --runtime "nodejs18.x" \
    --handler "server.handler" \
    --timeout 30 \
    --memory-size 512 \
    --environment "${ENV_VARS}" \
    --region "${REGION}"
else
  echo "Creating new Lambda function..."
  aws lambda create-function \
    --function-name "${FUNCTION_NAME}" \
    --runtime "nodejs18.x" \
    --role "${ROLE_ARN}" \
    --handler "server.handler" \
    --zip-file "fileb://${ZIP_FILE}" \
    --timeout 30 \
    --memory-size 512 \
    --environment "${ENV_VARS}" \
    --region "${REGION}"
  
  echo "Waiting for function to be active..."
  aws lambda wait function-active-v2 --function-name "${FUNCTION_NAME}" --region "${REGION}"
fi

# 3. Create or Configure Lambda Function URL (HTTPS Endpoint)
echo "[3/5] Configuring HTTPS Lambda Function URL..."
URL_CONFIG=$(aws lambda get-function-url-config --function-name "${FUNCTION_NAME}" --region "${REGION}" 2>/dev/null || true)

if [ -z "${URL_CONFIG}" ]; then
  echo "Creating Function URL..."
  aws lambda create-function-url-config \
    --function-name "${FUNCTION_NAME}" \
    --auth-type NONE \
    --cors '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"],"MaxAge":86400}' \
    --region "${REGION}"
  
  aws lambda add-permission \
    --function-name "${FUNCTION_NAME}" \
    --statement-id "FunctionURLAllowPublicAccess" \
    --action "lambda:InvokeFunctionUrl" \
    --principal "*" \
    --function-url-auth-type NONE \
    --region "${REGION}" || true
fi

FUNCTION_URL=$(aws lambda get-function-url-config --function-name "${FUNCTION_NAME}" --query "FunctionUrl" --output text --region "${REGION}")
echo "Lambda Function URL: ${FUNCTION_URL}"

# 4. Create or Update API Gateway HTTP API
echo "[4/5] Configuring API Gateway HTTP API v2..."
API_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='jbac-backend-http-api'].ApiId" --output text --region "${REGION}" 2>/dev/null || true)
LAMBDA_ARN=$(aws lambda get-function --function-name "${FUNCTION_NAME}" --query "Configuration.FunctionArn" --output text --region "${REGION}")

if [ -z "${API_ID}" ] || [ "${API_ID}" = "None" ]; then
  echo "Creating API Gateway HTTP API..."
  API_ID=$(aws apigatewayv2 create-api \
    --name "jbac-backend-http-api" \
    --protocol-type HTTP \
    --cors-configuration '{"AllowOrigins":["*"],"AllowMethods":["*"],"AllowHeaders":["*"]}' \
    --target "${LAMBDA_ARN}" \
    --region "${REGION}" \
    --query "ApiId" --output text)
  
  aws lambda add-permission \
    --function-name "${FUNCTION_NAME}" \
    --statement-id "ApiGatewayInvokePermission" \
    --action "lambda:InvokeFunction" \
    --principal "apigateway.amazonaws.com" \
    --source-arn "arn:aws:execute-api:${REGION}:*:*/*" \
    --region "${REGION}" || true
fi

API_GATEWAY_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com/"
echo "API Gateway HTTPS Endpoint: ${API_GATEWAY_URL}"

# Write URLs to files and environment
echo "${FUNCTION_URL}" > backend_url.txt
echo "FUNCTION_URL=${FUNCTION_URL}" >> $GITHUB_ENV 2>/dev/null || true
echo "API_GATEWAY_URL=${API_GATEWAY_URL}" >> $GITHUB_ENV 2>/dev/null || true

# Test endpoint
echo "Testing backend health ping: ${FUNCTION_URL}api ..."
curl -s -m 10 "${FUNCTION_URL}api" || true
echo ""

# 5. Output Summary to GitHub Step Summary if running in Actions
echo "=========================================================="
echo "BACKEND DEPLOYMENT SUCCESSFUL!"
echo "Primary HTTPS Backend URL: ${FUNCTION_URL}"
echo "API Gateway HTTPS URL:     ${API_GATEWAY_URL}"
echo "Tables URL:                ${FUNCTION_URL}dashboardapi/tables"
echo "Admin Database Cockpit:    ${FUNCTION_URL}api/admin-database-view"
echo "=========================================================="

if [ -n "${GITHUB_STEP_SUMMARY}" ]; then
  echo "## 🚀 AWS Backend API Deployed Successfully!" >> "${GITHUB_STEP_SUMMARY}"
  echo "- **Primary HTTPS URL**: [${FUNCTION_URL}](${FUNCTION_URL})" >> "${GITHUB_STEP_SUMMARY}"
  echo "- **API Gateway URL**: [${API_GATEWAY_URL}](${API_GATEWAY_URL})" >> "${GITHUB_STEP_SUMMARY}"
  echo "- **Admin Cockpit**: [${FUNCTION_URL}api/admin-database-view](${FUNCTION_URL}api/admin-database-view)" >> "${GITHUB_STEP_SUMMARY}"
  echo "- **Database Cluster**: \`jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com:3306\`" >> "${GITHUB_STEP_SUMMARY}"
fi
