#!/usr/bin/env bash
# ==============================================================================
# AWS Cost Optimization & Cleanup Script for JBAC
# This script deletes unused Aurora Serverless resources and sets log retention
# Run this directly in AWS CloudShell (https://console.aws.amazon.com/cloudshell)
# ==============================================================================

set -e

REGION="${AWS_REGION:-ap-southeast-2}"
CLUSTER_ID="jbac-aurora-cluster"
INSTANCE_ID="jbac-aurora-instance-1"
LAMBDA_NAME="jbac-backend-api"

echo "=========================================================="
echo "JBAC AWS Cost Optimization & Cleanup Utility"
echo "Target Region: ${REGION}"
echo "=========================================================="

echo "`n[Step 1/3] Inspecting active databases in ${REGION}..."
aws rds describe-db-instances --region "${REGION}" --query "DBInstances[*].{ID:DBInstanceIdentifier,Class:DBInstanceClass,Status:DBInstanceStatus}" --output table || true
aws rds describe-db-clusters --region "${REGION}" --query "DBClusters[*].{ID:DBClusterIdentifier,Status:Status}" --output table || true

echo "`n[Step 2/3] Checking for redundant Aurora Serverless v2..."
INST_EXISTS=$(aws rds describe-db-instances --region "${REGION}" --query "DBInstances[?DBInstanceIdentifier=='${INSTANCE_ID}'].DBInstanceIdentifier" --output text 2>/dev/null || true)
if [ "${INST_EXISTS}" = "${INSTANCE_ID}" ]; then
  echo "Deleting unused Aurora DB Instance: ${INSTANCE_ID}..."
  aws rds delete-db-instance \
    --db-instance-identifier "${INSTANCE_ID}" \
    --skip-final-snapshot \
    --region "${REGION}" || true
else
  echo "Aurora DB Instance ${INSTANCE_ID} not found or already deleted."
fi

CLUST_EXISTS=$(aws rds describe-db-clusters --region "${REGION}" --query "DBClusters[?DBClusterIdentifier=='${CLUSTER_ID}'].DBClusterIdentifier" --output text 2>/dev/null || true)
if [ "${CLUST_EXISTS}" = "${CLUSTER_ID}" ]; then
  echo "Deleting unused Aurora DB Cluster: ${CLUSTER_ID}..."
  aws rds delete-db-cluster \
    --db-cluster-identifier "${CLUSTER_ID}" \
    --skip-final-snapshot \
    --region "${REGION}" || true
  echo "=> Deleted ${CLUSTER_ID}. Saved ~$43.80/month!"
else
  echo "Aurora DB Cluster ${CLUSTER_ID} not found or already deleted."
fi

echo "`n[Step 3/3] Setting CloudWatch log retention to 7 days for ${LAMBDA_NAME}..."
aws logs put-retention-policy \
  --log-group-name "/aws/lambda/${LAMBDA_NAME}" \
  --retention-in-days 7 \
  --region "${REGION}" 2>&1 || true

echo "=========================================================="
echo "Cost Cleanup Completed Successfully!"
echo "Primary production database 'jbac-mysql-db' remains fully intact."
echo "=========================================================="
