# Release Notes - JBAC Web & Mobile App v0.0.48

## Release Metadata
- **Release Version**: `0.0.48` (Version Code: `48`)
- **Release Date**: November 5, 2026
- **Web App URL**: [https://jbac.in](https://jbac.in)
- **Admin Database Cockpit**: [https://jbac.in/admin](https://jbac.in/admin)
- **Leaders Portal**: [https://jbac.in/leaders](https://jbac.in/leaders)
- **Student Registration**: [https://jbac.in/studentregister](https://jbac.in/studentregister)
- **AWS S3 Production Bucket**: `jbac-web-production-298363284024`
- **AWS CloudFront Distribution**: `EOBBU8SU7H3BI` (`d2wtiz94oy03oy.cloudfront.net`)
- **AWS Lambda Backend API**: `jbac-backend-api` (Node.js 18.x, `ap-southeast-2`)
- **Database**: AWS RDS MySQL 8.4 (`jbac_jbac` on `jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com`)
- **Mobile Target SDK**: `36` (Android 15 / 16 — API level 36 or above)

---

## 🌟 Key Updates in Version 0.0.48

### 1. Student Leadership Hierarchy Restructuring (District $\rightarrow$ Sub-Ward)
- **Removed State Level**: For student registration, leadership now starts directly from **District Level**.
- **Sequential Numbering (Levels 1 to 5)**:
  - `1`: **District Level (జిల్లా స్థాయి)** — Maps canonically to Level 2 (District Leader).
  - `2`: **Constituency Level (నియోజకవర్గం స్థాయి)** — Maps canonically to Level 3 (Constituency Leader).
  - `3`: **Municipality / Mandal Level (మున్సిపాలిటీ / మండల స్థాయి)** — Maps canonically to Level 4 (Mandal Leader).
  - `4`: **Ward / Panchayati Level (పంచాయతి స్థాయి)** — Maps canonically to Level 5 (Panchayat Leader).
  - `5`: **Ward / Sub-Ward Level (వార్డు / సబ్ వార్డు స్థాయి)** — Maps canonically to Level 6 (Ward/Sub-Ward Leader).
- **Subordinate Filter Query**: Updated backend `getStudentLevelSql` to recognize both numeric strings (`'1'`, `'2'`, `'3'`, `'4'`, `'5'`) and Telugu/English text values.

---

### 2. Multi-Table User ID Collision Fix (District 21 vs District 14 Bug)
- **Root Cause**: `signup_form`, `pastor_reg`, and `student_reg` are independent tables with auto-incrementing IDs. When a student with ID `121` (`Tagaram kavyanjali`, District 21, Krishna, AP) logged in, previous session parameter binding checked `signup_form` first, matching believer ID `121` (`Birru kiran`, District 14, Kadapa, AP). This caused District 14 applicants to falsely display in the District 21 student leader's dashboard.
- **The Resolution**:
  - Implemented **Role-Aware Session Priority Lookup** in `/dashboardapi/getLeaderswebsiteData`:
    - If `category_id == '2'` or `user_type == 'student'`, the server queries `student_reg` first.
    - If `category_id IN ('3', '4')` or `user_type == 'pastor'`, the server queries `pastor_reg` first.
    - If `category_id == '1'` or `user_type == 'believer'`, the server queries `signup_form` first.
  - Verified live: District 21 student leader ID 121 now retrieves **only** direct Constituency subordinates in District 21 (`test2`, `sample18`, `Ch.vamsi kumar`) with zero records from other districts.

---

### 3. State-Wise District Leaders Management Box (`jbac.in/admin`)
- **Top Dashboard Hero Box**:
  - Positioned prominently below the Categorical State View bar and above the metrics grid on `https://jbac.in/admin`.
  - Displays real-time summary counts: **Total Leaders**, **Approved (`d_in = 1`)**, **Pending**, and **Rejected**.
  - Clicking **"Review & Approve ➔"** opens the comprehensive District Leaders Console.
- **Elaborative Management Modal (`#districtLeadersModal`)**:
  - **State Filter**: `[All States]` | `[Andhra Pradesh (AP)]` | `[Telangana (TG)]`.
  - **Category Filter**: `[All Roles]` | `[Pastors]` | `[Believers]` | `[Students]`.
  - **Status Filter**: `[All Status]` | `[Approved]` | `[Pending]` | `[Rejected]`.
  - **Live Search**: Instant client-side search by name, phone, district, constituency, or wing.
  - **Direct Admin Controls**:
    - `✓ Approve`: Sets `approval_ind = 1, d_in = 1`.
    - `✕ Reject`: Sets `approval_ind = 2, d_in = 0`.
    - `↺ Reset`: Sets `approval_ind = 0, d_in = 0`.
  - **Real-Time UI Updates**: Modifies badges and top summary stats instantly without a full page reload.
- **New Backend Endpoints**:
  - `GET /dashboardapi/admin-district-leaders` & `/api/admin-district-leaders`
  - `POST /dashboardapi/admin-update-district-leader` & `/api/admin-update-district-leader`

---

### 4. Mobile App Release v0.0.48 (API 36+)
- **Student Registration**: Aligned `src/pages/student/student.html` with the identical 1–5 District-to-Sub-Ward hierarchy.
- **Leaders Command Center**: Enhanced `getDetailedLeaderStatus` in `src/pages/wingcommand/wingcommand.ts` to parse numeric levels (`1`–`5`) alongside text.
- **Target SDK Upgrade**: Set to **API 36** (`android-targetSdkVersion="36"`).
- **Release Binaries Generated & Verified**:
  - `jbacApp-0.0.48.aab` (`127.4 MB`) — Signed with production keystore (`SHA256withRSA`).
  - `jbacApp-0.0.48.apk` (`130.4 MB`) — Dual-signed with Apksigner Scheme v2 + v3, 4-byte zipaligned.
  - `appreleasesigned.aab` (`127.4 MB`) — Ready for Google Play Console submission.

---

## 🚀 Verification & Deployment Status

| Component | Target / Environment | Status | Verification Details |
| :--- | :--- | :--- | :--- |
| **AWS Lambda** | `jbac-backend-api` (`ap-southeast-2`) | **Deployed** | Packaged `server.js` and `public.html`; tested live with 66 district leaders |
| **AWS S3** | `jbac-web-production-298363284024` | **Deployed** | Angular production build and assets synced |
| **AWS CloudFront** | `EOBBU8SU7H3BI` | **Invalidated** | Cache invalidation `IZSTECQO41V9SF12SFGCORYOD` |
| **Web Git Repo** | `dr-mjoseph/jbac_web` | **Pushed** | Commit `4dbd495` on `main` |
| **Mobile Git Repo** | `dr-mjoseph/jbac_app` | **Pushed** | Commit `ea714b2` on `main` |
