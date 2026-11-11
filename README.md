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
                      |   jbac.in / www.jbac.in   |       |  (jbacApp-0.0.47.apk/aab) |
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
   - Dynamic **Events & Meetings Portal** with horizontal scrolling ribbon powered by the `events` table with automatic date-based expiration (displaying if and only if `d_in == 1` and meeting date is current or upcoming, automatically expiring upon completion without requiring manual database resets), date-based tabs ("నేటి మీటింగ్స్" vs "రాబోయే మీటింగ్స్"), responsive 3-column meeting cards with poster zoom previews, and complete multi-tier filtering:
     - **State-Wise Filter (`సెలెక్ట్ రాష్ట్రం / State`)**: Filter meetings by **Telangana (TG)** or **Andhra Pradesh (AP)**, powered by resilient backend joins on `dstrct` and client-side fallback matching.
     - **Geographic Cascade**: District ➔ Parliamentary / Assembly Constituency ➔ Mandal / Municipality ➔ Village / Ward.
     - **Date-Wise Filter (`డేట్ వైజ్ మీటింగ్స్`)**: Single-day and multi-day date range meeting filters.
   - **Structured Meeting Submission Workflow (`కూటముల నమోదు`)**:
     - Strict dependency-ordered location selection: **1. State ➔ 2. District ➔ 3. Constituency ➔ 4. Mandal ➔ 5. Panchayat**.
     - Child dropdowns remain safely disabled with descriptive Telugu placeholders until their immediate parent is selected.
     - Changing any parent level immediately resets and clears child selections to prevent invalid combinations.
     - Automatically persists `state_id` (`1` for AP, `2` for TG) and `state` (`'AP'` / `'TG'`) into the `events` table.
5. **Cross-Category Registration Autofill**:
   - Automated profile discovery across `student_reg`, `signup_form`, and `pastor_reg` via `/dashboardapi/lookup-existing-user`. Entering a registered phone number in any registration form automatically pre-populates name, father's name, gender, DOB, caste, education, talents, leadership preferences, and geographic selections (State ➔ District ➔ Constituency ➔ Mandal ➔ Panchayat) with active cascading dropdowns.
   - Preserves prefilled data across category tab switches.
6. **Automated Ads & Meeting Lifecycle Engine**:
   - Integrated `adds_data` lifecycle engine linked with `events.enddate`. Meeting advertisements automatically disappear upon completion without manual intervention, while non-meeting announcements display continuously until stopped by admin (`d_in != 0`).
   - Universal vertical scrolling ads sidebars (`direction="up"`, `height: 550px`, hover-pause) across all 6 member service views (`/institute`, `/marriages`, `/jobs`, `/help`, `/business`, `/organization`).
   - Full-page loading spinner on `/news` preventing layout shift until news entries load.
   - Space-saving collapsible **Filter Search** buttons across 6 service views (`/institute`, `/marriages`, `/jobs`, `/help`, `/business`, `/organization`), collapsed by default with smooth animations.
   - Dual-expandable Filter Search on `/news` allowing users to filter stories by Date and News Category independently.
   - Fixed vertical scrolling news/info alignment on `/organization` with standard responsive column ratios (`col-lg-8` and `col-lg-4`).
   - Universal loading spinner overlays preventing layout jumps and displaying visual feedback during searches and subordinate data fetching.
7. **Admin Database Cockpit Real-Time Daily KPIs (`/admin`)**:
   - Dual-metric cards displaying both cumulative **Total** and **Today's Registrations** in the exact same card box (`Today: X | Total: Y`) across all categories (Believers, Pastors, Churches, Students, Ministries, Organizations, Portal Accounts).
   - Timezone-aware IST date matching (`cts LIKE 'YYYY-MM-DD%'`) that automatically resets at midnight every day.
8. **District Leader Hierarchy & Subordinate Management (`/leaders`)**:
   - Secure authorization model where admins designate District-Level Leaders by setting `d_in = 1` in `signup_form` or `pastor_reg`.
   - **Strict One-Level-Down Delegation**: District leaders view constituency leaders; constituency leaders view mandal leaders; mandal leaders view ward and panchayat leaders.
   - **Rejection Visibility**: Rejected leader requests (`approval_ind = 2`) disappear immediately from the list; only approved (`approval_ind = 1`) and pending (`approval_ind = 0`) remain visible.
   - **Detailed Leadership Status Badges**: If a leader is from a specific wing (e.g. Student Wing, Software Wing, Drivers Wing, Media Reporters, Social Media), the exact wing name and role are displayed (e.g. `స్టూడెంట్ వింగ్ (Student Wing) - సోషల్ మీడియా లీడర్`). If from panchayat, ward, or sub-ward, detailed designations (`వార్డు నెం. 1 లీడర్`, `సబ్ వార్డు లీడర్`) and distinct color-coded badges are rendered.
   - **Clean Modern Interface**: Top graphic hero banners removed across all pages, horizontal announcement marquee bar modernized, and search filter cards enhanced with responsive Bootstrap grids.
9. **Native Android Application (`jbac_app`)**:
   - Android app compliant with Google Play Store standards (`targetSdkVersion 36`, `minSdkVersion 24`, release version `0.0.49` / `versionCode 49`).
   - Official production release signing via `Jbac.keystore`.
   - Full State (`రాష్ట్రం / State`) selection and cascading district loading across search modules and all registration forms.
   - Optimized navigation touch targets, zero click delay, and hardware back button handling.
10. **Entrepreneur & Investor Ecosystem**:
   - Bilingual incubation and matchmaking portal for Christian entrepreneurs and faith-based investors across Andhra Pradesh and Telangana.
   - Dedicated web forms (`/entrepreneurregister`, `/investorregister`) and mobile pages (`EntrepreneurPage`, `InvestorPage`) with dual residential and business location cascades (State ➔ District ➔ Constituency ➔ Mandal ➔ Panchayat).
   - Real-time Admin Business Match Cockpit (`/admin`) displaying cumulative entrepreneurs, funds needed, registered investors, and capital to invest with 1-click approval/rejection controls.
11. **Android Studio Native Dual-Write Backend & REST APIs**:
   - 6 dedicated MySQL tables (`jbac_users`, `jbac_news`, `jbac_meetings`, `jbac_branches`, `jbac_prayer_requests`, `jbac_chat_messages`) on AWS RDS MySQL 8.4.
   - 11 production REST API endpoints deployed on AWS Lambda (`jbac-backend-api`) enabling native Android apps (`ChurchRepository.kt` via Retrofit) to dual-write alongside Firebase.

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

# Start development server in GitHub Codespaces (bound to 0.0.0.0)
npm run serve:codespace

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

### ☁️ GitHub Codespaces Remote Development
When resuming a GitHub Codespace, environments are persistent containers and do not auto-pull git changes. To ensure your Codespace runs the latest version:
```bash
git fetch origin && git checkout main && git pull origin main
rm -rf .angular/cache
npm install
npm run serve:codespace
```
After starting the server, perform a browser hard-refresh (`Ctrl + Shift + R` or `Ctrl + F5`) to bypass cached browser bundles.

---

## 📱 Mobile App Release Automation

The mobile application is housed in `C:\Users\rajes\StudioProjects\jbac_app` (repository: `dr-mjoseph/jbac_app`).

- **Release Scripts**:
  - `powershell -ExecutionPolicy Bypass -File .\scripts\build_and_sign_release_v39.ps1`
  - Automated tasks compile Gradle release binaries, perform 4-byte `zipalign`, sign the APK with `apksigner` (v1 + v2 schemes), and sign the AAB with `jarsigner` using `Jbac.keystore`.
- **Active Release Artifacts (v0.0.39 / versionCode 39)**:
  - **APK**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.39.apk` (118.61 MB)
  - **AAB**: `C:\Users\rajes\StudioProjects\jbac_app\appreleasesigned.aab` / `jbacApp-0.0.39.aab` (115.81 MB)
  - **SDK Settings**: `minSdkVersion 24`, `targetSdkVersion 34`, `compileSdkVersion 34`.
  - **Fixes**: Activated Ministry (`MinistryPage`), Church (`ChurchPage`), and Organization (`OrganisationPage`) registration forms from `FormsPage` (`రిజిస్ట్రేషన్`) by resolving missing ReactiveForm controls (`retypepassword`, `term`) and adding template getter `r`.

---

## 🗄️ Database Cockpit & Query Console (`public.html`)

A complete web-based SQL query editor and administrative data cockpit is available across custom domain, S3, and AWS Lambda with unified authentication:

- **Custom Domain**: [https://www.jbac.in/admin](https://www.jbac.in/admin) *(or [https://jbac.in/admin](https://jbac.in/admin))*
- **Alternative Path**: [https://www.jbac.in/public.html](https://www.jbac.in/public.html) *(or [https://jbac.in/public.html](https://jbac.in/public.html))*
- **Direct AWS Lambda**: [https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/admin](https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/admin)
- **Local File**: [`public.html`](public.html)

#### 🔐 Access Credentials:
- **Admin Unique ID**: `admin`
- **Admin Password**: `JbacAdmin@2026`

#### ✨ Key Features:
1. **Universal Mobile & Desktop Support**: Fully responsive with collapsible 89-table sidebar, touch-scrolling data grids, and adaptive layouts for iPhone and Android browsers.
2. **Dashboard Tab**: Real-time KPI metric cards (Believers, Pastors, Churches, Students, Ministries, Organisations, Active Events, Users) and AWS RDS MySQL 8.4 engine health telemetry.
3. **SQL Query Console**: Full-featured code editor with `Ctrl+Enter` shortcut execution, preloaded SQL query presets, execution latency in milliseconds (`ms`), affected/returned row badges, and CSV / JSON export with UTF-8 BOM encoding.
4. **Table Explorer & Schema Browser**: Filterable drawer listing all 89 tables with live row count badges, schema inspector (`Field`, `Type`, `Null`, `Key`, `Default`, `Extra`), pagination, real-time record manipulation, 1-click **`📥 Export CSV`** and **`📥 Export JSON`** buttons, and **`📤 Import`** table modal for batch spreadsheet adjustments.
5. **Table Data Import & Batch Adjustment Engine**: Dedicated import modal with drag-and-drop file upload (`.csv`, `.json`), column preview, and flexible adjustment modes:
   - **Upsert (Recommended)**: Matches by `id`, updates existing records with changes made in Excel/Sheets, and inserts any new records.
   - **Update Only**: Strictly adjusts records matching existing IDs.
   - **Insert Only**: Inserts all parsed rows as new records.
6. **Record Manipulation Modals**: Add new records (INSERT), edit existing records (UPDATE), and soft/hard delete records (DELETE) with intelligent NULL sanitization (blank inputs automatically convert to SQL `NULL`) and session-level Foreign Key safety (preventing constraint violations on relational fields like `pastor_id`, `believer_id`, etc.).
7. **Secured Query Execution & Import APIs**:
   - `POST /dashboardapi/import/:table` (batch CSV/JSON upsert & update engine).
   - `POST /dashboardapi/execute-query` (with `x-admin-auth` header or Basic Auth):
     ```json
     { "query": "SELECT * FROM users WHERE status = 'Active' LIMIT 10" }
     ```
   - Response:
     ```json
     { "success": true, "type": "SELECT", "rowCount": 10, "fields": ["id", "name", "number"], "data": [...], "durationMs": 28 }
     ```

---

## 📦 Imported Backend Project (`Api/`)

Downloaded directly from the user's Google Drive archive into [`Api/`](file:///c:/Users/rajes/Documents/jbac_web/Api):
- **`Api/config/dbconnect.js`**: Database connection pool configured for AWS RDS MySQL 8.4 (`jbac-mysql-db-v3`).
- **`Api/dashboard/`**: Full controllers, models, validators, and route handlers for admin operations.
- **`Api/website/`**: Controllers and models for public portal operations.
- **`Api/validators/` & `Api/utils/`**: Master validators and scheduled job helpers.
- **`Api/public.html`**: Mirrored database cockpit.

---

## 📚 Project Documentation Directory

- [ROADMAP.md](ROADMAP.md): Detailed milestones, completed deliverables, and pending features.
- [RELEASE_NOTES_v0.0.52.md](RELEASE_NOTES_v0.0.52.md): Mobile and web release notes for v0.0.52 (versionCode 52, targetSdk 36, WhatsApp field addition).
- [PAGESPEED_AND_SEARCH_CONSOLE_OPTIMIZATION_GUIDE.md](PAGESPEED_AND_SEARCH_CONSOLE_OPTIMIZATION_GUIDE.md): Technical guide for PageSpeed Insights Core Web Vitals optimizations, script deferrals, WebP compression, and CloudFront caching.
- [RELEASE_NOTES_v0.0.43.md](RELEASE_NOTES_v0.0.43.md): Mobile app release notes for v0.0.43 (versionCode 43, targetSdk 36, APK install fix).
- [RELEASE_NOTES_v0.0.40.md](RELEASE_NOTES_v0.0.40.md): Complete mobile release notes for v0.0.40 covering 16 bug fixes and cascading hierarchy.
- [DATABASE_CONNECTION.md](DATABASE_CONNECTION.md): Active AWS RDS MySQL credentials, connection strings, and security setup.
- [AWS_DEPLOYMENT_AND_SYNC_GUIDE.md](AWS_DEPLOYMENT_AND_SYNC_GUIDE.md): Complete AWS infrastructure provisioning and web-to-mobile sync guide.
- [PROJECT_JOURNAL_AND_EXECUTION_LOG.md](PROJECT_JOURNAL_AND_EXECUTION_LOG.md): Exhaustive chronological project history and troubleshooting log.
- [backend/README.md](backend/README.md): Express API server architecture, routes, and database schemas.
- [public.html](public.html): Universal database administration & query interface.



---

## 🚀 Update Log (2026-10-29): Admin Pastor Associations, Mobile Hamburger Menu, Student Leadership Hierarchy, & Believer Wing Leadership

### 1. Admin Panel - Pastor Associations Section (`public.html` & Backend)
- **Database Metrics & Real-Time Stats**: Added `pastor_associations` and `pastor_associations_today` to `GET /dashboardapi/admin-dashboard-stats` in `backend/server.js` and `backend/server.ts`, querying the `pastors_associations` table for live counts.
- **Admin Dashboard KPI Card**: Added the interactive **Pastor Associations** card (`stat-pastor-associations`, `stat-pastor-associations-today`, `stat-pastor-associations-total`) to `public.html`, `src/public.html`, and `backend/public.html`. Clicking it immediately launches `SELECT * FROM pastors_associations ORDER BY id DESC LIMIT 50;` in the SQL Query Console.

### 2. Mobile Responsive Hamburger Menu Fix (`header.component.ts`, `header.component.html`, & `styles.css`)
- **Native Angular State & Handlers**: Added `mobileMenuOpen: boolean` with `toggleMobileMenu()` and `closeMobileMenu()` methods in `HeaderComponent`.
- **Responsive Hamburger Icon**: Bound `(click)="toggleMobileMenu()"` to `.menu_button`, `[class.open]="mobileMenuOpen"` to `.side_wrap`, and `[class.show]="mobileMenuOpen"` to `.mask`.
- **CSS Isolation**: Prevented `@media (max-width: 1023px)` from hiding `.menu_main_nav_area` inside `.side_wrap` (by scoping desktop nav hiding to `.top_panel_wrap .menu_main_nav_area`). Styled the hamburger icon with `content: "☰"` and provided a high z-index overlay (`z-index: 100005`) for immediate responsiveness on iPhone and Android mobile browsers.

### 3. Student Leader Hierarchy & Dashboard Requests (`studentregister`, `leaders`, & Backend)
- **Student Register Form Fix**: Fixed `src/app/jesus/studentregister/studentregister.component.html` option values for "Select Leadership Level you want" so State, District, Constituency, Mandal, Ward/Panchayat, and institution levels submit accurate values rather than duplicate strings.
- **Backend Leader Resolution (`/dashboardapi/getUserMainData`)**: Enabled resolution of student leaders (`student_reg`, category `2`). Normalized string and numeric leadership levels (`State Level` -> 0, `District Level` -> 1, `Constituency Level` -> 2, `Mandal Level` -> 3, `Ward / Panchayati Level` -> 4).
- **One-Level-Down Hierarchy**:
  - State Leaders (`generaltype == 0`): view District leaders (`generaltype == 1`) in that state.
  - District Leaders (`generaltype == 1`): view Constituency leaders (`generaltype == 2`) in that district.
  - Constituency Leaders (`generaltype == 2`): view Mandal leaders (`generaltype == 3`) in that constituency.
  - Mandal Leaders (`generaltype == 3`): view Panchayat/Ward leaders in that mandal.
- **Student Requests Tab & Actions**: Added the **🎓 Students Requests (విద్యార్థులు)** tab and table in `leaders.component.html`, with Confirm (`confirm(2, x.id)`) and Reject (`deleteAlert(2, x.id)`).
- **Instant Rejection Disappearance**: Filtered all queries with `COALESCE(approval_ind, 0) != 2` so rejected leaders disappear immediately from all dashboards.

### 4. Believer Registration Wing Leadership Level (`believerregister` & Backend)
- **Form Controls & Dynamic Binding**: Added the "మీరు చేయగలిగిన వింగ్ లీడర్ షిప్ లెవెల్ ఎంచుకోండి" (`wingtype`) dropdown to `believerregister.component.html` populated dynamically from `this.service.getleaderlevel()`, matching `pastorregister`. Kept "వింగ్ లీడర్ కేటగిరి" (`wingtypes`) populated from `this.service.getwing()`.
- **Wing Leader Hierarchy**: When any pastor or believer registers as a Wing Leader and selects a leadership level (with admin setting `d_in = 1`), they access the hierarchical subordinates of the next level down (District &rarr; Constituency &rarr; Mandal &rarr; Village/Ward) across all wing categories.

### 5. Production Build & Cloud Deployment
- **AWS Lambda**: Updated package `backend-deploy.zip` with new `server.js` and `public.html`, and deployed to AWS Lambda function `jbac-backend-api` (region `ap-southeast-2`).
- **Angular Production Build**: Generated optimized chunks (`main.50cf944bb900db77.js`, `styles.db5f96a266671e53.css`).
- **AWS S3 & CloudFront**: Synchronized `dist/churchwebsite` to S3 bucket `jbac-web-production-298363284024` and created CloudFront cache invalidation (`EOBBU8SU7H3BI`).


---

## [2026-10-29 20:56:11] Strict Wing Category Isolation & Hierarchical Subordinate Filtering

### 1. Functional Overview
Rewrote and hardened the leadership dashboard hierarchy and subordinate filtering logic for Believer and Pastor registrations:
- **Strict Wing Category Isolation**:
  - Admin-elected or approved District-level leaders of a specific wing (e.g., Student Wing, Advocate Wing, Medical Wing, etc.) can **ONLY** see the list of users registered for that **exact same wing category** in that district's constituencies.
  - If a user resides in the same district/constituency but registered under a different wing category, they are **strictly excluded** from the dashboard.
  - Similarly, a Constituency-level leader of a specific wing can only see Mandal-level users of the same wing.
  - Similarly, a Mandal-level leader of a specific wing can only see Village / Panchayat / Ward users of the same wing.
- **Hierarchical Scoping (One Level Down)**:
  - State Leader (`generaltype = 0`) $\rightarrow$ sees District Leaders (`generaltype = 1`).
  - District Leader (`generaltype = 1`, `d_in = 1`) $\rightarrow$ sees Constituency Leaders (`generaltype = 2`).
  - Constituency Leader (`generaltype = 2`) $\rightarrow$ sees Mandal Leaders (`generaltype = 3`).
  - Mandal Leader (`generaltype = 3`) $\rightarrow$ sees Village / Panchayat / Ward Leaders (`generaltype IN (4, 5, 6)` or `wardnumber`/`subward`).
- **Rejection & Self-Exclusion Shielding**:
  - Rejected leaders (`approval_ind = 2`) are completely removed from all subordinate lists (`COALESCE(approval_ind, 0) != 2`).
  - The logged-in leader themselves is excluded (`s.id != currentUserId`, `pr.id != currentUserId`, `st.id != currentUserId`).

### 2. Backend Implementation (`backend/server.js` & `backend/server.ts`)
- **Canonical Wing Catalog (`WING_CATALOG`)**: Defined all 23 official wings with canonical Telugu titles, English descriptors, and token sets.
- **Canonical Wing Resolver (`resolveWingCategory`)**: Converts numeric IDs (`1` to `23`), Telugu strings (`'అడ్వకేట్ వింగ్'`, `'స్టూడెంట్ వింగ్'`), and English terms (`'advocate'`, `'student'`) into unified canonical wing objects.
- **SQL Condition Builder (`getWingMatchSql`)**: Cross-checks both `wingtypes` and `wingtype` columns against wing IDs, Telugu names, and keywords.
- **Top-Level Helper (`parseLeadershipLevel`)**: Normalized leadership parsing across State (`0`), District (`1`), Constituency (`2`), Mandal (`3`), and Ward/Village (`4`) in both English and Telugu (`జిల్లా`, `నియోజకవర్గ`, `మండల`, `పంచాయతి`, `వార్డు`).
- **Endpoints Updated**:
  - `/dashboardapi/getLeaderswebsiteData` and `/dashboardapi/getLeaderswebsitewing`: Dynamic SQL matching with wing category filtering and one-level-down hierarchy.
  - `/dashboardapi/getUserMainData`: Resolves `wing_name` and `wing_english` for the authenticated leader to display the exact title in the frontend header.

### 3. Frontend Implementation (`src/app/jesus/leaders/leaders.component.ts`)
- **Title Rendering**: Sets `this.wingtypes = res.data[0].wing_name || res.data[0].wingtypes;` so the header displays the exact Telugu title (`District అడ్వకేట్ వింగ్ Leader`, `District స్టూడెంట్ వింగ్ Leader`).
- **Payload Enrichment**: Transmits `leadertype`, `wingtypes`, and `generaltype` in both `data` and `data4` requests to ensure seamless backend resolution.

### 4. Verification on Live AWS Infrastructure
- **District 17 Test**:
  - Advocate Wing Leader query $\rightarrow$ returned 0 students (student records shielded).
  - Student Wing Leader query $\rightarrow$ returned 2 students (Chukka Divya Darshitha, Vinukonda samyuktha).
- **District 20 Test**:
  - Advocate Wing Leader query $\rightarrow$ returned Pastor 1261 (Rajesh chadamala, registered as Advocate Wing).
  - Student Wing Leader query $\rightarrow$ returned 0 pastors (cross-wing pastor shielded).
- **Production Deployment**:
  - AWS Lambda function `jbac-backend-api` updated in `ap-southeast-2`.
  - Angular production build compiled (`main.c8b61a671568b0b1.js`, `styles.db5f96a266671e53.css`).
  - Synced to S3 bucket `jbac-web-production-298363284024` and CloudFront cache invalidated (`EOBBU8SU7H3BI`).


---

## [2026-10-31 11:41:58] Universal 6-Tier Leadership Hierarchy & Strict Geographic/Type Scoping

### 1. Specification Reference
Implemented the universal hierarchy and isolation specifications from the public document:
- **Reference Document**: `https://drive.google.com/file/d/1TXqhrc5TiIW1SfwZFGbIpMfBttjfXmm2/view?usp=sharing`
- **Canonical 6 Levels**:
  - Level 1: రాష్ట్ర నాయకుడు (State Leader)
  - Level 2: జిల్లా నాయకుడు (District Leader)
  - Level 3: నియోజకవర్గం నాయకుడు (Constituency Leader)
  - Level 4: మండల నాయకుడు (Mandal Leader)
  - Level 5: పంచాయతి నాయకుడు (Panchayat Leader)
  - Level 6: వార్డు నాయకుడు (Ward Leader)

### 2. Universal SQL Query & Scoping Logic
Implemented across backend endpoints (`/dashboardapi/getLeaderswebsiteData`, `/dashboardapi/getLeaderswebsitewing`, `/api/leaders`):
1. **Level Boundary Rule (`targetLevel = logged_in_level_id + 1`)**:
   - Guaranteed next-tier-down targeting across all 6 levels.
   - Level 1 (State) $\rightarrow$ Level 2 (District Leaders).
   - Level 2 (District) $\rightarrow$ Level 3 (Constituency Leaders).
   - Level 3 (Constituency) $\rightarrow$ Level 4 (Mandal Leaders).
   - Level 4 (Mandal) $\rightarrow$ Level 5 (Panchayat Leaders).
   - Level 5 (Panchayat) $\rightarrow$ Level 6 (Ward Leaders).
   - Level 6 (Ward) $\rightarrow$ None (`1=0`).
2. **Leader Type Isolation (`leader_type = :logged_in_leader_type`)**:
   - General Leader $\rightarrow$ General Leaders ONLY (`leadertype != '2'` and no wing category).
   - Wing Leader $\rightarrow$ Wing Leaders of that **exact same wing category** ONLY.
   - Cross-type bleed eliminated: in user's screenshot, `sample7` (Wing Leader) and `sample3` (Mandal Leader) were shown to District Leader `Sample` (Pastor 1438). Under the universal query, `sample7` and `sample3` are strictly filtered out; only `sample1` (Constituency Leader) appears.
3. **Strict Geographic Scoping**:
   - Level 1: `(state_id = :state_id OR state_id IS NULL)`.
   - Level 2: `district_id = :district_id`.
   - Level 3: `constituency_id = :constituency_id AND (district_id = :district_id OR :district_id IS NULL)`.
   - Level 4: `mandal_id = :mandal_id AND (constituency_id = :constituency_id OR :constituency_id IS NULL)`.
   - Level 5: `(panchayat_id = :panchayat_id OR village_id = :village_id) AND (mandal_id = :mandal_id OR :mandal_id IS NULL)`.
4. **Students Scoping**:
   - General Leaders and Student Wing Leaders view students strictly at `logged_in_level_id + 1` within their geographical jurisdiction.
   - Non-student wing leaders (Advocate, Medical, etc.) have student results shielded (`1=0`).
5. **Session Parameter Binding**:
   - Server dynamically inspects `usr_id` directly against DB tables (`pastor_reg`, `signup_form`, `student_reg`) to authoritatively bind the logged-in user's level and location parameters rather than trusting unverified client input.
6. **Shielding & Deduplication**:
   - Excludes rejected leaders (`COALESCE(approval_ind, 0) != 2`).
   - Excludes current authenticated user from own subordinate list (`id != currentUserId`).
   - Added `GROUP BY table.id` and joined wings via `w.id = COALESCE(NULLIF(table.wingtypes, ''), table.wingtype)` to prevent duplicate rows.

### 3. Verification & Live AWS Testing
- **Test 1 (User Screenshot Case - Pastor 1438 Sample in District 40)**:
  - Query returned: **1 Pastor ONLY** (`sample1`, ID 1439, Constituency Leader).
  - `sample7` (Wing Leader, ID 1401) $\rightarrow$ **EXCLUDED** (LeaderType Mismatch).
  - `sample3` (Mandal Leader, ID 1400) $\rightarrow$ **EXCLUDED** (Level Mismatch).
  - Self (`Sample`, ID 1438) $\rightarrow$ **EXCLUDED**.
- **Test 2 (District 17 Student Level Filtering)**:
  - Query returned: **2 Students ONLY** (`Chukka Divya Darshitha`, `Vinukonda samyuktha`), both at Constituency Level.
  - State-level, District-level, Mandal-level, and Panchayat-level students in District 17 were strictly excluded.
- **Test 3 (Engineering Wing Hierarchy - District 21)**:
  - `sample14` (District Wing Leader, ID 247) queries $\rightarrow$ returns **1 Believer ONLY** (`sample15`, Constituency Wing Leader, ID 248).
  - `sample15` queries $\rightarrow$ returns **1 Believer ONLY** (`sample16`, Mandal Wing Leader, ID 249).


---

## 54. Selected User Type Request Isolation & Mobile App Synchronization (November 1, 2026)

### Context & User Objectives
1. **User Request 1**: On `https://jbac.in/leaders`, filter out and display ONLY the requests specific to the selected user type (Pastor, Believer, or Student), while removing requests belonging to other user types. Update the code/filtering mechanism to enforce this rule cleanly.
2. **User Request 2**: Update the Android mobile app (`jbac_app`) with the latest changes made to the website.

### Root Cause Analysis & Architectural Design
- **Previous Web & API Behavior**:
  - In `backend/server.js` (`getLeaderswebsiteData`), the server queried all three subordinate tables (`signup_form`, `pastor_reg`, `student_reg`) regardless of the user type.
  - In `leaders.component.ts`, `formshow` was hardcoded to `1` (Believers) on initialization, causing Pastor leaders and Student leaders to initially see Believers Requests, while keeping all three arrays (`belearr`, `pastorarr`, `studentarr`) simultaneously populated in component memory.
- **Implemented User Type Isolation**:
  1. **Backend Isolation (`backend/server.js` & `backend/server.ts`)**:
     - The endpoint authoritatively inspects the requested `user_type` (or `category_id`), falling back to the authenticated user's DB role (`pastor`, `student`, or `believer`).
     - **Pastor Type**: Queries `pastor_reg` ONLY. Sets `believers = []` and `students = []`.
     - **Believer Type**: Queries `signup_form` ONLY. Sets `pastors = []` and `students = []`.
     - **Student Type**: Queries `student_reg` ONLY. Sets `believers = []` and `pastors = []`.
     - Skips database query execution for other tables, returning strictly the selected user type in `res.data` and responding with `selected_user_type`.
  2. **Web Frontend (`leaders.component.ts` & `leaders.component.html`)**:
     - Automatically binds `selectedUserType` and `formshow` to the authenticated leader's role (Pastor $ightarrow 3$, Student $ightarrow 2$, Believer $ightarrow 1$) instead of defaulting to Believers.
     - On user type switch (`make(id)`), component immediately purges all arrays for non-selected categories (`[]`), passes `user_type` to backend API, and renders strictly the active category table.
     - Added an active filter badge in the UI displaying:
       `📌 ఎంచుకున్న యూజర్ రకం (Selected User Type): [విశ్వాసులు / పాస్టర్లు / విద్యార్థులు] — ఇతర యూజర్ కేటగిరీలు తొలగించబడ్డాయి (Other user types isolated)`.
  3. **Mobile App Synchronization (`jbac_app`)**:
     - Upgraded `wingcommand.ts` and `wingcommand.html` (the mobile equivalent of `/leaders`) with:
       - The canonical 6-tier hierarchy (0=State down to 6=Ward).
       - User type request isolation (filtering out other categories and defaulting based on `localStorage.category_id` and leader role).
       - Added missing Students Requests button (`make(2)`) and table.
       - Rejection filtering (`approval_ind !== 2`).
     - Added State Leader (`<ion-option value="0">రాష్ట్ర నాయకుడు</ion-option>`) to mobile `pastor.html`.
     - Executed `sync-to-mobile.js` to mirror modern Angular sources (`web-src/`), update API endpoints, enforce native Ionic 3 index.html, and commit & push to GitHub (`origin/main`).

### Verification & Test Results
- **AWS Lambda Live API Verification (`scripts/verify_user_type_isolation_live.py`)**:
  - **Pastor Isolation**: Pastor 1438 (`usr_id: 1438`, `category_id: 4`):
    - `selected_user_type`: `pastor`
    - `Believers count`: `0` (Completely excluded)
    - `Students count`: `0` (Completely excluded)
    - `Pastors count`: `1` (`sample16`, ID 1449 - strictly matching Engineering Wing level 5)
  - **Student Isolation**: Requesting `user_type: 'student'`:
    - `Believers count`: `0`, `Pastors count`: `0`, `Students count`: verified.
  - **Believer Isolation**: Requesting `user_type: 'believer'`:
    - `Pastors count`: `0`, `Students count`: `0`, `Believers count`: verified.
- **Production Web Deployment**:
  - Built Angular production bundle with 0 errors (`Hash: 9ac7906d7482eee8`).
  - Synced to AWS S3 `jbac-web-production-298363284024` and created CloudFront invalidation `I1FXIGM3PSAYNAZTVJRG8OZMFI`.
- **Mobile Repository Synchronization**:
  - Committed and pushed to `https://github.com/dr-mjoseph/jbac_app.git` (commit `9ada81e`).


---

## 55. Single-Button Selected User Type Header & Warning Message Removal (November 1, 2026)

### Context & User Objectives
1. **Remove Warning Message**: Remove the warning message / badge: `ఎంచుకున్న యూజర్ రకం (Selected User Type): పాస్టర్లు (Pastors) — ఇతర యూజర్ కేటగిరీలు తొలగించబడ్డాయి (Other user types isolated)`.
2. **Remove 2 of the 3 Buttons**: If a user is logged in as a Pastor, only the Pastors Requests button must be visible in their dashboard; the other two (Believers and Students) buttons must be removed. The same applies for Students (only Students button visible) and Believers (only Believers button visible).
3. **Mobile & Deployment**: Update mobile app, update documentation, and push all repositories.

### Implementation Details
- **Web Template (`src/app/jesus/leaders/leaders.component.html`)**:
  - Removed the warning message / badge `<div class="container mb-3">...</div>` entirely.
  - Added strict `*ngIf` conditions so that ONLY the button corresponding to the logged-in user's active category is rendered:
    - `formshow == 1` $ightarrow$ ONLY `👥 Believers Requests (విశ్వాసులు)` button is shown.
    - `formshow == 3` $ightarrow$ ONLY `✝️ Pastors Requests (పాస్టర్లు)` button is shown.
    - `formshow == 2` $ightarrow$ ONLY `🎓 Students Requests (విద్యార్థులు)` button is shown.
  - The remaining 2 buttons are completely omitted from the DOM, matching the exact requirement.
- **Mobile Template (`jbac_app/src/pages/wingcommand/wingcommand.html`)**:
  - Removed the badge text.
  - Applied the identical `*ngIf="formshow == 1"`, `*ngIf="formshow == 3"`, and `*ngIf="formshow == 2"` conditions on the mobile action button row so that on mobile devices, a Pastor leader sees only the Pastors button, a Student leader sees only the Students button, and a Believer leader sees only the Believers button.
- **Automated Web-to-Mobile Sync**:
  - Ran `sync-to-mobile.js` to mirror all updated templates and assets to `jbac_app`, committed, and pushed to `jbac_app` on GitHub.


---

## 56. Collapsible Search Filters Across 6 Views, News Category/Date Filters, Universal Loading Spinners & Android Release v0.0.47 (November 2, 2026)

### Context & Implementation
1. **Collapsible Search Filters**: Added space-saving collapsible toggle buttons (`showFilters = !showFilters`) across 6 member service views (`/institute`, `/marriages`, `/jobs`, `/help`, `/business`, `/organization`), collapsed by default with smooth Bootstrap CSS transitions.
2. **News Page Dual Filters**: Introduced independent expandable filters for Date and News Category on `/news` with full-page loading spinner preventing visual layout jumps.
3. **Android Release v0.0.47**: Bumped to version `0.0.47` (VersionCode `47`, Target SDK `36`), compiled, signed, and published release binaries.

---

## 57. Student Leadership Hierarchy (1-5), District Isolation Bug Fix, Admin District Leaders Cockpit & Mobile Release v0.0.48 (November 5, 2026)

### Context & Implementation
1. **Student Hierarchy 1-5**: Re-scoped student leadership levels strictly from District (1) down to Sub-Ward (5), removing invalid State Level options.
2. **Cross-District Isolation Fix**: Fixed multi-table ID collisions in `/dashboardapi/getUserMainData` where district leaders previously saw applicants from other districts due to session ID shadowing.
3. **Admin District Leaders Cockpit**: Added hero summary cards on `jbac.in/admin` tracking district leaders across AP & TG with interactive approval/rejection modal.
4. **Mobile Release v0.0.48**: Bumped `jbac_app` to version `0.0.48` (VersionCode `48`, Target SDK `36`), built and signed `jbacApp-0.0.48.apk` and `jbacApp-0.0.48.aab`.

---

## 58. Entrepreneur & Investor Ecosystem, Admin Cockpit, Bilingual Parity & Mobile Release v0.0.49 (November 5, 2026)

### Context & Implementation
1. **Entrepreneur & Investor Web Modules**:
   - Created `/entrepreneurregister` and `/investorregister` with strict state-first cascading guards for residential and business setup locations.
   - Complete Telugu & English bilingual interfaces with dynamic denomination and industry sector dropdowns.
2. **Admin Business Match Cockpit**:
   - Hero statistics card displaying total entrepreneurs, capital needed, registered investors, and capital to invest.
   - Dual-tab matching modal with State (AP/TG) and Sector filtering, and real-time status toggles.
3. **Mobile App Release v0.0.49**:
   - Created `EntrepreneurPage` and `InvestorPage` in Ionic mobile app.
   - Bumped to version `0.0.49` (VersionCode `49`, Target SDK `36`), compiled and signed `jbacApp-0.0.49.apk` and `jbacApp-0.0.49.aab`.

---

## 59. Pastor Registration State Dropdown Default Placeholder Visibility & Admin Cockpit Hero Counters Sync (November 6, 2026)

### Context & Implementation
1. **Pastor Registration State Dropdown Placeholder Fix**:
   - Resolved issue where the state select element rendered blank whitespace on initial load.
   - Initialized `state_id: ['', [Validators.required]]` in Angular Reactive Form and patched `state_id: ''` on `ngOnInit()` to visibly select `<option value="" selected disabled>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>`.
   - Recompiled production bundle and invalidated CloudFront cache.
2. **Admin Cockpit Hero Counters Synchronization**:
   - Hooked `fetchBusinessMatchData(true)` into `initApp()` and `refreshCurrentTab()` in `public.html` so hero counters load immediately on login without waiting for tab switches.
   - Added multi-path fallback and resilient array unwrapping for both `/dashboardapi/` and `/api/` routes.

---

## 60. Android Native Studio Dual-Write Backend: 6 AWS RDS MySQL Tables & 11 REST API Endpoints (November 6, 2026)

### Context & Implementation
1. **6 Dedicated MySQL Tables Provisioned**:
   - Provisioned `jbac_users`, `jbac_news`, `jbac_meetings`, `jbac_branches`, `jbac_prayer_requests`, and `jbac_chat_messages` in AWS RDS MySQL 8.4 (`jbac_jbac`).
2. **11 REST API Endpoints Deployed**:
   - Deployed on AWS Lambda (`jbac-backend-api`) in `ap-southeast-2`: `/usersync`, `/postnews`, `/getnews`, `/postevents`, `/events`, `/postbranches`, `/branches`, `/postprayers`, `/getprayers`, `/postchats`, `/chats/:u1/:u2`.
   - Enables native Android Studio apps using `ChurchRepository.kt` and Retrofit to dual-write alongside Firebase.
   - Verified 100% passing automated test suite with HTTP 200 OK responses.


---

## 61. Teaching Field Employees Registration System, Admin Directory & Mobile Release v0.0.50 (November 6, 2026)

### Context & Implementation
1. **Teaching Field Registration System (`/teacherregister`)**:
   - Bilingual Telugu & English registration form for Christian educators, professors, lecturers, and educational administrators across Andhra Pradesh & Telangana.
   - Enforced `Ramabhadra` font styling throughout the web and mobile interfaces.
   - Captured full name with surname, gender, mobile, email, exact designation, role category, qualification category, total experience years, experience subject, caste, faith category, family background (1st to 6th generation), church/pastor phone, teacher type (Government / Private), working institution level (10 tiers from Anganwady to Medical College), and institute name.
   - Strict state-first cascading guards on both Institute Address and Residential Address.
2. **Database Provisioning (AWS RDS MySQL `jbac_jbac`)**:
   - Created `teacher_reg` (33 columns, multi-state indexing) and 4 master lookup tables (`teaching_role_categories`, `teaching_family_backgrounds`, `teaching_institution_types`, `teaching_experience_levels`).
3. **Backend REST APIs Deployed (AWS Lambda `jbac-backend-api`)**:
   - Implemented 4 endpoints in `backend/server.ts`: `/dashboardapi/teaching-master-data`, `/dashboardapi/teacher-register`, `/dashboardapi/admin-teachers`, and `/dashboardapi/admin-update-teacher`.
4. **Admin Database Cockpit (`/admin`)**:
   - Integrated Teaching Field Employees hero summary card with live counts for Total Faculty, Government, and Private educators.
   - Implemented interactive modal with search, AP/TG state filter, role filter, type filter, status badges, and 1-click Approve/Reject actions.
5. **Mobile Application Release v0.0.50**:
   - Created `TeacherPage` in `src/pages/teacher/` with `Ramabhadra` font styling and bilingual UI.
   - Added launcher card in `forms.html` (id 11) and updated navigation.
   - Bumped version to `0.0.50` (`versionCode 50`, `targetSdkVersion 36`).
   - Successfully compiled and signed `jbacApp-0.0.50.apk` (v1+v2+v3 scheme) and `jbacApp-0.0.50.aab` / `appreleasesigned.aab`.

---

## 62. Teaching Field Enhancements, CV Upload, Dropdown Reliability, Global Styling & Mobile Release v0.0.51 (November 7, 2026)

### Context & Implementation
1. **Achievements, CTS & CV/Profile Fields Added**:
   - Added "మీ గురించి మరియు మీ సాధించిన విజయాల గురించి రాయండి (Write about yourself and your achievements)" full-width textarea to Teacher Registration on both Web (`/teacherregister`) and Mobile (`TeacherPage`).
   - Added optional "సీవీ / ప్రొఫైల్ అప్‌లోడ్ (Upload CV / Profile)" input supporting PDF and DOC/DOCX formats up to 5MB.
   - Added persistent columns `about_achievements TEXT`, `cts VARCHAR(50)`, `cv_profile LONGTEXT`, and `cv_file LONGTEXT` in MySQL RDS table `teacher_reg`.
   - Updated AWS Lambda backend `jbac-backend-api` to persist Indian timestamp `cts`, upload CVs directly to Amazon S3 (`https://jbac.in/uploads/teacher_cv/...`), and save clickable URLs in `cv_profile`.
   - Updated Admin console faculty directory modals to show candidate achievements, registration `cts` timestamps, and a 1-click `📄 View CV / Profile` link.
2. **Total Experience & Faith Category Dropdown Fixes**:
   - Normalized `experienceLevels` to map database column keys `years_range` and `label_te` seamlessly, eliminating blank white dropdown rows.
   - Normalized `denominations` with whitespace and newline trimming, pre-seeding synchronous fallbacks to guarantee non-empty lists.
   - Added global CSS rules in `src/styles.css` forcing dark font (`#1e293b`) on white background (`#ffffff`) for `<select>` and `<option>` elements across all browsers.
3. **Mobile Application Release v0.0.51 (Updated)**:
   - Updated version to `0.0.51` and `versionCode 51` across `config.xml`, `package.json`, `build.gradle`, and `AndroidManifest.xml`.
   - Maintained Android 16 target compatibility (`targetSdkVersion 36`).
   - Compiled, signed, and verified: `jbacApp-0.0.51.apk`, `jbacApp-0.0.51.aab`, and `appreleasesigned.aab`.

---

## 63. Admin Cockpit Multi-Select Batch Delete, Light/Dark Theme Switch, Compact Teacher Banner & SEO Sitemap/Robots (November 9, 2026)

### Context & Implementation
1. **Admin Multi-Select Batch Deletion (`/admin`)**:
   - Master and individual row checkboxes added across all 89 database tables in `Tables & Schema Explorer (89)`.
   - Selected rows highlight with `.selected-row` background tint.
   - Dynamic action button `🗑️ Delete Selected (N)` with live counter appears in toolbar.
   - Full confirmation modal with target table, record count, and record IDs preview.
   - New atomic backend endpoint: `POST /dashboardapi/crud/:table/batch-delete` managing foreign keys and performing batch deletions with automatic SQL query fallback.
2. **Light / Dark Theme Toggle Switch (`/admin`)**:
   - Added `#themeToggleBtn` (`☀️ Light` / `🌙 Dark`) to header controls.
   - Complete CSS styling palette under `body.light-theme` with high-contrast text (`#0f172a`), clean borders, and clear table/modal readability.
   - Persistent theme setting in browser `localStorage` (`jbac_admin_theme`).
3. **Teacher Registration Compact Banner (`/teacherregister`)**:
   - Reduced hero card padding, typography margins, and replaced large icon with a 44x44px circular icon badge (`.hero-icon-badge`).
   - Slashed title banner height by >60% (~150px vs ~380px) bringing form fields above the fold while preserving Telugu `Ramabhadra` typography.
4. **Google Search Console Sitemap & Robots Configuration**:
   - Generated standard XML sitemap (`sitemap.xml`) covering all 40+ public routes, service directories, and all 10 specialized registration wings.
   - Configured `robots.txt` referencing `https://jbac.in/sitemap.xml`.
   - Deployed on Amazon S3 and AWS Lambda with `application/xml` and `text/plain` headers, verified live via CloudFront.
5. **Domain Verification via Amazon Route 53 DNS & HTML Meta Tag**:
   - Resolved GoDaddy DNS delegation to Amazon Route 53 (`Z04439382BRRO1T3Y6B16`).
   - Added DNS TXT record `google-site-verification=_oLcacoasFR-yEuakbg-gz1ZqHfVCJVdGF-JgHMxg_0` synchronized across global Route 53 edge locations.
   - Added verification `<meta>` tag to `src/index.html` and deployed to production CloudFront.


6. **Google Search Console & PageSpeed Insights Optimization Guide**:
   - Consolidated and documented all 15 performance and SEO modifications generated by the optimization agent (commit `ba679b3598e6d79ec520582784e326c103ddda96`).
   - Includes full technical inventory of script deferrals (`defer` on 20+ vendor and UI scripts in `src/index.html`), WebP image format compression (12 assets in `src/assets/images/`), Google Fonts `display=swap`, CloudFront revalidation caching in `aws/deploy.ps1`, backup snapshot safety (`src/index.html.bak`), and emergency rollback procedures.
   - Dedicated reference guide: [`PAGESPEED_AND_SEARCH_CONSOLE_OPTIMIZATION_GUIDE.md`](PAGESPEED_AND_SEARCH_CONSOLE_OPTIMIZATION_GUIDE.md).

---

## 64. Teacher Registration WhatsApp Number Field & Mobile App Release v0.0.52 (November 10, 2026)

### Context & Implementation
1. **Database Schema Update (`teacher_reg`)**:
   - Added persistent column `whatsapp varchar(25) DEFAULT NULL AFTER mobile` to `teacher_reg` in AWS RDS MySQL 8.4 (`jbac_jbac`).
2. **Backend API Update (`jbac-backend-api`)**:
   - Updated `POST /dashboardapi/teacher-register` in `backend/server.ts` & `backend/server.js` to extract `whatsapp` and insert it into `teacher_reg`.
   - Updated `backend-deploy.zip` and deployed to AWS Lambda `jbac-backend-api`.
3. **Web Portal Registration Form (`https://jbac.in/teacherregister`)**:
   - Added `వాట్సాప్ నంబర్ (WhatsApp Number)` input field beside `Mobile Number` in `src/app/jesus/teacherregister/teacherregister.component.html`.
   - Arranged personal contact row into 3 balanced responsive columns: Mobile (`col-md-4`), WhatsApp (`col-md-4`), Email (`col-md-4`).
   - Integrated form control validation `/^[0-9]{10}$/` and `numericOnly($event)` input filtering in `teacherregister.component.ts`.
   - Updated admin console table (`backend/admin_db.html`, `public.html`) to display WhatsApp badge (`💬 WA: <number>`).
4. **Mobile App Release v0.0.52 (`jbac_app`)**:
   - Added `వాట్సాప్ నంబర్ (WhatsApp Number)` input item in `src/pages/teacher/teacher.html` and `teacher.ts`.
   - Bumped version to `0.0.52` (VersionCode `52`) across `config.xml`, `package.json`, `build.gradle`, and `AndroidManifest.xml` targeting API Level 36 (`targetSdkVersion 36`).
   - Built and signed release artifacts:
     - `jbacApp-0.0.52.apk` (dual v2+v3 signed, 4-byte zipalign).
     - `jbacApp-0.0.52.aab` & `appreleasesigned.aab` (signed with `Jbac.keystore`, Google Play ready).
   - Created `RELEASE_NOTES_v0.0.52.md`.


---

## 65. Help Portal Overhaul, Christian Educational Institutes Registration ("క్రిస్టియన్ విద్యా సంస్థల నమోదు"), & Institutes Card Redesign (November 10, 2026)

### Context & Implementation
1. **Help Page Overhaul (`https://jbac.in/help`)**:
   - Removed `ఫిల్టర్ సెర్చ్ (Filter / Post)` button and lower card list view.
   - Preserved scrolling advertisements marquee (`ప్రకటనలు / సమాచారం`) in the right sidebar.
   - Converted "Looking for help" into an always-visible Telugu form: `పేరు (Name)*`, `మొబైల్ నంబర్ (Mobile Number)*`, `చిరునామా (Address)*`, `సహాయం రకం (Help Type)*`, `సహాయ వివరాలు / వివరణ (Description)*`, and optional `చిత్రం అప్‌లోడ్ (Image Upload)`.
   - Removed all English titles and formatted in clear Telugu.
2. **Christian Educational Institutes Registration (`https://jbac.in/addinstitute`)**:
   - Added direct navigation link under Services (`సేవలు`) as **"క్రిస్టియన్ విద్యా సంస్థల నమోదు"** (`christian vidya samsthalu namodu`).
   - In form: commented out "Type of Owner" and "Type of Ministry" fields.
   - Added fields: "ఛైర్మన్ / ఓనర్ పేరు (Chairman / Owner Name)" and "ఫోన్ నంబర్ (Phone Number)".
   - Replaced college type dropdown with 12 multi-select checkboxes for institutions (School, Junior College, Degree College, PG, Engineering, Medical/Nursing, Pharmacy, B.Ed/D.Ed, Polytechnic/ITI, Bible College, University, Other).
   - Added "డెనామినేషన్ (Denomination)" dropdown populated dynamically from the database.
   - Upgraded location to "గూగుల్ లొకేషన్ లింక్ (Google Location Link)" with a "📍 ప్రస్తుత లొకేషన్" (Current Location) geolocation auto-detect button.
3. **Institutes Listing Redesign (`https://jbac.in/institute`)**:
   - Enlarged view cards with responsive `col-md-6` layout and removed all curved edges (`border-radius: 0 !important;`).
   - Removed visibility of "College Type" and "Phone Number" on every card.
   - Positioned social media action icons (Location, YouTube, Facebook, Call) directly under "Courses Offered".
   - Added "READ MORE ▼" / "READ LESS ▲" expander toggle underneath the social media icons to view Chairman/Owner, Address, Website, and Description.
4. **Database & Backend API Updates**:
   - Altered RDS MySQL `helps` table: added column `address text DEFAULT NULL`.
   - Altered `institutes` table: added column `owner_name varchar(255) DEFAULT NULL`, expanded `college_type` to `text`.
   - Updated `POST /dashboardapi/posthelping` and `POST /dashboardapi/postinsututies` in `backend/server.ts` & `backend/server.js`.
   - Packaged and deployed update to AWS Lambda `jbac-backend-api`.
5. **Mobile Application Sync (`jbac_app`)**:
   - Mirrored all form and listing changes to `help`, `addinstitute`, `institute`, and `account` pages in `jbac_app`.
   - Verified clean compilation with `ionic-app-scripts build` (0 errors).
   - Committed and pushed to `https://github.com/dr-mjoseph/jbac_app.git` (commit `e1e8719`).
6. **Web Production Deployment**:
   - Built Angular production bundles (`npm run build:prod`).
   - Synced to AWS S3 `s3://jbac-web-production-298363284024`.
   - Invalidated CloudFront distribution `EOBBU8SU7H3BI` (invalidation `I7AK6Z4XGJNX5ECMGS63S8SJFC`).


---

## 66. Institute Registration Relocation to Registrations Menu, Clean Telugu Registration Sub-Items & Denomination Dropdown Whitespace Resolution (November 10, 2026)

### Key Updates
1. **Relocated Christian Educational Institutes Registration**:
   - Moved "క్రిస్టియన్ విద్యా సంస్థల నమోదు" (`/addinstitute`) from "సేవలు" (Services) to "రిజిస్ట్రేషన్స్" (Registrations) across desktop main header, sticky navbar, and mobile drawer navigation.
2. **Standardized Telugu Registration Sub-Items**:
   - Removed English annotations `(Entrepreneur)`, `(Investor)`, `(Teachers)` from the Registrations dropdown menu for a clean, professional Telugu UI.
3. **Denomination Dropdown Whitespace Bug Fix**:
   - **Root Cause**: Database table `churchdenomation` uses column name `denomation_name`. The template requested `{{item.denomination}}`, which returned `undefined` and caused browsers to render ~50 blank whitespace options.
   - **Fix**: Added `denomation_name as denomination` alias to `/dashboardapi/denomations` in backend API (`server.ts` & `server.js`) and added defensive fallbacks `{{ item.denomation_name || item.denomination_name || item.denomination }}` across both web and mobile templates.
4. **Deployments**:
   - Packaged and deployed update to AWS Lambda `jbac-backend-api`.
   - Built production Angular bundle (`npm run build:prod`) and deployed to AWS S3 & CloudFront (Distribution `EOBBU8SU7H3BI`).
   - Synced mobile app (`jbac_app`), compiled clean, and pushed to GitHub `main` (`52865fd`).


---

## 67. Mobile App Release v0.0.53: Help Form Overhaul, Christian Educational Institutes Registration, Square Card Redesign & API Level 36 Compliance (November 10, 2026)

### Highlights
1. **Help Form Synchronization**:
   - Replaced legacy UI in `HelpPage` with a pure Telugu form with mandatory `పేరు (Name)`, `మొబైల్ నంబర్ (Mobile Number)`, `చిరునామా (Address)`, `సహాయం రకం (Help Type)`, and `వివరణ (Description)`.
   - Made image upload optional with camera/gallery fallbacks.
2. **Christian Educational Institutes Registration ("క్రిస్టియన్ విద్యా సంస్థల నమోదు")**:
   - Moved to `FormsPage` (Registrations menu) and removed English labels from all registration sub-items.
   - Hid "Type of Owner" and "Type of Ministry".
   - Added "Chairman / Owner Name", "Phone Number", 12 multi-select checkboxes for College Type, dynamic "Denomination" dropdown, and Google Location Link with "📍 ప్రస్తుత లొకేషన్" GPS auto-detection.
3. **Institute Listing Redesign**:
   - Implemented square cards (`border-radius: 0 !important;`), hid College Type and Phone Number by default, placed social media buttons under Courses Offered, and placed Read More underneath social icons.
4. **Android Release v0.0.53 Deliverables**:
   - **Target SDK**: `36` (Android API Level 36) | **VersionCode**: `53` | **Version**: `0.0.53`
   - **Release APK**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.53.apk` (dual v2+v3 signed).
   - **Release AAB**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.53.aab` & `appreleasesigned.aab` (Google Play production signed).
   - Committed and pushed to `jbac_app` GitHub repository (`a06564d`).


---

## 68. Help Form Reset Fix, Full Name Rename, Denomination & AP/TG Location Hierarchy, RDS Migration & Mobile Release v0.0.54 (November 11, 2026)

### Highlights
1. **Help Form Fixes & Field Additions (`https://jbac.in/help` & Mobile `HelpPage`)**:
   - **Post-Submit Reset Fix**: Removed session-based prefilling on submit/init and introduced `resetFormCompletely()` to clear all form inputs, file selection (`#formFile`), `imagesData`, validation flags, and cascading dropdown selections/disabled states after submission.
   - **Telugu Name Rename**: Renamed Name field title from `పేరు *` to **`పూర్తి పేరు *`** ("Full Name").
   - **Denomination Dropdown**: Added **`డెనామినేషన్ *`** directly after `మొబైల్ నంబర్ *` using the existing `churchdenomation` table (`getdenomation()`).
   - **Strict AP/TG Cascading Hierarchy Before Address**: Moved `చిరునామా *` (Address) below a sequential, parent-gated geographic cascade for Andhra Pradesh & Telangana:
     `రాష్ట్రం (State)` → `జిల్లా (District)` → `నియోజకవర్గం (Constituency)` → `మండలం (Mandal)` → `పంచాయతీ / వార్డు / సబ్-వార్డు (Panchayat/Ward/Sub-Ward)` → `చిరునామా (Address)`.
2. **Database & Backend API Updates**:
   - Ran `scripts/migrate_helps_v54.js` to add `denomination_id`, `state_id`, `state`, `district_id`, `constituency_id`, `mandal_id`, and `panchayat_id` columns to RDS MySQL table `helps`.
   - Updated `POST /dashboardapi/posthelping` and `ALL /dashboardapi/gethelps` in `backend/server.ts` & `backend/server.js`, and deployed to AWS Lambda `jbac-backend-api`.
3. **Web Production & Mobile Release v0.0.54 (API Level 36)**:
   - Built Angular production bundle (`npm run build:prod`, hash `f027a2849e74315a`) and deployed to AWS S3 & CloudFront (Distribution `EOBBU8SU7H3BI`, Invalidation `I64X7SIE7Q3KYJ639GYK67692L`).
   - Built & signed mobile app `0.0.54` (`versionCode 54`, `targetSdkVersion 36`): `jbacApp-0.0.54.apk` (`130,643,641` bytes), `jbacApp-0.0.54.aab` & `appreleasesigned.aab` (`127,679,243` bytes).
   - Created `RELEASE_NOTES_v0.0.54.md` and synced both `jbac_web` and `jbac_app` repositories on GitHub.
