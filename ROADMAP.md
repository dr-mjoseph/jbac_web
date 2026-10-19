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

## 📱 6. Mobile App Navigation Fixes & Google Play Release v0.0.33
- [x] **Consecutive Multi-User Registration**:
  - Resolved form validation lock on consecutive registrations across `/entry`, `/namodu`, and all individual registration forms.
  - Implemented clean form state, touch state, and location array resets.
  - Pre-populated/auto-checked terms and conditions checkbox on form reset.
- [x] **User Profile Management**:
  - Added "Edit Profile" (ప్రొఫైల్‌ని సవరించండి) option to mobile drawer menu and web portal with secure login route guards.
- [x] **Mobile Registration Unresponsiveness Resolution**:
  - Diagnosed unresponsiveness on Church, Ministry, and Organisation cards in `FormsPage`.
  - Restored missing `term`, `retypepassword`, and `r` getter in controllers and runtime chunks (`35.js`, `21.js`, `18.js`, `38.js`).
  - Automated control parity audit across all 7 registration pages (Church, Ministry, Organisation, Association, Pastor, Believer, Student).
- [x] **Release Packaging & Signing (v0.0.33)**:
  - Bumped version code to `33` and semantic version to `0.0.33` with `targetSdkVersion 36`.
  - Built and signed release APK: `jbacApp-0.0.33.apk` (118.68 MB).
  - Built and signed release Android App Bundle: `jbacApp-0.0.33.aab` / `appreleasesigned.aab` (115.81 MB).

---

## 🎪 7. Events Portal Overhaul & Dynamic Ribbon (`d_in` Filtering)
- [x] **Ribbon Data Source Migration**:
  - Migrated scrolling ribbon in `/events` from `adds_data` table to `events` table.
  - Enforced condition: display in ribbon if and only if `d_in == 1`; exclude completely when `d_in == 0`.
- [x] **Backend Endpoint Parity**:
  - Refactored `server.ts` and `server.js` queries to remove hardcoded `WHERE d_in = 0`.
  - Added dedicated endpoint `/dashboardapi/getribbonevents` and dynamic `d_in` filtering support.
  - Added `getRibbonEvents()` method in `ServiceService` with fallback to `crud/events?d_in=1`.
- [x] **UI & Layout Remediation**:
  - Eliminated broken browser image icons (`[x] images.`, `[x] Church Meeting Poster`) with `getSafeImageUrl()` and `(error)` fallbacks to `assets/images/no.jpg`.
  - Fixed marquee red News badge clipping ("ews" ➔ "News") via flexbox wrapper.
  - Extracted filter container outside `.events-heading-row` to resolve flexbox distortion on toggle.
  - Replaced fixed width cards (`style="width: 244px;"`) with responsive 3-column Bootstrap grid (`col-12 col-md-6 col-lg-4 d-flex align-items-stretch`).
  - Fixed Telugu typo: `పోస్టర్ పెద్దదిగా చూచుటకు పోస్టర్ మీద క్లిక్ చేయము` ➔ `పోస్టర్ పెద్దదిగా చూచుటకు పోస్టర్ మీద క్లిక్ చేయండి`.
  - Removed harsh green borders (`border: 1px solid green;`), cleaned component CSS, and added uniform action buttons for Location, YouTube, Facebook, and Phone.

---

## 🎨 8. Navigation Menu Tuning, Hero Carousel Optimization & Dynamic Event Expiration
- [x] **Navigation Menu Customization**:
  - Temporarily hid "ఆంధ్ర క్రైస్తవుల ఓట్ ఎవరికీ / క్రైస్తవులకి అన్యాయం" (`/apchristianpolitics`) from both desktop and mobile drawer navigation menus in `src/app/shared/header/header.component.html`.
  - Preserved component files and router path declarations in `app-routing.module.ts` for clean re-enabling in future election/political campaigns.
- [x] **Homepage Hero Banner Carousel Optimization**:
  - Removed Banner 02 (`Banner02`) and Banner 08 (`Banner08`) from active slide rotation in `src/app/home/home/home.component.html` and `src/app/jesus/home/home.component.html`.
  - Streamlined active banners array to 6 slides (`['01', '03', '04', '05', '06', '07']`) in `home.component.ts`.
  - Updated dot indicators and click bindings from 8 dots down to 6 dots (indices 0 through 5).
  - Updated banner preloader in `home.component.ts` and `src/index.html` (preloading active `Banner03.webp` instead of disabled `Banner02.webp`).
- [x] **Automated Date-Based Meeting Expiration on Events Portal (`/events`)**:
  - Implemented dual client-side and backend database query date filtering for scrolling event ribbon items.
  - Backend query in `/dashboardapi/getribbonevents` and `/api/getribbonevents` enforced:
    `WHERE d_in = 1 AND ((enddate IS NOT NULL AND enddate != "" AND enddate >= CURDATE()) OR ((enddate IS NULL OR enddate = "") AND (startdate IS NULL OR startdate >= CURDATE()))) ORDER BY id DESC`.
  - Frontend controller `events.component.ts` hardened with `!isOldMeeting(item)` filter and regex-based date parser (`formatDateString`) preventing UTC midnight timezone shifts.
  - Expired meetings disappear automatically upon meeting conclusion without requiring manual administrative database resets of `d_in` from `1` to `0`.
- [x] **Registration Success Confirmation Modal Update**:
  - Updated SweetAlert2 confirmation dialog on both `/entry` and `/namodu` registration portals (`entry.component.ts` and `namodu.component.ts`).
  - Replaced secondary button label `"సరే (OK)"` with `"Exit"`.
  - Retained primary action `"లాగిన్ పేజీకి వెళ్లండి (Login Now)"` redirecting newly registered users to `/login`.
- [x] **Compilation & Regression Verification**:
  - Executed Angular CLI build (`ng build --configuration=development`): zero compilation errors, bundle successfully generated.

---

## 🎯 9. Pending Launch & Post-Release Tasks
- [ ] Complete Google Play Console Review & Rollout for Release 33.
- [ ] Monitor crash telemetry and user feedback via Google Play Console dashboard.
- [ ] Run automated end-to-end smoke testing across all live production forms on https://jbac.in.


