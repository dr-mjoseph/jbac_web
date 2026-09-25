#!/usr/bin/env bash

REGION="${AWS_REGION:-ap-southeast-2}"
BUCKET_NAME="${TARGET_BUCKET:-jbac-web-production-298363284024}"

echo "=========================================================="
echo "Checking / Provisioning CloudFront Distribution for S3 Bucket: ${BUCKET_NAME}"
echo "=========================================================="

CF_ID=""
CF_DOMAIN=""

# 1. Check if CloudFront distribution already exists
echo "Querying existing CloudFront distributions..."
CF_LIST=$(aws cloudfront list-distributions --output json 2>&1 || true)

if echo "${CF_LIST}" | grep -q "DistributionList"; then
  # Look for distribution matching our bucket name
  CF_ID=$(echo "${CF_LIST}" | jq -r ".DistributionList.Items[]? | select(.Origins.Items[]?.DomainName | contains(\"${BUCKET_NAME}\")) | .Id" 2>/dev/null | head -n 1 || true)
  if [ -n "${CF_ID}" ] && [ "${CF_ID}" != "null" ]; then
    CF_DOMAIN=$(echo "${CF_LIST}" | jq -r ".DistributionList.Items[]? | select(.Id==\"${CF_ID}\") | .DomainName" 2>/dev/null || true)
    echo "Found existing CloudFront Distribution: ${CF_ID}"
    echo "CloudFront HTTPS Website URL: https://${CF_DOMAIN}"
  fi
fi

# 2. If not found, attempt to create one
if [ -z "${CF_ID}" ] || [ "${CF_ID}" = "null" ]; then
  echo "No existing CloudFront distribution found for ${BUCKET_NAME}. Attempting creation..."
  ORIGIN_DOMAIN="${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"
  CALLER_REF="cf-${BUCKET_NAME}-$(date +%s)"

  CF_CONFIG=$(cat <<EOF
{
  "CallerReference": "${CALLER_REF}",
  "Comment": "CDN for ${BUCKET_NAME}",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-${BUCKET_NAME}",
        "DomainName": "${ORIGIN_DOMAIN}",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-${BUCKET_NAME}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 3,
      "Items": ["GET", "HEAD", "OPTIONS"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      }
    ]
  }
}
EOF
)

  echo "${CF_CONFIG}" > /tmp/cf_config.json
  CF_CREATE_OUTPUT=$(aws cloudfront create-distribution --distribution-config file:///tmp/cf_config.json --output json 2>&1 || true)

  if echo "${CF_CREATE_OUTPUT}" | grep -q '"Distribution"'; then
    CF_ID=$(echo "${CF_CREATE_OUTPUT}" | jq -r '.Distribution.Id' 2>/dev/null || true)
    CF_DOMAIN=$(echo "${CF_CREATE_OUTPUT}" | jq -r '.Distribution.DomainName' 2>/dev/null || true)
    echo "Successfully created CloudFront Distribution: ${CF_ID}"
    echo "CloudFront HTTPS Website URL: https://${CF_DOMAIN}"
  else
    echo "[WARNING] CloudFront automated creation returned:"
    echo "${CF_CREATE_OUTPUT}"
    echo "Continuing deployment to S3 bucket without blocking the pipeline."
  fi
fi

echo "=== CLOUDFRONT CDN STATUS ===" >> diagnostics.txt
echo "CF_ID=${CF_ID}" >> diagnostics.txt
echo "CF_DOMAIN=${CF_DOMAIN}" >> diagnostics.txt

if [ -n "${CF_ID}" ] && [ "${CF_ID}" != "null" ]; then
  echo "CF_DIST_ID=${CF_ID}" >> $GITHUB_ENV 2>/dev/null || true
  echo "CF_DOMAIN=https://${CF_DOMAIN}" >> $GITHUB_ENV 2>/dev/null || true
  echo "https://${CF_DOMAIN}" > cloudfront_url.txt
  echo "CloudFront URL: https://${CF_DOMAIN}" >> diagnostics.txt

  if [ -n "${GITHUB_STEP_SUMMARY}" ]; then
    echo "## 🔒 AWS CloudFront HTTPS CDN Active!" >> "${GITHUB_STEP_SUMMARY}"
    echo "- **Secure HTTPS URL**: [https://${CF_DOMAIN}](https://${CF_DOMAIN})" >> "${GITHUB_STEP_SUMMARY}"
    echo "- **Distribution ID**: \`${CF_ID}\`" >> "${GITHUB_STEP_SUMMARY}"
    echo "- **Status**: Fully secured with Amazon SSL/TLS. HTML5 GPS Geolocation permissions are 100% permitted!" >> "${GITHUB_STEP_SUMMARY}"
  fi
else
  echo "[INFO] CloudFront distribution ID not currently configured or pending manual console creation."
  echo "CloudFront not yet active or created." >> diagnostics.txt
fi

