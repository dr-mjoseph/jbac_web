# Complete Guide: AWS Deployment (Web + MySQL DB) & Web-to-Android Auto-Sync

This repository is configured to deploy the Angular web application and MySQL database to Amazon Web Services (AWS) with automated continuous deployment (CI/CD) and automated synchronization with the Android mobile application ([`jbac_app`](https://github.com/dr-mjoseph/jbac_app)).

---

## Architecture Overview

```
                      +---------------------------------------+
                      |     Developer Push to jbac_web        |
                      +---------------------------------------+
                                          |
                +-------------------------+-------------------------+
                |                                                   |
                v                                                   v
   [GitHub Action: deploy-web-aws]                     [GitHub Action: sync-mobile]
                |                                                   |
      Builds Angular 15 App                               Builds Production Web App
                |                                                   |
                v                                                   v
      Deploys to AWS S3 &                                 Syncs to jbac_app
      Invalidates CloudFront CDN                          (Commits & pushes to GitHub)
                |                                                   |
                v                                                   v
+-------------------------------+                   +-------------------------------+
|  AWS CloudFront + S3 (Web)    |                   |  Mobile App Repository        |
|  https://yourdomain.com       |                   |  (Android APK / AAB build)    |
+-------------------------------+                   +-------------------------------+
                |                                                   |
                +-------------------+   +---------------------------+
                                    |   |
                                    v   v
                        +-------------------------------+
                        |   Backend API (dashboardapi)   |
                        |   https://api.yourdomain.com   |
                        +-------------------------------+
                                        |
                                        v
                        +-------------------------------+
                        |   AWS RDS MySQL Database       |
                        |   jbac_jbac (Port 3306)       |
                        +-------------------------------+
```

---

## Part 1: Setting Up the MySQL Database in AWS

Your database structure and data are stored in [`database/jbac_structure.sql`](database/jbac_structure.sql).

### Method A: Automated Deployment via AWS CloudFormation (Recommended)

1. Open the [AWS CloudFormation Console](https://console.aws.amazon.com/cloudformation).
2. Click **Create stack** -> **With new resources (standard)**.
3. Select **Upload a template file** and choose [`aws/rds-mysql-template.yml`](aws/rds-mysql-template.yml).
4. Enter parameters:
   - **Stack name**: `jbac-mysql-stack`
   - **DBInstanceClass**: `db.t4g.micro` or `db.t3.micro` (AWS Free Tier eligible)
   - **MasterUsername**: `admin`
   - **MasterUserPassword**: Set a secure password.
   - **VpcId**: Select your AWS default VPC ID.
5. Click **Next** through the wizard and **Submit**.
6. When status reaches `CREATE_COMPLETE`, view the **Outputs** tab to copy your **DBEndpoint** (e.g. `jbac-mysql-db.cxxxxxx.us-east-1.rds.amazonaws.com`).

### Method B: Restoring the Database Dump into AWS RDS

Run the automated import script from your terminal:

**On Windows (PowerShell):**
```powershell
.\aws\import-db.ps1 -Hostname "<YOUR-RDS-ENDPOINT>" -Username "admin" -DatabaseName "jbac_jbac"
```

**On Linux / macOS / CloudShell:**
```bash
chmod +x ./aws/import-db.sh
./aws/import-db.sh "<YOUR-RDS-ENDPOINT>" "admin" "jbac_jbac"
```

*Note: You can also use MySQL Workbench, DBeaver, or Navicat to import `database/jbac_structure.sql`.*

---

## Part 2: Deploying the Web App to AWS (S3 + CloudFront)

### Method A: Automated Provisioning via CloudFormation

1. In the AWS CloudFormation Console, click **Create stack** -> **Upload a template file** and choose [`aws/s3-cloudfront-template.yml`](aws/s3-cloudfront-template.yml).
2. Enter parameters:
   - **ProjectName**: `churchwebsite`
   - **Environment**: `production`
3. Click **Submit**. CloudFormation will provision:
   - A private, encrypted S3 bucket.
   - A global CloudFront CDN distribution with HTTPS redirection.
   - Custom SPA error rewrites (redirecting 403/404 to `/index.html` with status 200) ensuring Angular direct routing works smoothly.
4. Note the outputs:
   - `BucketName`
   - `CloudFrontDistributionId`
   - `WebsiteURL`

### Method B: Deploying Updates

#### 1. Via Automated GitHub Actions (Continuous Deployment)
In your GitHub repository ([`jbac_web`](https://github.com/dr-mjoseph/jbac_web)), navigate to **Settings** -> **Secrets and variables** -> **Actions** and add the following secrets:
- `AWS_ACCESS_KEY_ID`: Your AWS IAM access key ID.
- `AWS_SECRET_ACCESS_KEY`: Your AWS IAM secret access key.
- `AWS_REGION`: e.g. `us-east-1` (or `ap-south-1`)
- `AWS_S3_BUCKET`: The S3 bucket name created in Step 1.
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`: The CloudFront distribution ID.

Now, whenever you push any changes to `main`, `.github/workflows/deploy-web-aws.yml` will automatically build the app and deploy it to AWS!

#### 2. Via Local Command Line
```powershell
npm run deploy:aws
```

---

## Part 3: Simultaneous Development & Automatic Sync to Android Mobile App

Whenever you make changes to your web application, you want the mobile application ([`jbac_app`](https://github.com/dr-mjoseph/jbac_app)) to automatically receive the updates.

### 1. Automatic GitHub Sync Workflow (Zero Manual Effort)

We created [`.github/workflows/sync-mobile.yml`](.github/workflows/sync-mobile.yml).

#### How to configure:
1. Generate a GitHub Personal Access Token (Classic) with `repo` permissions:
   - Go to [GitHub Token Settings](https://github.com/settings/tokens).
   - Click **Generate new token (classic)**, check `repo` scope, and copy the token.
2. In your web app repo ([`jbac_web`](https://github.com/dr-mjoseph/jbac_web)):
   - Go to **Settings** -> **Secrets and variables** -> **Actions**.
   - Click **New repository secret**.
   - Name: `MOBILE_REPO_PAT`
   - Value: Paste your Personal Access Token.
3. That's it! Every time you commit and push changes to `jbac_web`:
   - GitHub Actions automatically compiles the web app.
   - Synchronizes the compiled assets, services, and media to [`jbac_app`](https://github.com/dr-mjoseph/jbac_app).
   - Commits and pushes the update directly into the mobile app repository.

### 2. Manual 1-Command Local Sync

You can also trigger synchronization directly from your development machine:

```bash
# Sync web app changes to sibling directory ../jbac_app
npm run sync:mobile

# Or sync and automatically push commits to GitHub
node scripts/sync-to-mobile.js --push
```

### 3. Modern Android Build (Capacitor)

The project includes [`capacitor.config.json`](capacitor.config.json) which enables building a native Android APK/AAB directly from this Angular 15 codebase using modern Android SDKs:

```bash
# 1. Build production web bundle
npm run build:prod

# 2. Sync to Android
npx cap sync android

# 3. Open in Android Studio to run on an emulator or generate signed AAB/APK
npx cap open android
```

---

## Summary of New Files Added

| File | Purpose |
|---|---|
| [`src/environments/environment.ts`](src/environments/environment.ts) | Development API configuration |
| [`src/environments/environment.prod.ts`](src/environments/environment.prod.ts) | Production AWS API configuration |
| [`database/jbac_structure.sql`](database/jbac_structure.sql) | Full MySQL 8.0 schema and data dump |
| [`aws/s3-cloudfront-template.yml`](aws/s3-cloudfront-template.yml) | CloudFormation template for S3 + CloudFront CDN |
| [`aws/rds-mysql-template.yml`](aws/rds-mysql-template.yml) | CloudFormation template for AWS RDS MySQL 8.0 |
| [`aws/import-db.ps1`](aws/import-db.ps1) | PowerShell script to import database dump into AWS RDS |
| [`aws/import-db.sh`](aws/import-db.sh) | Bash script to import database dump into AWS RDS |
| [`aws/deploy.ps1`](aws/deploy.ps1) | PowerShell one-click AWS web deployment script |
| [`Dockerfile`](Dockerfile) & [`nginx.conf`](nginx.conf) | Production Docker container configuration |
| [`.github/workflows/deploy-web-aws.yml`](.github/workflows/deploy-web-aws.yml) | GitHub Action for AWS S3/CloudFront continuous deployment |
| [`scripts/sync-to-mobile.js`](scripts/sync-to-mobile.js) | Synchronization engine from web app to mobile app |
| [`.github/workflows/sync-mobile.yml`](.github/workflows/sync-mobile.yml) | GitHub Action for auto-syncing web changes to mobile repo |
| [`capacitor.config.json`](capacitor.config.json) | Modern native Android build configuration |
