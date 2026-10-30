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
                      |   jbac.in / www.jbac.in   |       |  (jbacApp-0.0.43.apk/aab) |
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
   - Android app compliant with Google Play Store standards (`targetSdkVersion 36`, `minSdkVersion 24`, release version `0.0.46` / `versionCode 46`).
   - Official production release signing via `Jbac.keystore`.
   - Full State (`రాష్ట్రం / State`) selection and cascading district loading across search modules and all registration forms.
   - Optimized navigation touch targets, zero click delay, and hardware back button handling.

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
