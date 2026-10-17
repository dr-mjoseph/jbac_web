# Project Milestone & Roadmap: Completed Progress & Pending Launch Tasks

GitHub Issue: [#1](https://github.com/dr-mjoseph/jbac_web/issues/1)

---

## 🚀 1. Foundational Setup & Cloud Infrastructure
- [x] Initialize Git repository and project workspace structure
- [x] Configure Angular 15 web client with responsive multi-platform templates
- [x] Deploy private AWS S3 production bucket (`jbac-web-production-298363284024`) with static website hosting in `ap-southeast-2`
- [x] Build and deploy serverless Express API (`jbac-backend-api`) on AWS Lambda with API Gateway HTTP integration
- [x] Provision MySQL 8.4 database on AWS RDS (`db.t4g.micro`) with custom UTF-8 parameter group `jbac-mysql-84`
- [x] Migrate all 89 database tables (847 pastors, 509 churches, 17,244 panchayats, 836 mandals, 175 constituencies, 26 districts)

---

## 🔒 2. Security, KMS Encryption & SSL/TLS DNS Validation
- [x] Execute Zero-Downtime RDS Storage Encryption Migration to `jbac-mysql-db-v3` with AWS KMS encryption at rest
- [x] Safely capture final recovery snapshot `jbac-mysql-db-v2-final-snap` and terminate unencrypted instance `jbac-mysql-db-v2` to avoid duplicate billing
- [x] Request AWS ACM SSL Certificate (`arn:aws:acm:us-east-1:298363284024:certificate/afc4eb7f-c265-4fd1-b33d-a80692c82db9`) for `jbac.in` and `www.jbac.in`
- [x] Configure DNS CNAME validation records in GoDaddy authoritative DNS (`ns47.domaincontrol.com`, `ns48.domaincontrol.com`)
- [x] Verify global DNS propagation across Google (`8.8.8.8`) and Cloudflare (`1.1.1.1`)
- [x] AWS ACM Certificate successfully issued with `STATUS: ISSUED` (Amazon Trust Services)
- [x] Provision AWS CloudFront CDN distribution (`EOBBU8SU7H3BI` / `d2wtiz94oy03oy.cloudfront.net`) for `jbac.in` and `www.jbac.in` with custom ACM SSL certificate
- [x] Verify global HTTPS edge caching and SPA client-side routing (rewriting 403/404 to `/index.html` with status 200)
- [x] Provision AWS Route 53 Public Hosted Zone (`Z04439382BRRO1T3Y6B16`) and configure all active DNS records (CloudFront Alias, Microsoft 365 Outlook, ACM validation)
- [x] Update domain nameservers to AWS Route 53 and verify global resolution (achieving 100% serverless zero-hosting architecture)

---

## 🌐 3. Web Application Remediation & Audits
- [x] Remediate cascading location dropdowns (District ➔ Constituency ➔ Mandal ➔ Village/Panchayat)
- [x] Fix proof modal dismissal, profile image uploads, and type-of-payment bindings
- [x] Restore homepage 8-image banner carousel (`Banner01.png` – `Banner08.png`), sync media to AWS S3 & CloudFront, fix navigation arrows and dot indicators
- [x] Fix Pastors Association registration form validation (`pastorassociationregister`) and backend database column mapping
- [x] Compile clean production bundle in `dist/churchwebsite` with 0 compile errors
- [x] Maintain zero downtime on `https://jbac.in` across all cutover phases

---

## 🗄️ 4. Categorical Database Routing for Namodu & Entry Forms
- [x] Implement category-specific routing for `/namodu` and `/entry` registration forms:
  - When user selects "Student", data writes directly to `student_reg` table.
  - When user selects other categories, records write to their corresponding categorical tables (`church_reg`, `pastors_tbl`, etc.).
- [x] Decouple `/namodu` registrations completely from the general `reg_form` table to prevent table bloating and maintain clean categorical separation.
- [x] Ensure backwards compatibility for legacy `/entry` submissions while keeping specific categorical tables synchronized.

---

## 📱 5. Native Android Mobile App (`jbac_app`) & Google Play Release v0.0.32
- [x] **Google Play Automatic Protection Compliance**:
  - Upgraded `minSdkVersion` to `24` (Android 7.0+) to satisfy Google Play Console automatic app protection requirements.
  - Upgraded `targetSdkVersion` to `36` (Android 16 preview / Android 15 ready).
  - Version incremented to `versionCode 32`, `versionName 0.0.32`.
- [x] **Doctor / Counsellor Portal & Authentication**:
  - Added `డాక్టర్ / కౌన్సిలర్ (Doctor / Counsellor)` (category `8`) to the App Login category dropdown.
  - Configured login session handling to store `category: 'Doctor'`, `is_doctor: '1'`, and redirect directly to the Family Counselling dashboard.
  - Isolated Doctor portal views so they appear only on authenticated Doctor profiles, keeping standard user profiles uncluttered.
- [x] **Doctor Registration Form UI Redesign**:
  - Replaced `<ion-label floating>` with `<ion-label stacked>` across all form fields.
  - Eliminated label/placeholder double-text collisions and overlapping input borders.
  - Added clean input borders, white card backgrounds, and prominent dark labels with red required asterisks.
- [x] **Family Counselling Appointments & Navigation**:
  - Gated "Book Your Appointment" so unauthenticated users are guided to log in first rather than seeing raw forms.
  - Fixed unresponsive action buttons:
    - "Register here" on the Family Counselling dashboard.
    - "Doctor Register" in the login registration list.
    - "Doctor/Counselor Registration? Register here" on the login page.
    - Top-bar actions: "My Bookings", "Schedule", and "Profile Edit".
- [x] **Release Packaging & Signing**:
  - Automated release build with Gradle 7.4 daemon memory optimizations (`-Xmx3072m -Xss8m`).
  - Signed APK with `apksigner` using production `Jbac.keystore` (v1, v2, v3 schemes).
  - Signed AAB with `jarsigner` using production `Jbac.keystore`.
  - Verified outputs:
    - **Signed APK**: `jbacApp-0.0.32.apk` (118.68 MB)
    - **Signed AAB**: `jbacApp-0.0.32.aab` (115.81 MB)

---

## 🎯 6. Pending Launch & Post-Release Tasks
- [ ] Complete Google Play Console Review & Rollout for Release 32.
- [ ] Monitor crash telemetry and user feedback via Google Play Console dashboard.
- [ ] Run automated end-to-end smoke testing across all live production forms on `https://jbac.in`.
