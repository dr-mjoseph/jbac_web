# JBAC Release Notes - v0.0.39 (versionCode 39)

**Release Date:** October 22, 2026  
**Build Target:** Android (API Level 30+, targetSdkVersion 30)  
**Keystore:** `Jbac.keystore` (Alias: `jbac`, SHA256withRSA)  
**Artifacts Produced:**
- `jbacApp-0.0.39.apk` (Production APK signed with v1 + v2 schemes)
- `jbacApp-0.0.39.aab` (Google Play App Bundle signed with jarsigner)
- `appreleasesigned.aab` (Play Console Ready Bundle)

---

## 1. Executive Summary

Release `v0.0.39` resolves an issue where the **Ministry**, **Church**, and **Organization** registration forms failed to open upon tapping their respective cards on `FormsPage` (`రిజిస్ట్రేషన్`). The issue was caused by missing/commented-out ReactiveForm controls in the component form builders while their templates retained active `formControlName` bindings, leading to uncaught Angular runtime exceptions during component view instantiation.

All three registration forms have been updated and synchronized across both source files (`src/pages/`) and runtime chunks (`www/build/`).

---

## 2. Detailed Bug Fixes & Improvements

### A. Ministry Registration Form (`MinistryPage`)
- **Files Modified:** `src/pages/ministry/ministry.ts`, `www/build/21.js`
- **Root Cause:**
  - `retypepassword` was commented out in `this.ministryform`.
  - `term` checkbox control was missing from `this.ministryform`.
  - The template evaluated `r['...'].errors` (e.g. `r['firstname'].errors`), but the getter for `r` was missing on `MinistryPage`, leading to a fatal `TypeError` during change detection.
  - A syntax typo (`term: [true],],`) existed in the source TypeScript file.
- **Resolution:**
  - Added `retypepassword: ['', [Validators.required, Validators.minLength(6)]]` and `term: [true]` to `ministryform`.
  - Implemented `Object.defineProperty(MinistryPage.prototype, "r", { get: () => this.ministryform ? this.ministryform.controls : {} })`.
  - Cleaned up syntax typo and added `this.submitted = true` to `postministrysignup`.

### B. Church Registration Form (`ChurchPage`)
- **Files Modified:** `src/pages/church/church.ts`, `www/build/35.js`
- **Root Cause:**
  - `retypepassword` was commented out in `this.form`.
  - `term` control was missing from `this.form`.
  - Template contained `formControlName="retypepassword"` and `formControlName="term"`, which caused Angular `ReactiveFormsModule` to throw `Cannot find control with name: 'retypepassword'`.
- **Resolution:**
  - Restored `retypepassword` and `term: [true]` in `this.form`.
  - Cleaned up syntax typo and added `this.submitted = true` to `postchurchregister`.

### C. Organization Registration Form (`OrganisationPage`)
- **Files Modified:** `src/pages/organisation/organisation.ts`, `www/build/18.js`
- **Root Cause:**
  - `retypepassword` was commented out in `this.form`, causing Angular to throw `Cannot find control with name: 'retypepassword'`.
- **Resolution:**
  - Restored `retypepassword: ['', [Validators.required, Validators.minLength(6)]]` to `this.form`.
  - Initialized `term: [true]` so the agreement checkbox defaults to checked and valid.

---

## 3. Version Bump & Badging Summary

| Attribute | Previous (v0.0.38) | Current (v0.0.39) |
| :--- | :--- | :--- |
| **versionCode** | `38` | `39` |
| **versionName** | `0.0.38` | `0.0.39` |
| **config.xml** | `0.0.38` / `38` | `0.0.39` / `39` |
| **package.json** | `0.0.38` | `0.0.39` |
| **AndroidManifest.xml** | `0.0.38` / `38` | `0.0.39` / `39` |
| **Target SDK Version** | `30` | `30` |

---

## 4. Verification & Testing Checklist

- [x] `node -c www/build/21.js` passed (0 syntax errors).
- [x] `node -c www/build/35.js` passed (0 syntax errors).
- [x] `node -c www/build/18.js` passed (0 syntax errors).
- [x] `assets/www/build/` synced into `platforms/android/app/src/main/assets/`.
- [x] No raw byte terminators (CR/LF) in Webpack template string literals.
- [x] APK signed with `apksigner` (v1 + v2 signatures valid).
- [x] AAB signed with `jarsigner` (Play Console ready).
- [x] All 15 runtime chunks verified clean inside the final packaged release.
