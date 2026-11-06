# Release Notes - JBAC Web & Mobile App v0.0.50

## Release Metadata
- **Release Version**: `0.0.50` (Version Code: `50`)
- **Release Date**: November 6, 2026
- **Web App URL**: [https://jbac.in](https://jbac.in)
- **Admin Database Cockpit**: [https://jbac.in/admin](https://jbac.in/admin)
- **Teaching Staff Registration**: [https://jbac.in/teacherregister](https://jbac.in/teacherregister)
- **Entrepreneur Registration**: [https://jbac.in/entrepreneurregister](https://jbac.in/entrepreneurregister)
- **Investor Registration**: [https://jbac.in/investorregister](https://jbac.in/investorregister)
- **AWS S3 Production Bucket**: `jbac-web-production-298363284024`
- **AWS CloudFront Distribution**: `EOBBU8SU7H3BI` (`d2wtiz94oy03oy.cloudfront.net`)
- **AWS Lambda Backend API**: `jbac-backend-api` (Node.js 18.x, `ap-southeast-2`)
- **Database**: AWS RDS MySQL 8.4 (`jbac_jbac` on `jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com`)
- **Mobile Target SDK**: `36` (Android 15 / 16 — API level 36 or above)

---

## 🌟 Key Features & Updates in Version 0.0.50

### 1. Teaching Field Employees Registration (`/teacherregister`)
A dedicated, bilingual platform empowering Christian teachers, professors, lecturers, and educational administrators across Andhra Pradesh (AP) and Telangana (TG):
- **Full Name with Surname**: Complete Telugu & English bilingual field for personal identification (`ఇంటిపేరుతో సహా పూర్తి పేరు`).
- **Gender**: Male (`పురుషుడు`), Female (`స్త్రీ`), Other (`ఇతరులు`).
- **Contact Details**: 10-digit mobile number and email.
- **Exact Designation**: Precise academic and administrative title (`ఖచ్చితమైన హోదా`, e.g., SGT, School Assistant, Lecturer, Principal, Professor, Dean).
- **Role Category**:
  - `Administration` (పరిపాలన)
  - `Teaching` (బోధన)
  - `Administration and Teaching` (పరిపాలన మరియు బోధన)
- **Qualification Category**:
  - `10th or Below 10th` (10వ తరగతి లేదా అంతకంటే తక్కువ)
  - `Inter` (ఇంటర్మీడియట్)
  - `UG` (గ్రాడ్యుయేషన్ / డిగ్రీ)
  - `PG` (పోస్ట్ గ్రాడ్యుయేషన్)
  - `Ph.D` (డాక్టరేట్)
  - `Post Doctoral` (పోస్ట్ డాక్టోరల్)
- **Experience Profile**:
  - **Total Experience**: `0-1 Years`, `1-3 Years`, `3-5 Years`, `5-10 Years`, `10-15 Years`, `15-20 Years`, `20+ Years`.
  - **Experience In**: Specific subject or domain (`అనుభవం ఉన్న విభాగం / సబ్జెక్ట్`, e.g., Mathematics, Physics, English, Computer Science, Telugu, etc.).
- **Social & Spiritual Background**:
  - **Caste**: `OC`, `BC-A`, `BC-B`, `BC-C`, `BC-D`, `BC-E`, `SC`, `ST`, `Others` with optional Subcaste.
  - **Faith Category / Denomination**: Integrated with existing `denominations` database.
  - **Family Background**:
    - `First Generation Employee` (మొదటి తరం ఉద్యోగి)
    - `Second Generation` (రెండవ తరం ఉద్యోగి)
    - `Third Generation` (మూడవ తరం ఉద్యోగి)
    - `Fourth Generation` (నాల్గవ తరం ఉద్యోగి)
    - `Sixth Generation Employee` (ఆరవ తరం ఉద్యోగి)
  - **Church / Pastor Phone Number**: Pastor's 10-digit mobile number for ecclesiastical endorsement.
- **Teacher Type**:
  - `Government` (ప్రభుత్వ ఉద్యోగి)
  - `Private` (ప్రైవేట్ ఉద్యోగి)
- **Working Institution Level**:
  - `Anganwady` (అంగన్‌వాడీ)
  - `Play School` (ప్లే స్కూల్)
  - `Primary School` (ప్రాథమిక పాఠశాల)
  - `High School` (ఉన్నత పాఠశాల)
  - `Junior College` (జూనియర్ కళాశాల)
  - `Vocational College` (వృత్తి విద్యా కళాశాల)
  - `Diploma College` (డిప్లొమా కళాశాల)
  - `Degree College` (డిగ్రీ కళాశాల)
  - `Technical College` (సాంకేతిక / ఇంజనీరింగ్ కళాశాల)
  - `Medical College` (వైద్య కళాశాల)
- **Institute Name & Address**:
  - Name of Institution (`విద్యా సంస్థ పేరు`)
  - **Institute Address Cascade**: State (AP / TG) $\rightarrow$ District $\rightarrow$ Constituency $\rightarrow$ Mandal $\rightarrow$ Panchayat/Village $\rightarrow$ Detailed Address.
  - **State-First Guarding**: Subordinate levels remain strictly disabled until the State and subsequent parent levels are chosen.
- **Residential Address**:
  - **Residential Address Cascade**: State (AP / TG) $\rightarrow$ District $\rightarrow$ Constituency $\rightarrow$ Mandal $\rightarrow$ Panchayat/Village $\rightarrow$ House No / Street.

---

### 2. Database Provisioning & Metadata Architecture
Five specialized tables were created in AWS RDS MySQL (`jbac_jbac`):
1. `teacher_reg`: Master storage table for teaching professionals (33 columns, multi-state indexing, audit timestamps, and review status flags).
2. `teaching_role_categories`: Pre-seeded with Administration, Teaching, and Combined categories.
3. `teaching_family_backgrounds`: Pre-seeded with 1st, 2nd, 3rd, 4th, and 6th generation options.
4. `teaching_institution_types`: Pre-seeded with 10 institution tiers from Anganwady to Medical College.
5. `teaching_experience_levels`: Pre-seeded with 7 standard experience brackets.

---

### 3. Backend REST APIs Deployed to AWS Lambda
Deployed to `jbac-backend-api` in `ap-southeast-2`:
- `GET /dashboardapi/teaching-master-data` & `/api/teaching-master-data`: Returns role categories, institution levels, family backgrounds, experience tiers, and qualifications.
- `POST /dashboardapi/teacher-register` & `/api/teacher-register`: Validates and inserts teacher records with dual address resolution.
- `GET /dashboardapi/admin-teachers` & `/api/admin-teachers`: Administrative fetch endpoint with join-resolved district, state, and constituency names.
- `POST /dashboardapi/admin-update-teacher` & `/api/admin-update-teacher`: Administrative approval and rejection workflow.

---

### 4. Admin Database Cockpit Console (`/admin`)
- **Teaching Field Employees Hero Card**: Live summary metrics showing Total Faculty, Government Teachers, and Private Teachers across AP & TG with state-filter support.
- **Teaching Employees Console Modal**:
  - Full-text search across faculty names, designations, phone numbers, and institution names.
  - State filter (All States / AP / TG).
  - Role filter (Teaching / Administration / Admin & Teaching).
  - Type filter (Government / Private).
  - One-click **Approve (✓)** and **Reject (✕)** actions updating `teacher_reg.status`.

---

### 5. Mobile Application Release v0.0.50
- **Version**: `0.0.50` | **Version Code**: `50` | **Target SDK**: `36` (Android 15 / 16).
- **New Page**: `TeacherPage` (`src/pages/teacher/`) with full Telugu & English bilingual UI.
- **Design System**: Enforced `Ramabhadra` font style across mobile screens matching web brand identity.
- **Forms Navigation**: Added card option `📚 బోధనా రంగ ఉద్యోగుల రిజిస్టర్ (Teachers Register)` with icon and gradient styling.
- **Build Artifacts**:
  - `jbacApp-0.0.50.apk` (Signed with v1 + v2 + v3 scheme using `Jbac.keystore`)
  - `jbacApp-0.0.50.aab` (Signed with jarsigner)
  - `appreleasesigned.aab` (Ready for Google Play Store upload)
