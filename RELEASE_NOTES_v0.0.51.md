# Release Notes - JBAC Mobile & Web Application v0.0.51

**Release Date:** November 7, 2026  
**Build Target:** Android API Level 36 (Android 15+ / Vanilla Ice Cream)  
**Version Code:** `51`  
**Version Name:** `0.0.51`  
**Platform Parity:** Web Portal (`jbac.in`) & Hybrid Mobile App (`jbac_app`)

---

## 🚀 Key Updates & Enhancements in v0.0.51

### 1. New Fields: "Write about yourself and your achievements" & "Upload CV/Profile"
- **Web (`jbac_web`) & Mobile (`jbac_app`)**:
  - Added dedicated full-width textarea field: `about_achievements` under the Professional & Teaching Profile section.
  - Added optional **"Upload CV/Profile" (సీవీ / ప్రొఫైల్ అప్‌లోడ్)** field accepting `.pdf, .doc, .docx` documents (up to 5MB) with selection feedback and remove option.
  - Telugu & English bilingual placeholder guidance: `"మీ విద్యా బోధనా ప్రస్థానం, సాధించిన విజయాలు, గుర్తింపులు, అవార్డులు లేదా ఇతర ముఖ్య వివరాలు ఇక్కడ నమోదు చేయండి..."`.
- **Database (`teacher_reg`)**:
  - Added persistent columns `about_achievements TEXT DEFAULT NULL`, `cts VARCHAR(50) DEFAULT NULL`, `cv_profile LONGTEXT DEFAULT NULL`, and `cv_file LONGTEXT DEFAULT NULL` to the `teacher_reg` table in AWS RDS MySQL 8.4.
  - Uploaded resumes are securely stored on Amazon S3 and saved as direct, clickable HTTP links (`https://jbac.in/uploads/teacher_cv/...`) viewable by administrators.
- **Backend REST API**:
  - Enhanced `POST /dashboardapi/teacher-register` and `POST /api/teacher-register` to ingest `cts`, auto-upload CV documents to Amazon S3, and persist `about_achievements`.
  - Exposed `about_achievements`, `cts`, and `cv_profile` in `GET /dashboardapi/admin-teachers` for admin review in the Faculty Directory Cockpit with a 1-click `📄 View CV / Profile` button.

---

### 2. Resolved "Total Experience : Years" Dropdown Visibility Bug
- **Root Cause**:
  - The database table `teaching_experience_levels` returns `years_range` (e.g. `'0-1 Years'`) and `label_te` (e.g. `'0-1 సంవత్సరాలు (0-1 Years)'`).
  - Previously, the template bound `[value]="exp.name_en"` and `{{ exp.name_te }}`, which resolved to empty strings when live database rows loaded, causing options to appear as a blank white box.
- **Fix**:
  - Updated template bindings across web and mobile to `[value]="exp.years_range || exp.name_en"` and `{{ exp.label_te || exp.name_te || exp.years_range }}`.
  - Pre-seeded and normalized `experienceLevels` synchronously in both `teacherregister.component.ts` and `teacher.ts`.
  - Added explicit CSS styling `select option { color: #1e293b !important; background-color: #ffffff !important; }` ensuring crisp readability across all browsers and operating system color schemes.

---

### 3. Signed Mobile Release Deliverables
- **Signed APK**: `jbacApp-0.0.51.apk` (dual v1 + v2 + v3 signed, zipalign 4-byte aligned).
- **Signed Production AAB**: `jbacApp-0.0.51.aab` (signed with production keystore `Jbac.keystore`).
- **Google Play Bundle**: `appreleasesigned.aab` (verified with `aapt dump badging`, targetSdkVersion 36, versionCode 51).

---

### 4. Admin Cockpit Multi-Select Batch Delete & Light/Dark Theme Switch
- **Multi-Select Batch Deletion**:
  - Master and individual row checkboxes added across all 89 tables in `Tables & Schema Explorer (89)` on `https://jbac.in/admin`.
  - Selected rows highlight with `.selected-row` background tint.
  - Floating toolbar button `🗑️ Delete Selected (N)` with live counter appears in toolbar.
  - Confirmation modal warning the admin with target table name, count, and ID list.
  - Added atomic backend endpoint `POST /dashboardapi/crud/:table/batch-delete` managing foreign keys and performing atomic SQL deletions with query fallback.
- **Light / Dark Theme Toggle**:
  - Added `#themeToggleBtn` (`☀️ Light` / `🌙 Dark`) to header controls.
  - Full CSS custom properties palette under `body.light-theme` with high-contrast slate text (`#0f172a`), clean borders, and clear table/modal readability.
  - Theme preference persisted in `localStorage` (`jbac_admin_theme`).

---

### 5. Teacher Registration Compact Hero Banner
- **Compact Hero Design**:
  - In `teacherregister.component.html` and `.css`:
    - Reduced outer container vertical padding and card body padding.
    - Replaced large icon with a compact 44x44px circular icon badge (`.hero-icon-badge`).
    - Tightened title, subtitle, and description margins and font sizing.
    - Slashed title banner height by >60% (~150px vs ~380px) bringing form fields above the fold while preserving Telugu `Ramabhadra` typography.

---

### 6. Google Search Console SEO Sitemap & Robots Configuration
- **Sitemap Generation (`sitemap.xml`)**:
  - Authored standard XML sitemap (`sitemap.xml`) covering all 40+ public routes, service directories, and all 10 specialized registration wings.
- **Robots Directives (`robots.txt`)**:
  - Configured `robots.txt` referencing `https://jbac.in/sitemap.xml`.
- **Live Deployment**:
  - Uploaded to Amazon S3 root and AWS Lambda route handlers (`/sitemap.xml`, `/robots.txt`).
  - Verified live via CloudFront with `application/xml` and `text/plain` headers.

---

### 7. Google Search Console Domain Verification
- **Route 53 DNS TXT Record**:
  - Added TXT record `google-site-verification=_oLcacoasFR-yEuakbg-gz1ZqHfVCJVdGF-JgHMxg_0` to AWS Route 53 Hosted Zone `Z04439382BRRO1T3Y6B16` for `jbac.in`.
  - Propagated globally with status `INSYNC` and verified with Google Public DNS (`8.8.8.8`).
- **HTML Verification Tag**:
  - Added verification `<meta>` tag to `index.html` on CloudFront.

---

## 🛠️ Verification & Validation
- **AAPT Badging**:
  ```
  package: name='io.ionic.starterjbac' versionCode='51' versionName='0.0.51'
  targetSdkVersion:'36'
  ```
- **DNS TXT Record**: Verified with `Resolve-DnsName -Name jbac.in -Type TXT -Server 8.8.8.8` (Active).
- **Live Sitemap**: Verified on [https://jbac.in/sitemap.xml](https://jbac.in/sitemap.xml) (HTTP 200 OK).
- **Live Robots**: Verified on [https://jbac.in/robots.txt](https://jbac.in/robots.txt) (HTTP 200 OK).
- **Live Admin Cockpit**: Verified on [https://jbac.in/admin](https://jbac.in/admin).
- **Live Teacher Portal**: Verified on [https://jbac.in/teacherregister](https://jbac.in/teacherregister) with CloudFront invalidation.

