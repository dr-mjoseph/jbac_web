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

## 🛠️ Verification & Validation
- **AAPT Badging**:
  ```
  package: name='io.ionic.starterjbac' versionCode='51' versionName='0.0.51'
  targetSdkVersion:'36'
  ```
- **Database Column**:
  ```sql
  ALTER TABLE teacher_reg ADD COLUMN about_achievements TEXT DEFAULT NULL;
  ```
- **Live Portal**: Verified on [https://jbac.in/teacherregister](https://jbac.in/teacherregister) with CloudFront invalidation.

