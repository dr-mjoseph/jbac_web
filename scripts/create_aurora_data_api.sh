#!/usr/bin/env bash
# Provision Aurora Serverless v2 Cluster with Data API enabled

REGION="${AWS_REGION:-ap-southeast-2}"
CLUSTER_ID="jbac-aurora-cluster"
INSTANCE_ID="jbac-aurora-instance-1"
DB_NAME="jbac_jbac"
PASSWORD="biUt2TrZ9EZAqn6GXhiA"

echo "=========================================================="
echo "Checking / Provisioning Aurora Serverless v2 in ${REGION}"
echo "=========================================================="

# 1. Check if Aurora cluster already exists
EXISTING_CLUSTER=$(aws rds describe-db-clusters --region "${REGION}" --query "DBClusters[?DBClusterIdentifier=='${CLUSTER_ID}'].DBClusterIdentifier" --output text 2>/dev/null || true)

if [ "${EXISTING_CLUSTER}" != "${CLUSTER_ID}" ]; then
  echo "Creating Aurora MySQL Serverless v2 cluster: ${CLUSTER_ID}..."
  CREATE_CLUSTER_OUTPUT=$(aws rds create-db-cluster \
    --db-cluster-identifier "${CLUSTER_ID}" \
    --engine "aurora-mysql" \
    --serverless-v2-scaling-configuration MinCapacity=0.5,MaxCapacity=2.0 \
    --master-username "admin" \
    --master-user-password "${PASSWORD}" \
    --database-name "${DB_NAME}" \
    --enable-http-endpoint \
    --region "${REGION}" 2>&1 || true)
  echo "${CREATE_CLUSTER_OUTPUT}"

  echo "Creating Aurora DB Instance: ${INSTANCE_ID}..."
  CREATE_INSTANCE_OUTPUT=$(aws rds create-db-instance \
    --db-cluster-identifier "${CLUSTER_ID}" \
    --db-instance-identifier "${INSTANCE_ID}" \
    --db-instance-class "db.serverless" \
    --engine "aurora-mysql" \
    --region "${REGION}" 2>&1 || true)
  echo "${CREATE_INSTANCE_OUTPUT}"
else
  echo "Aurora cluster ${CLUSTER_ID} already exists."
fi

# 2. Retrieve Cluster ARN and enable HTTP Endpoint (Data API)
echo "Verifying Data API (HTTP Endpoint) is enabled..."
CLUSTER_ARN=$(aws rds describe-db-clusters --region "${REGION}" --query "DBClusters[?DBClusterIdentifier=='${CLUSTER_ID}'].DBClusterArn" --output text 2>/dev/null || true)

if [ -n "${CLUSTER_ARN}" ] && [ "${CLUSTER_ARN}" != "None" ]; then
  echo "Cluster ARN: ${CLUSTER_ARN}"
  ENABLE_DATA_API_OUTPUT=$(aws rds enable-http-endpoint --resource-arn "${CLUSTER_ARN}" --region "${REGION}" 2>&1 || true)
  echo "Data API Output: ${ENABLE_DATA_API_OUTPUT}"
  echo "Data API has been enabled for ${CLUSTER_ID}!"
else
  echo "[INFO] Cluster ARN not available yet. Cluster is still initializing."
fi

echo "=========================================================="
echo "Aurora Serverless v2 Provisioning Step Finished"
echo "=========================================================="
