# Project Journal & End-to-End Execution Log

This document provides a comprehensive, chronological record of all discussions, architectural decisions, technical implementations, troubleshooting steps, and final outcomes from the session.

---

## 1. Initial Objectives & User Requirements

The user requested:
1. **Deploy Web Application to AWS with Database**:
   - Host the Angular web application on AWS with production reliability.
   - Deploy MySQL database on AWS using the provided 2.5 MB database dump ([Google Drive link / `db_structure.sql`]).
2. **Simultaneous Web & Android Development with Automatic Synchronization**:
   - Maintain the web app and Android mobile app simultaneously.
   - Automatically synchronize changes made in the web app into the mobile app repository ([`jbac_app`](https://github.com/dr-mjoseph/jbac_app)).
3. **Handle Renamed Repositories & Account**:
   - Web App: [`https://github.com/dr-mjoseph/jbac_web.git`](https://github.com/dr-mjoseph/jbac_web.git)
   - Mobile App: [`https://github.com/dr-mjoseph/jbac_app.git`](https://github.com/dr-mjoseph/jbac_app.git) (formerly `mjosephp7-dot/jbscapp_new`)
   - GitHub Username: `dr-mjoseph`

---

## 2. Codebase Discovery & Architectural Analysis

### Web Application Analysis (`jbac_web`)
- **Framework**: Angular 15.2 (`@angular/core`: `^15.2.10`, TypeScript `4.8.4`).
- **Structure**: 60+ components inside `src/app/jesus` covering directory, news, events, jobs, registrations, etc.
- **Identified Issue**: API URL was hardcoded directly in [`src/app/jesus/service.service.ts`](src/app/jesus/service.service.ts):
  `testApi = 'https://jbac.in:9762/dashboardapi/'`
- **Solution Needed**: Decouple environment URLs to support local, staging, and AWS production endpoints.

### Mobile Application Analysis (`jbac_app`)
- **Framework**: Legacy Ionic 3 / Cordova (`ionic-angular`: `3.9.9`, `@angular/core`: `5.2.11`, `cordova-android`: `10.1.2`).
- **Structure**: Standalone mobile views mirroring web app features and calling identical REST API endpoints.
- **Challenge**: Two codebases on different Angular versions (Angular 15 vs Angular 5).
- **Solution Needed**: An automated synchronization pipeline (CI/CD + script) that compiles the latest web build and pushes updated assets/code to the mobile repository.

### Database Analysis (`jbac_structure.sql`)
- Downloaded and bundled 2.5 MB MySQL 8.0 dump (`jbac_jbac`) containing 40+ relational tables (`about_tbl`, `adds_data`, `belivers_tbl`, `church_reg`, `events`, `jobs`, `pastors_tbl`, etc.).

---

## 3. Implementation Details

### A. Environment Configuration & Decoupling
1. **Created [`src/environments/environment.ts`](src/environments/environment.ts)**: Configured for local development (`http://localhost:1430/dashboardapi/`).
2. **Created [`src/environments/environment.prod.ts`](src/environments/environment.prod.ts)**: Configured for production (`https://jbac.in:9762/dashboardapi/`).
3. **Updated [`angular.json`](angular.json)**: Added `fileReplacements` under `configurations.production`.
4. **Refactored [`src/app/jesus/service.service.ts`](src/app/jesus/service.service.ts)**: Swapped hardcoded string with dynamic `environment.apiUrl`.

### B. AWS Infrastructure & Deployment Templates
1. **Database Dump Versioning**: Bundled dump file to [`database/jbac_structure.sql`](database/jbac_structure.sql).
2. **AWS RDS MySQL Template ([`aws/rds-mysql-template.yml`](aws/rds-mysql-template.yml))**: CloudFormation template provisioning a MySQL 8.0 instance (Free-Tier eligible `db.t4g.micro`, 20GB gp3 storage, utf8mb4 encoding, automated backups).
3. **AWS S3 + CloudFront Template ([`aws/s3-cloudfront-template.yml`](aws/s3-cloudfront-template.yml))**: Production template for S3 + CloudFront CDN + custom error rewrites for Angular HTML5 client-side routing.
4. **AWS S3 Static Website Template ([`aws/s3-static-website-template.yml`](aws/s3-static-website-template.yml))**: Direct S3 static website hosting template with SPA error document routing (bypasses CloudFront verification holds for new AWS accounts).
5. **Database Import Utilities**:
   - PowerShell: [`aws/import-db.ps1`](aws/import-db.ps1)
   - Bash: [`aws/import-db.sh`](aws/import-db.sh)
6. **Containerization**: Added [`Dockerfile`](Dockerfile) (multi-stage Node -> Nginx Alpine) and [`nginx.conf`](nginx.conf).

### C. Web-to-Android Auto-Sync Engine
1. **Automated Cross-Repo GitHub Action ([`.github/workflows/sync-mobile.yml`](.github/workflows/sync-mobile.yml))**:
   - Triggers on every push to `jbac_web` on `main`.
   - Compiles web production bundle.
   - Checks out [`dr-mjoseph/jbac_app`](https://github.com/dr-mjoseph/jbac_app).
   - Syncs compiled assets, media, and metadata.
   - Commits and pushes updates automatically.
2. **Local CLI Sync Script ([`scripts/sync-to-mobile.js`](scripts/sync-to-mobile.js))**: Run `npm run sync:mobile` to sync locally.
3. **Capacitor Configuration ([`capacitor.config.json`](capacitor.config.json))**: Configured modern Android runtime allowing native APK builds compliant with Google Play Store API 34+.
4. **New npm Scripts ([`package.json`](package.json))**:
   - `npm run build:prod`
   - `npm run sync:mobile`
   - `npm run deploy:aws`
   - `npm run import:db`

---

## 4. Chronological Troubleshooting Log & Resolutions

### Issue 1: GitHub Username & Repository Renaming
- **User Action**: Renamed GitHub username to `dr-mjoseph`, web repo to `jbac_web`, mobile repo to `jbac_app`.
- **Resolution**:
  - Updated local Git remote: `git remote set-url origin https://github.com/dr-mjoseph/jbac_web.git`.
  - Updated target repo references in [`.github/workflows/sync-mobile.yml`](.github/workflows/sync-mobile.yml) and [`scripts/sync-to-mobile.js`](scripts/sync-to-mobile.js).
  - Clarified that the local computer folder name does not affect Git operations.

### Issue 2: PowerShell Execution Policy Restriction
- **Error**: `.\aws\import-db.ps1 cannot be loaded because running scripts is disabled on this system. (PSSecurityException)`.
- **Resolution**:
  - Run with bypass: `powershell -ExecutionPolicy Bypass -File .\aws\import-db.ps1 ...`
  - Permanent fix: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.

### Issue 3: SQL File Path Resolution in PowerShell Subprocess
- **Error**: `Database SQL file not found at: /../database/jbac_structure.sql`.
- **Root Cause**: `$PSScriptRoot` was not bound during parameter binding in child PowerShell processes.
- **Resolution**: Updated [`aws/import-db.ps1`](aws/import-db.ps1) with a multi-path resolution strategy checking `(Get-Location)`, `$PSScriptRoot`, and relative paths.

### Issue 4: MySQL Command Line Client Not Found
- **Warning**: `'mysql' CLI client not found in PATH`.
- **User Action**: Installed MySQL Server 8.4 on Windows.
- **Resolution**: Updated [`aws/import-db.ps1`](aws/import-db.ps1) to auto-detect MySQL at `C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe`.

### Issue 5: Locating / Resetting AWS RDS Master Password
- **User Query**: Where to find the RDS master password.
- **Resolution**: Explained that AWS does not store passwords in plaintext for security, and provided click-by-click instructions to modify/reset the password in the AWS RDS Console with **Apply immediately**.

### Issue 6: Foreign Key Reference Typo (`ERROR 1824`)
- **Error**: `ERROR 1824 (HY000) at line 25439: Failed to open the referenced table 'dstrct1'`.
- **Root Cause**: SQL dump had an invalid foreign key constraint referencing non-existent table `dstrct1` instead of `dstrct`.
- **Resolution**:
  - Corrected `dstrct1` ➔ `dstrct` on line 25440 of [`database/jbac_structure.sql`](database/jbac_structure.sql).
  - Added `SET FOREIGN_KEY_CHECKS = 0;` at the beginning and `SET FOREIGN_KEY_CHECKS = 1;` at the end of the SQL dump.
  - Added `--init-command="SET FOREIGN_KEY_CHECKS=0;"` to [`aws/import-db.ps1`](aws/import-db.ps1) and [`aws/import-db.sh`](aws/import-db.sh).

### Issue 7: Duplicate Table on Retry (`ERROR 1050`)
- **Error**: `ERROR 1050 (42S01) at line 31: Table 'about_tbl' already exists`.
- **Root Cause**: The first failed run had already created earlier tables before failing at line 25439.
- **Resolution**: Added `DROP DATABASE IF EXISTS jbac_jbac; CREATE DATABASE jbac_jbac; USE jbac_jbac;` to the top of [`database/jbac_structure.sql`](database/jbac_structure.sql) to ensure every import run starts with a clean slate.

### Issue 8: CloudFront Account Verification Hold
- **Error**: `CREATE_FAILED: Resource handler returned message: "Access denied for operation 'AWS::CloudFront::Distribution': Your account must be verified before you can add new CloudFront resources."`.
- **Root Cause**: AWS puts a temporary hold on CloudFront distributions for newly registered AWS accounts.
- **Resolution**: Created [`aws/s3-static-website-template.yml`](aws/s3-static-website-template.yml) which uses S3 Static Website Hosting directly. Deploys in 20 seconds with zero verification requirements.

### Issue 9: GitHub Secrets Naming Discrepancy
- **User Question**: Clarified whether `CloudFrontDistributionId` was required and reviewed user's secrets screenshot (`BUCKETNAME` instead of `AWS_S3_BUCKET`).
- **Resolution**:
  - Clarified that `CloudFrontDistributionId` is not needed for direct S3 hosting.
  - Updated [`.github/workflows/deploy-web-aws.yml`](.github/workflows/deploy-web-aws.yml) to accept `secrets.BUCKETNAME` or `secrets.AWS_S3_BUCKET` interchangeably.

### Issue 10: GitHub Actions Workflow Syntax Error
- **Error**: `Unrecognized named-value: 'secrets'. Located at position 1 within expression: secrets.AWS_CLOUDFRONT_DISTRIBUTION_ID != ''`.
- **Root Cause**: GitHub Actions does not allow direct access to the `secrets` context inside an `if:` condition at the step level.
- **Resolution**: Refactored the step in [`.github/workflows/deploy-web-aws.yml`](.github/workflows/deploy-web-aws.yml) to map the secret to an environment variable (`CF_DIST_ID`) and perform the check inside the script block.

---

## 5. Current State & Verification Checklist

| Component | Status | Location / Command |
|---|---|---|
| **Git Remote** | Connected | `https://github.com/dr-mjoseph/jbac_web.git` |
| **Mobile Target** | Connected | `https://github.com/dr-mjoseph/jbac_app.git` |
| **MySQL RDS Instance** | Active (Sydney) | `jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com` |
| **Database Dump** | Fixed & Ready | [`database/jbac_structure.sql`](database/jbac_structure.sql) |
| **Database Import Tool** | Auto-Detects MySQL | `.\aws\import-db.ps1` |
| **Web S3 Hosting** | Template Ready | [`aws/s3-static-website-template.yml`](aws/s3-static-website-template.yml) |
| **CI/CD Web Deploy** | Validated | [`.github/workflows/deploy-web-aws.yml`](.github/workflows/deploy-web-aws.yml) |
| **CI/CD Mobile Sync** | Validated | [`.github/workflows/sync-mobile.yml`](.github/workflows/sync-mobile.yml) |
| **Documentation** | Complete | [`AWS_DEPLOYMENT_AND_SYNC_GUIDE.md`](AWS_DEPLOYMENT_AND_SYNC_GUIDE.md) |

---

## 6. Mobile App UI Synchronization Update (September 2026)

### Issue Identified
1. The mobile app repository (`dr-mjoseph/jbac_app`) appeared outdated because `.gitignore` in `jbac_app` was ignoring `/www`.
2. When the synchronization ran, Git skipped the compiled web distribution (`www/index.html`, JavaScript bundles, and CSS) and only committed `sync-metadata.json`.
3. The modern Angular 15 source components were also missing from the mobile repository root, leaving only legacy 2022 Ionic 3 templates.

### Resolution Implemented
1. **Un-ignored `www/`**: Modified `jbac_app/.gitignore` to track `!www/**`.
2. **Post-processed `index.html`**: Configured `<base href="./">` and injected `<script src="cordova.js"></script>` for seamless Cordova and WebView asset loading.
3. **Mirrored Modern Source Tree**: Synchronized all Angular 15 components (`src/app/`, `src/environments/`, `styles.css`, `custom-theme.scss`) into `web-src/` in the mobile repository.
4. **Compiled Production Bundle**: Generated fresh production build (`dist/churchwebsite`) and staged `www/` and `web-src/`.
5. **Committed & Pushed**:
   - `dr-mjoseph/jbac_app`: Commit `4465840` pushed to `main`.
   - `dr-mjoseph/jbac_web`: Commit `42b6461` pushed to `main` with enhanced sync script and CI/CD workflow.

---

## 7. Mobile App "Current Location" Button Resolution (AddMeetings Page)

### Problem Description
In `jbac_web`, the `addmeetings` page featured a "Current Location" (`కరెంటు లొకేషన్ నమోదు కోసం క్లిక్`) button that successfully queried device GPS or IP fallback and auto-populated the meeting's Google Maps URL and human-readable reverse geocoded address.
However, in the mobile application (`jbac_app`), when users registered, logged in, and navigated to the Add Meetings screen, the "Current Location" button and its functionality were missing.

### Root Cause Analysis
1. **Architectural Separation**: The mobile app project (`C:\Users\rajes\StudioProjects\jbac_app`) runs an Ionic 3 mobile UI (`src/pages/addmeetings/addmeetings.html` and `addmeetings.ts`), whereas the web app is an Angular 15 project.
2. **Missing Implementation in Mobile Repository**: The "Current Location" button and its reverse geocoding / GPS methods were only implemented in `jbac_web` (`src/app/jesus/addmeetings/`) and had never been ported to `jbac_app`'s `AddmeetingsPage`.
3. **Missing Android Permissions**: Neither `config.xml` nor `platforms/android/app/src/main/AndroidManifest.xml` had `ACCESS_FINE_LOCATION` or `ACCESS_COARSE_LOCATION` permissions declared, preventing the WebView from requesting GPS location on Android.
4. **Local Path Resolution**: `scripts/sync-to-mobile.js` searched for sibling folders in `Documents/` but did not include Android Studio's default folder (`StudioProjects/jbac_app`).

### Resolutions Implemented
1. **Updated Mobile HTML Template ([`jbac_app/src/pages/addmeetings/addmeetings.html`](https://github.com/dr-mjoseph/jbac_app/blob/main/src/pages/addmeetings/addmeetings.html))**:
   - Added the primary "Current Location" button (`(click)="useCurrentLocation()"`).
   - Added responsive feedback states: loading spinner, warning alert, success badge, and location source indicator.
2. **Implemented Mobile Geolocation & Reverse Geocoding ([`jbac_app/src/pages/addmeetings/addmeetings.ts`](https://github.com/dr-mjoseph/jbac_app/blob/main/src/pages/addmeetings/addmeetings.ts))**:
   - Injected `NgZone` and `ChangeDetectorRef`.
   - Implemented `useCurrentLocation()` with HTML5 Geolocation (`navigator.geolocation.getCurrentPosition`).
   - Integrated reverse geocoding via BigDataCloud API + OpenStreetMap Nominatim.
   - Built a network IP fallback (`https://ipapi.co/json/`) for devices where GPS signal or permission is unavailable.
   - Auto-patches both `location` (Google Maps URL) and `address` (locality & city name) in `this.form`.
3. **Configured Android Permissions**:
   - Added `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, and `android.hardware.location.gps` to `config.xml` and `AndroidManifest.xml`.
4. **Patched Compiled Web Bundles**:
   - Updated `www/build/39.js` and `platforms/android/app/src/main/assets/www/build/39.js` to ensure immediate availability in Android Studio builds and live APKs.
5. **Enhanced Sync Engine ([`scripts/sync-to-mobile.js`](scripts/sync-to-mobile.js))**:
   - Added `StudioProjects/jbac_app` to auto-detection paths.
   - Integrated `scripts/apply_all_patches.ps1` to ensure mobile templates and permissions stay updated during sync.
6. **Committed & Pushed**:
   - `dr-mjoseph/jbac_app`: Committed `92fbf54` and pushed to `main`.

---

## 8. Database Structure & Live AWS RDS Synchronization (September 26, 2026)

### Summary of Database Updates
1. **SQL Dump Synchronized ([`database/jbac_structure.sql`](database/jbac_structure.sql))**:
   - Updated dump timestamp to `Generation Time: Sep 25, 2026 at 05:05 PM` (MySQL 8.0.46 / PHP 8.4.25).
   - Added new service timings row `17` in `church_timings` (`Sunday Service` at `Test Church`).
   - Added new enquiry row `12` in `contactus` (`URXkZfZWrxQomveciwNSp`).
   - Normalized and cleaned non-breaking whitespace (`\u00a0`) in `banner_dlt_t` (`నాయకుల వాగ్దానం`) and `church_reg`.
2. **AWS RDS Database Updated & Verified**:
   - Connected directly to live AWS RDS MySQL (`jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com`).
   - Inserted `church_timings` row 17 and `contactus` row 12.
   - Updated category names and table strings in `banner_dlt_t` and `church_reg`.
   - Re-applied all 21 compatibility views (`denominations`, `churches`, `pastors`, `meetings`, `ads`, `news`, etc.).
3. **Production Web Application Compiled**:
   - Compiled Angular 15 production distribution with `--configuration production`.
   - Verified all endpoints against AWS API Gateway (`https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/`).
4. **Mobile Application Synchronized**:
   - Synced latest compiled assets (`www/`) and mirrored source code (`web-src/`) to `C:\Users\rajes\StudioProjects\jbac_app`.
   - Committed and pushed to `dr-mjoseph/jbac_app` on `main`.


