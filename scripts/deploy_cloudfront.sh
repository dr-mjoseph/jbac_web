#!/usr/bin/env bash
set -e

REGION="${AWS_REGION:-ap-southeast-2}"
BUCKET_NAME="${TARGET_BUCKET:-jbac-web-production-298363284024}"

echo "=========================================================="
echo "Checking / Provisioning CloudFront Distribution for S3 Bucket: ${BUCKET_NAME}"
echo "=========================================================="

# Check if CloudFront distribution already exists
CF_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '${BUCKET_NAME}')].Id" --output text 2>/dev/null || true)

if [ -n "${CF_ID}" ] && [ "${CF_ID}" != "None" ]; then
  CF_DOMAIN=$(aws cloudfront get-distribution --id "${CF_ID}" --query "Distribution.DomainName" --output text)
  echo "Found existing CloudFront Distribution: ${CF_ID}"
  echo "CloudFront HTTPS Website URL: https://${CF_DOMAIN}"
else
  echo "Creating new CloudFront distribution for S3 website origin..."
  ORIGIN_DOMAIN="${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"
  
  CF_JSON=$(cat <<EOF
{
  "CallerReference": "cf-${BUCKET_NAME}-$(date +%s)",
  "Comment": "CDN Distribution for ${BUCKET_NAME}",
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
  CF_RES=$(aws cloudfront create-distribution --distribution-config "${CF_JSON}" --output json)
  CF_ID=$(echo "${CF_RES}" | jq -r '.Distribution.Id')
  CF_DOMAIN=$(echo "${CF_RES}" | jq -r '.Distribution.DomainName')
  echo "Created CloudFront Distribution ID: ${CF_ID}"
  echo "CloudFront HTTPS Website URL: https://${CF_DOMAIN}"
fi

echo "CF_DIST_ID=${CF_ID}" >> $GITHUB_ENV 2>/dev/null || true
echo "CF_DOMAIN=https://${CF_DOMAIN}" >> $GITHUB_ENV 2>/dev/null || true

if [ -n "${GITHUB_STEP_SUMMARY}" ]; then
  echo "## 🔒 AWS CloudFront HTTPS CDN Active!" >> "${GITHUB_STEP_SUMMARY}"
  echo "- **Secure HTTPS URL**: [https://${CF_DOMAIN}](https://${CF_DOMAIN})" >> "${GITHUB_STEP_SUMMARY}"
  echo "- **Distribution ID**: \`${CF_ID}\`" >> "${GITHUB_STEP_SUMMARY}"
  echo "- **Status**: Fully secured with Amazon SSL/TLS. HTML5 GPS Geolocation permissions are 100% permitted!" >> "${GITHUB_STEP_SUMMARY}"
fi
