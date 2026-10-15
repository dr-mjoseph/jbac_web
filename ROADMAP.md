# Project Milestone & Roadmap: Completed Progress & Pending Launch Tasks

GitHub Issue: [#1](https://github.com/dr-mjoseph/jbac_web/issues/1)

## 🚀 Foundational Setup & Cloud Infrastructure
- [x] Initialize Git repository and project workspace structure
- [x] Configure Angular 15 web client with responsive multi-platform templates
- [x] Deploy private AWS S3 production bucket (`jbac-web-production-298363284024`) with static website hosting in `ap-southeast-2`
- [x] Build and deploy serverless Express API (`jbac-backend-api`) on AWS Lambda with API Gateway HTTP integration
- [x] Provision MySQL 8.4 database on AWS RDS (`db.t4g.micro`) with custom UTF-8 parameter group `jbac-mysql-84`
- [x] Migrate all 89 database tables (847 pastors, 509 churches, 17,244 panchayats, 836 mandals, 175 constituencies, 26 districts)

## 🔒 Security, KMS Encryption & SSL/TLS DNS Validation
- [x] Execute Zero-Downtime RDS Storage Encryption Migration to `jbac-mysql-db-v3` with AWS KMS encryption at rest
- [x] Safely capture final recovery snapshot `jbac-mysql-db-v2-final-snap` and terminate unencrypted instance `jbac-mysql-db-v2` to avoid duplicate billing
- [x] Request AWS ACM SSL Certificate (`arn:aws:acm:us-east-1:298363284024:certificate/afc4eb7f-c265-4fd1-b33d-a80692c82db9`) for `jbac.in` and `www.jbac.in`
- [x] Configure DNS CNAME validation records in GoDaddy authoritative DNS (`ns47.domaincontrol.com`, `ns48.domaincontrol.com`)
- [x] Verify global DNS propagation across Google (`8.8.8.8`) and Cloudflare (`1.1.1.1`)
- [x] AWS ACM Certificate successfully issued with `STATUS: ISSUED` (Amazon Trust Services)
- [x] Submit official AWS Support verification case to unlock CloudFront distribution provisioning

## 🌐 Web Application Remediation & Audits
- [x] Remediate cascading location dropdowns (District ➔ Constituency ➔ Mandal ➔ Village/Panchayat)
- [x] Fix proof modal dismissal, profile image uploads, and type-of-payment bindings
- [x] Compile clean production bundle in `dist/churchwebsite` with 0 compile errors
- [x] Maintain zero downtime on `https://jbac.in` via reverse-proxy integration

## 📱 Native Android Mobile App (`jbac_app`) Parity & Release
- [x] Implement automated Web-to-Mobile asset and source synchronization pipeline (`scripts/sync-to-mobile.js`)
- [x] Repair corrupted Telugu strings (Mojibake) across mobile navigation drawers and templates
- [x] Integrate Marriage & Family Counseling side-panel drawer module and Doctor/Counselor registration pages
- [x] Resolve Gradle dexing memory limits (`-Xmx3072m -Xss8m`)
- [x] Sign production Android release v0.0.24 (versionCode 24) with official `Jbac.keystore` (v1, v2, v3 schemes)
- [x] Deploy public direct download links to AWS S3 (`jbacApp-0.0.24.apk` and `jbacApp.apk`)

---

## 🎨 Features & Pending Tasks to Build

### 1. ☁️ AWS CloudFront CDN Edge Deployment
- [x] Receive confirmation on AWS Support account verification case (Resolved by AWS Support)
- [x] Execute `python scripts/check_acm_and_create_cf.py` to provision CloudFront CDN distribution (`EOBBU8SU7H3BI` / `d2wtiz94oy03oy.cloudfront.net`) for `jbac.in` and `www.jbac.in` with custom ACM SSL certificate
- [x] Verify global HTTPS edge caching and SPA client-side routing (rewriting 403/404 to `/index.html` with status 200)

### 2. 🌐 DNS Cutover & Cloud-Native Route 53 Migration (Zero-Hosting Target)
- [x] Provision AWS Route 53 Public Hosted Zone (`Z04439382BRRO1T3Y6B16`) for `jbac.in`
- [x] Pre-populate all active DNS records in Route 53 via `scripts/populate_route53_records.py`:
  - `jbac.in` root A & AAAA Alias ➔ CloudFront `d2wtiz94oy03oy.cloudfront.net`
  - `www.jbac.in` A & AAAA Alias ➔ CloudFront `d2wtiz94oy03oy.cloudfront.net`
  - Microsoft 365 Outlook MX, SPF, Autodiscover & SIP records
  - ACM Certificate validation CNAME records & subdomains
- [x] Update GoDaddy nameservers to AWS Route 53 (`ns-201.awsdns-25.com`, `ns-819.awsdns-38.net`, `ns-1386.awsdns-45.org`, `ns-1853.awsdns-39.co.uk`) — *Submitted in GoDaddy*
- [ ] Await global `.in` registry & DNS propagation to AWS Route 53 nameservers
- [ ] Safely terminate legacy GoDaddy cPanel hosting service once Route 53 propagation completes

### 3. 🗄️ Database & Production Go-Live Operations
- [x] Verify RDS database instance `jbac-mysql-db-v3` status (`available` with KMS encryption)
- [ ] Run end-to-end automated smoke tests across all registration forms, pastor logins, and directory search on live domain

### 4. 📲 Google Play Store Production Release
- [ ] Upload production release bundle (`app-release.aab` / `jbacApp-0.0.24.apk`) to Google Play Console
- [ ] Complete Google Play Store app listing review and rollout to production
