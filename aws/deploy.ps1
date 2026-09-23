<#
.SYNOPSIS
    One-click deployment script to deploy the Angular web app to AWS S3 & CloudFront.
.PARAMETER BucketName
    Target S3 bucket name.
.PARAMETER DistributionId
    Optional CloudFront Distribution ID to invalidate.
#>
param(
    [Parameter(Mandatory=$false)]
    [string]$BucketName = "",

    [Parameter(Mandatory=$false)]
    [string]$DistributionId = "",

    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Angular Web App AWS Deployment Utility" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check AWS CLI
$awsCmd = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsCmd) {
    Write-Error "AWS CLI is required but not installed or not in PATH. Please install from https://aws.amazon.com/cli/ or via 'winget install Amazon.AWSCLI'."
    exit 1
}

# 2. Check Node & Build
Write-Host "`n[Step 1/3] Building Angular production bundle..." -ForegroundColor Green
& npm run build -- --configuration production
if ($LASTEXITCODE -ne 0) {
    Write-Error "Angular build failed."
    exit 1
}

# 3. Target S3 Bucket check
if ([string]::IsNullOrWhiteSpace($BucketName)) {
    $BucketName = Read-Host "Enter target AWS S3 Bucket Name"
}

Write-Host "`n[Step 2/3] Uploading compiled files to s3://$BucketName..." -ForegroundColor Green
& aws s3 sync dist/churchwebsite "s3://$BucketName" --delete --cache-control "public, max-age=31536000, immutable" --exclude "index.html" --region $Region
& aws s3 cp dist/churchwebsite/index.html "s3://$BucketName/index.html" --cache-control "no-cache, no-store, must-revalidate" --region $Region

# 4. Invalidate CloudFront
if ([string]::IsNullOrWhiteSpace($DistributionId)) {
    $DistributionId = Read-Host "Enter CloudFront Distribution ID (or press Enter to skip)"
}

if (-not [string]::IsNullOrWhiteSpace($DistributionId)) {
    Write-Host "`n[Step 3/3] Invalidating CloudFront cache ($DistributionId)..." -ForegroundColor Green
    & aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"
}

Write-Host "`n[SUCCESS] Web app successfully deployed to AWS!" -ForegroundColor Green
