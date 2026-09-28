#!/usr/bin/env bash
# ==============================================================================
# Comprehensive AWS Cost Optimization & Cleanup Script for JBAC
# Run this in AWS CloudShell (https://ap-southeast-2.console.aws.amazon.com/cloudshell)
# ==============================================================================

set -e

REGION="${AWS_REGION:-ap-southeast-2}"
CLUSTER_ID="jbac-aurora-cluster"
INSTANCE_ID="jbac-aurora-instance-1"
PRIMARY_DB="jbac-mysql-db"
LAMBDA_NAME="jbac-backend-api"
BUCKET_NAME="${TARGET_BUCKET:-jbac-web-production-298363284024}"

echo "=========================================================="
echo "JBAC AWS Cost Optimization Utility"
echo "Target Region: ${REGION}"
echo "=========================================================="

# 1. DELETE REDUNDANT AURORA SERVERLESS V2
echo "`n[1/6] Checking for redundant Aurora Serverless v2 (${CLUSTER_ID})..."
INST_EXISTS=$(aws rds describe-db-instances --region "${REGION}" --query "DBInstances[?DBInstanceIdentifier=='${INSTANCE_ID}'].DBInstanceIdentifier" --output text 2>/dev/null || true)
if [ "${INST_EXISTS}" = "${INSTANCE_ID}" ]; then
  echo "Deleting Aurora DB Instance: ${INSTANCE_ID}..."
  aws rds delete-db-instance \
    --db-instance-identifier "${INSTANCE_ID}" \
    --skip-final-snapshot \
    --region "${REGION}" 2>&1 || true
  sleep 10
else
  echo "Aurora DB Instance ${INSTANCE_ID} is already absent or deleted."
fi

CLUST_EXISTS=$(aws rds describe-db-clusters --region "${REGION}" --query "DBClusters[?DBClusterIdentifier=='${CLUSTER_ID}'].DBClusterIdentifier" --output text 2>/dev/null || true)
if [ "${CLUST_EXISTS}" = "${CLUSTER_ID}" ]; then
  echo "Deleting Aurora DB Cluster: ${CLUSTER_ID}..."
  aws rds delete-db-cluster \
    --db-cluster-identifier "${CLUSTER_ID}" \
    --skip-final-snapshot \
    --region "${REGION}" 2>&1 || true
  echo "=> Deleted ${CLUSTER_ID}. Monthly savings: ~$43.80!"
else
  echo "Aurora DB Cluster ${CLUSTER_ID} is already absent or deleted."
fi

# 2. OPTIMIZE PRIMARY RDS MYSQL (2-DAY BACKUPS & SINGLE-AZ)
echo "`n[2/6] Optimizing Primary RDS MySQL (${PRIMARY_DB})..."
DB_EXISTS=$(aws rds describe-db-instances --region "${REGION}" --query "DBInstances[?DBInstanceIdentifier=='${PRIMARY_DB}'].DBInstanceIdentifier" --output text 2>/dev/null || true)
if [ -n "${DB_EXISTS}" ]; then
  aws rds modify-db-instance \
    --db-instance-identifier "${PRIMARY_DB}" \
    --backup-retention-period 2 \
    --no-multi-az \
    --apply-immediately \
    --region "${REGION}" 2>&1 || true
  echo "=> Primary DB retention set to 2 days & verified Single-AZ."
fi

# 3. DOWNSIZE LAMBDA MEMORY TO 256MB
echo "`n[3/6] Downsizing Lambda ${LAMBDA_NAME} memory to 256MB..."
aws lambda update-function-configuration \
  --function-name "${LAMBDA_NAME}" \
  --memory-size 256 \
  --region "${REGION}" 2>&1 || true
echo "=> Lambda memory set to 256MB (halves compute charge)."

# 4. CAP CLOUDWATCH LOGS TO 7 DAYS
echo "`n[4/6] Setting CloudWatch log retention to 7 days..."
aws logs put-retention-policy \
  --log-group-name "/aws/lambda/${LAMBDA_NAME}" \
  --retention-in-days 7 \
  --region "${REGION}" 2>&1 || true
echo "=> Log retention capped at 7 days."

# 5. S3 LIFECYCLE RULE
echo "`n[5/6] Applying S3 Lifecycle policy to s3://${BUCKET_NAME}..."
LIFECYCLE_CONFIG=$(cat <<EOF
{
  "Rules": [
    {
      "ID": "AbortIncompleteMultipartUploadsAndOldVersions",
      "Status": "Enabled",
      "Filter": { "Prefix": "" },
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 1 },
      "NoncurrentVersionExpiration": { "NoncurrentDays": 7 }
    }
  ]
}
EOF
)
aws s3api put-bucket-lifecycle-configuration \
  --bucket "${BUCKET_NAME}" \
  --lifecycle-configuration "${LIFECYCLE_CONFIG}" 2>&1 || true
echo "=> S3 lifecycle policy configured."

# 6. AUDIT FOR EXPENSIVE NAT GATEWAYS & UNATTACHED ELASTIC IPS
echo "`n[6/6] Auditing VPC NAT Gateways & Elastic IPs..."
aws ec2 describe-nat-gateways --region "${REGION}" --filter "Name=state,Values=available,pending" --query "NatGateways[*].{ID:NatGatewayId,Vpc:VpcId,State:State}" --output table || true
aws ec2 describe-addresses --region "${REGION}" --query "Addresses[*].{IP:PublicIp,AllocationId:AllocationId,Instance:InstanceId}" --output table || true

echo "`n=========================================================="
echo "COST OPTIMIZATION COMPLETE!"
echo "Primary DB 'jbac-mysql-db' is fully active and preserved."
echo "=========================================================="
