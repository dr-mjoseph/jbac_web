# Release Notes - JBAC Mobile & Web Application v0.0.52

**Release Date:** November 10, 2026  
**Build Target:** Android API Level 36 (Android 15+ / Vanilla Ice Cream)  
**Version Code:** `52`  
**Version Name:** `0.0.52`  
**Platform Parity:** Web Portal (`jbac.in`) & Hybrid Mobile App (`jbac_app`)

---

## 🚀 Key Updates & Enhancements in v0.0.52

### 1. New Field: "WhatsApp Number" (వాట్సాప్ నంబర్) in Teacher Registration
- **Web (`jbac_web`)**:
  - Added dedicated WhatsApp number input field directly beside the Mobile Number field in `src/app/jesus/teacherregister/teacherregister.component.html`.
  - Reorganized the Personal Details contact row into 3 responsive columns:
    1. **Mobile Number (మొబైల్ నంబర్)** (`col-md-4`) - Mandatory 10-digit primary mobile contact.
    2. **WhatsApp Number (వాట్సాప్ నంబర్)** (`col-md-4`) - 10-digit WhatsApp contact with numeric-only input enforcement and validation.
    3. **Email Address (ఈమెయిల్ చిరునామా)** (`col-md-4`) - Email address contact.
  - Added reactive form control `whatsapp` with validation `/^[0-9]{10}$/` and `numericOnly($event)` keystroke filter in `teacherregister.component.ts`.
  - Displayed WhatsApp contact badge (`💬 WA: <number>`) in the Admin Faculty Directory Console modal (`backend/admin_db.html`, `public.html`).
- **Mobile (`jbac_app`)**:
  - Added dedicated `<ion-item>` with stacked label: `వాట్సాప్ నంబర్ (WhatsApp Number)` directly beside/below Mobile Number in `src/pages/teacher/teacher.html`.
  - Added form control `whatsapp` in `src/pages/teacher/teacher.ts` with validation and inclusion in `payload` to `service.registerTeacher(payload)`.
- **Database Schema (`teacher_reg`)**:
  - Executed migration adding persistent column to the live AWS RDS MySQL 8.4 database:
    ```sql
    ALTER TABLE `teacher_reg` ADD COLUMN `whatsapp` varchar(25) DEFAULT NULL AFTER `mobile`;
    ```
  - Verified column schema: `whatsapp varchar(25) NULL`.
- **Backend REST API (`AWS Lambda: jbac-backend-api`)**:
  - Enhanced `POST /dashboardapi/teacher-register` and `/api/teacher-register` in `backend/server.ts` & `backend/server.js` to extract `whatsapp` (`b.whatsapp || b.whatsapp_number || b.whatsappno`) and persist it into the database.
  - Successfully packaged into `backend/backend-deploy.zip` and deployed to AWS Lambda (`jbac-backend-api`, revision `cce5c369-0dcb-4001-89c4-865c96db5820`).

---

## 📦 Signed Mobile Release Deliverables

- **Signed Release APK**: `jbacApp-0.0.52.apk` (130,466,900 bytes, dual v2 + v3 signed, zipalign 4-byte aligned).
- **Signed Release AAB**: `jbacApp-0.0.52.aab` (127,504,700 bytes, signed with production keystore `Jbac.keystore`).
- **Google Play Bundle**: `appreleasesigned.aab` (verified with `aapt dump badging`, targetSdkVersion 36, versionCode 52).

---

## 🛠️ Verification & Validation
- **AAPT Badging**:
  ```text
  package: name='io.ionic.starterjbac' versionCode='52' versionName='0.0.52' platformBuildVersionName='0.0.52' compileSdkVersion='28' compileSdkVersionCodename='9'
  targetSdkVersion:'36'
  uses-permission: name='android.permission.INTERNET'
  uses-permission: name='android.permission.CAMERA'
  uses-permission: name='android.permission.READ_EXTERNAL_STORAGE' maxSdkVersion='32'
  uses-permission: name='android.permission.WRITE_EXTERNAL_STORAGE' maxSdkVersion='32'
  uses-permission: name='android.permission.ACCESS_COARSE_LOCATION'
  uses-permission: name='android.permission.ACCESS_FINE_LOCATION'
  ```
- **APK Verification**:
  ```text
  Verified using v2 scheme (APK Signature Scheme v2): true
  Verified using v3 scheme (APK Signature Scheme v3): true
  ```
- **AAB Verification**:
  ```text
  jar verified.
  ```
- **Production Web Deployment**:
  - Live at `https://jbac.in/teacherregister`
  - CloudFront Distribution: `EOBBU8SU7H3BI` (Invalidation `IBAVD5M7HS95ODRXYYP5VLNN57`)
