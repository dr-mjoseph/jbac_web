# JBAC - Jesus Believers Association Council Portal & Mobile Ecosystem

Welcome to the **Jesus Believers Association Council (JBAC)** unified ecosystem repository. This project contains the production Angular web client, cloud deployment configurations, database schemas, and synchronization engines connecting the web portal with the Android mobile application ([`dr-mjoseph/jbac_app`](https://github.com/dr-mjoseph/jbac_app)).

---

## 🏛️ Ecosystem Architecture

```
                                  +---------------------------------------+
                                  |     Global Users (Web & Mobile)       |
                                  +---------------------------------------+
                                                      |
                                    +-----------------+-----------------+
                                    |                                   |
                                    v                                   v
                      +---------------------------+       +---------------------------+
                      |   AWS Route 53 (DNS)      |       |  Android Mobile App       |
                      |   jbac.in / www.jbac.in   |       |  (jbacApp-0.0.35.apk/aab) |
                      +---------------------------+       +---------------------------+
                                    |                                   |
                                    v                                   |
                      +---------------------------+                     |
                      |   AWS CloudFront (CDN)    |                     |
                      |   ACM SSL Certificate     |                     |
                      +---------------------------+                     |
                                    |                                   |
                                    v                                   |
                      +---------------------------+                     |
                      |   AWS S3 (Static Web)     |                     |
                      |   Angular 15 SPA          |                     |
                      +---------------------------+                     |
                                    |                                   |
                                    +-----------------+-----------------+
                                                      | (HTTPS REST)
                                                      v
                                        +---------------------------+
                                        |  Backend API Server       |
                                        |  Node.js / Express        |
                                        |  (AWS Lambda / Service)   |
                                        +---------------------------+
                                                      | (Port 3306)
                                                      v
                                        +---------------------------+
                                        |  AWS RDS MySQL 8.4        |
                                        |  jbac-mysql-db-v3 (KMS)   |
                                        |  jbac_jbac (utf8mb4)      |
                                        +---------------------------+
```

---

## 🚀 Key Modules & Capabilities

1. **Member & Ministry Directory**:
   - Comprehensive directory covering Pastors, Churches, Believers, Organisations, Ministries, and Students across 26 districts of Andhra Pradesh & Telangana.
   - Cascading geographic filters (District ➔ Parliamentary / Assembly Constituency ➔ Mandal ➔ Village / Panchayat) and streamlined navigation menus.
2. **Dynamic Multi-Stream Registration**:
   - Distinct, role-based registration flows: Pastors, Pastors Association, Churches, Organisations, Ministries, Believers, and Students.
   - Dedicated `/namodu` and `/entry` registration forms with automatic routing into category-specific database tables (`student_reg`, `church_reg`, `pastors_tbl`, etc.) and modernized SweetAlert2 confirmation dialogs featuring `"Exit"` and `"Login Now"` options.
3. **Marriage & Family Counselling Portal**:
   - Comprehensive counselling dashboard with appointment scheduling, slot booking, and history.
   - Role-gated Doctor & Counsellor workspace with dedicated registration and login category options.
   - Login-gated appointment bookings preventing anonymous submissions.
4. **News, Events & Notifications**:
   - Interactive 6-slide hero banner carousel (optimized with preloaded WebP assets), live announcements, job postings, and media galleries.
   - Dynamic **Events & Meetings Portal** with horizontal scrolling ribbon powered by the `events` table with automatic date-based expiration (displaying if and only if `d_in == 1` and meeting date is current or upcoming, automatically expiring upon completion without requiring manual database resets), date-based tabs ("నేటి మీటింగ్స్" vs "రాబోయే మీటింగ్స్"), cascading geographic filters, and responsive 3-column meeting cards with poster zoom previews.
5. **Native Android Application (`jbac_app`)**:
   - Android app compliant with Google Play Store standards (`targetSdkVersion 36`, `minSdkVersion 24`, release version `0.0.35` / `versionCode 35`).
   - Official production release signing via `Jbac.keystore`.
   - Includes real-time Telugu wait spinner alerts, immediate session persistence, and seamless login navigation.

---

## 🛠️ Tech Stack

- **Web Frontend**: Angular 15.2, TypeScript 4.8, Bootstrap & Ionicons, HTML5/CSS3 with responsive mobile-friendly layouts.
- **Backend API**: Node.js, Express, `mysql2/promise` connection pooling, AWS Lambda & API Gateway.
- **Database**: AWS RDS MySQL 8.4 (`jbac-mysql-db-v3`) with AWS KMS storage encryption at rest and `utf8mb4` encoding for Telugu Unicode preservation.
- **Hosting & CDN**: AWS S3 (`jbac-web-production-298363284024`) + AWS CloudFront (`d2wtiz94oy03oy.cloudfront.net`) with Route 53 DNS and ACM SSL certificates.
- **Mobile App**: Hybrid Ionic 3 / Cordova Android (`io.ionic.starterjbac`), compiled with Gradle 7.4 / Android SDK 34-36.

---

## 💻 Development & Build Scripts

### Prerequisites
- Node.js 18+ (tested up to Node 24)
- npm 9+
- Angular CLI: `npm install -g @angular/cli@15`

### Common Commands

```bash
# Install dependencies
npm install

# Start local development server
npm start
# App available at: http://localhost:4200

# Build production bundle for web deployment
npm run build:prod
# Compiled output stored in dist/churchwebsite/

# Deploy web build to AWS S3 & CloudFront
npm run deploy:aws

# Sync web build assets and components to sibling mobile app (jbac_app)
npm run sync:mobile

# Import MySQL database dump to RDS
npm run import:db
```

---

## 📱 Mobile App Release Automation

The mobile application is housed in `C:\Users\rajes\StudioProjects\jbac_app` (repository: `dr-mjoseph/jbac_app`).

- **Release Scripts**:
  - `powershell -ExecutionPolicy Bypass -File .\scripts\build_and_sign_release_v35.ps1`
  - Automated tasks compile Gradle release binaries, perform 4-byte `zipalign`, sign the APK with `apksigner`, and sign the AAB with `jarsigner` using `Jbac.keystore`.
- **Active Release Artifacts (v0.0.35 / versionCode 35)**:
  - **APK**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.35.apk`
  - **AAB**: `C:\Users\rajes\StudioProjects\jbac_app\appreleasesigned.aab` / `jbacApp-0.0.35.aab`
  - **SDK Settings**: `minSdkVersion 24`, `targetSdkVersion 36`, `compileSdkVersion 34`.

---

## 📚 Project Documentation Directory

- [ROADMAP.md](ROADMAP.md): Detailed milestones, completed deliverables, and pending features.
- [DATABASE_CONNECTION.md](DATABASE_CONNECTION.md): Active AWS RDS MySQL credentials, connection strings, and security setup.
- [AWS_DEPLOYMENT_AND_SYNC_GUIDE.md](AWS_DEPLOYMENT_AND_SYNC_GUIDE.md): Complete AWS infrastructure provisioning and web-to-mobile sync guide.
- [PROJECT_JOURNAL_AND_EXECUTION_LOG.md](PROJECT_JOURNAL_AND_EXECUTION_LOG.md): Exhaustive chronological project history and troubleshooting log.
- [backend/README.md](backend/README.md): Express API server architecture, routes, and database schemas.
