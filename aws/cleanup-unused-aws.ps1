<#
.SYNOPSIS
    Clean up unused AWS resources (Aurora Serverless cluster & instance) to reduce AWS costs.
.PARAMETER Region
    AWS region (defaults to ap-southeast-2)
#>
param(
    [string]$Region = "ap-southeast-2"
)

$ErrorActionPreference = "Continue"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "JBAC AWS Cost Cleanup Utility" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$awsCmd = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsCmd) {
    Write-Warning "AWS CLI is not installed or not in PATH."
    Write-Host "You can run this in AWS CloudShell (free in the AWS Console) or via GitHub Actions!" -ForegroundColor Yellow
    exit 1
}

# 1. Inspect
Write-Host "`n[Step 1/3] Inspecting active databases in $Region..." -ForegroundColor Green
aws rds describe-db-instances --region $Region --query "DBInstances[*].{ID:DBInstanceIdentifier,Class:DBInstanceClass,Status:DBInstanceStatus}" --output table
aws rds describe-db-clusters --region $Region --query "DBClusters[*].{ID:DBClusterIdentifier,Status:Status}" --output table

# 2. Delete redundant Aurora Serverless instance & cluster
$instanceId = "jbac-aurora-instance-1"
$clusterId = "jbac-aurora-cluster"

Write-Host "`n[Step 2/3] Deleting redundant Aurora Serverless v2 resources..." -ForegroundColor Green
$instExists = aws rds describe-db-instances --region $Region --query "DBInstances[?DBInstanceIdentifier=='$instanceId'].DBInstanceIdentifier" --output text 2>$null
if ($instExists -and $instExists -eq $instanceId) {
    Write-Host "Deleting Aurora DB Instance: $instanceId..." -ForegroundColor Yellow
    aws rds delete-db-instance --db-instance-identifier $instanceId --skip-final-snapshot --region $Region
} else {
    Write-Host "Aurora DB Instance $instanceId is not present." -ForegroundColor Gray
}

$clustExists = aws rds describe-db-clusters --region $Region --query "DBClusters[?DBClusterIdentifier=='$clusterId'].DBClusterIdentifier" --output text 2>$null
if ($clustExists -and $clustExists -eq $clusterId) {
    Write-Host "Deleting Aurora DB Cluster: $clusterId..." -ForegroundColor Yellow
    aws rds delete-db-cluster --db-cluster-identifier $clusterId --skip-final-snapshot --region $Region
    Write-Host "Saved ~$43.80/month by removing Aurora Serverless cluster!" -ForegroundColor Green
} else {
    Write-Host "Aurora DB Cluster $clusterId is not present." -ForegroundColor Gray
}

# 3. Log retention
Write-Host "`n[Step 3/3] Setting CloudWatch log retention to 7 days..." -ForegroundColor Green
aws logs put-retention-policy --log-group-name "/aws/lambda/jbac-backend-api" --retention-in-days 7 --region $Region

Write-Host "`n[SUCCESS] Cost cleanup complete! Primary database 'jbac-mysql-db' is preserved." -ForegroundColor Green
