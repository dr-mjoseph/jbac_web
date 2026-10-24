# JBAC Release Notes - v0.0.40 (versionCode 40)

**Release Date:** October 24, 2026  
**Build Target:** Android 14.0 (API Level 34, `targetSdkVersion: 34`, `minSdkVersion: 24`, `compileSdkVersion: 28`)  
**Signing Keystore:** `Jbac.keystore` (Alias: `jbac`, SHA256withRSA)  
**Build Environment:** Java OpenJDK 8 (`jdk-8.0.504.1-hotspot`), Gradle 4.10.3, Android Build Tools 30.0.3  
**Artifacts Produced:**
- `jbacApp-0.0.40.apk` (Production APK signed with APK Signature Scheme v2 + v3)
- `jbacApp-0.0.40.aab` (Google Play App Bundle signed with `jarsigner`)
- `appreleasesigned.aab` (Play Console Ready Bundle)

---

## 1. Executive Summary

Release `v0.0.40` is a comprehensive mobile stability and feature parity release addressing all 16 user-reported issues across the JBAC Android application. Key enhancements include fixing non-responsive camera and gallery photo upload dialogs, resolving card header tap bubbling across registration and service directories, restoring broken news category dropdowns, adding state selection with strict sequential cascading (`State ➔ District ➔ Constituency ➔ Mandal ➔ Panchayat`) across all search, filter, and registration workflows, fixing continuous buffering on profile photo editing, refreshing home page banners, and generating official signed release `.apk` and `.aab` packages for distribution and Google Play deployment.

---

## 2. Detailed Bug Fixes & Technical Implementations

### 1. Strict Geographic Cascading Everywhere (`State ➔ District ➔ Constituency ➔ Mandal ➔ Panchayat`)
- **Rule Enforced**:
  $$\text{State (Andhra Pradesh / Telangana)} \longrightarrow \text{District} \longrightarrow \text{Constituency} \longrightarrow \text{Mandal} \longrightarrow \text{Panchayat / Village}$$
- Downstream dropdowns are strictly disabled using `[disabled]="!form.get('...').value"` (or component model checks) until their immediate parent has a selected value.
- Changing any parent immediately clears and resets all downstream selections and options.
- Applied consistently across:
  - Search filters: `events`, `church-timings`, `searchorganisation`, `institute`, `searchhouse`, `pastor`.
  - Registration forms: `addmeetings`, `addinstitute`, `addbussiness`, `addjobs`, `addmarriage`, `addattacks`, `ministry`, `student`, `account`.

### 2. Submit Meetings (`addmeetings`)
- **Camera/Gallery Picker**: Resolved non-responsiveness on Android 13+ (API 33+) by bypassing deprecated permission checks and attaching a hidden `#meetingFileInput` (`(change)="onFileSelected($event)"`) fallback triggered via ActionSheet.
- **Meeting Address**: Added **"Select State"** (`రాష్ట్రం / State`) dropdown with Telangana (`1`) and Andhra Pradesh (`2`) options, connected to full sequential cascading logic.

### 3. View News (`news-view`)
- **Category Dropdown**: Resolved issue where selecting news categories did not display news items. Corrected endpoint URL to `/dashboardapi/getnews`, added category filtering logic, and guarded `item.description` against null references during rendering.

### 4. Submit News (`news`)
- **News Image Upload**: Fixed gallery/camera ActionSheet options freezing by removing restrictive roles and attaching a hidden `#newsFileInput` fallback. Corrected asset icon casing (`assets/icon/upload.svg`).

### 5. Photo Gallery (`gallery`, `sub-gallery`)
- **Image Display Fix**: Resolved broken image rendering by introducing `(error)="onImgError($event, gt)"` fallback listeners pointing to bundled local assets (`assets/images/meet-fig*.png`) whenever remote URLs are inaccessible or blocked.

### 6. Church Timings Filter (`church-timings`)
- Added **"Select State"** option allowing filtering by **Telangana** and **Andhra Pradesh** with sequential cascading dropdowns for districts, mandals, and churches.

### 7. Church Permission & About Navigation (`churchgo`)
- **YouTube Link**: Configured official channel URL: `https://www.youtube.com/channel/UCnk2hURhesjDM7SuOxgmt5A/about`.
- **Navigation & Layout**: Added an `<ion-header>` with back and home navigation buttons, replaced broken local anchor tags `<a href="/about">` with Angular navigation `gotoAbout()`, and added fallback handlers for `rc1.jpg` and `rc2.jpg`.

### 8. Christian Organizations & For Help
- **Christian Organizations** (`institute`, `searchorganisation`): Added "Select State" filter with cascading district and mandal selectors.
- **For Help** (`help`): Fixed camera/gallery photo upload picker by removing blocking ActionSheet roles and adding `#helpFileInput` fallback.

### 9. Other Services Registration (`account.html`)
- **Add Church Timings** (`addchurchtimings`): Added "Select State" and strict cascading location selectors.
- **Add Ministry Related Institutes** (`addinstitute`): Fixed form non-responsiveness caused by constructor `this.form.reset()`. Added hidden file picker `#instituteFileInput` and sequential cascading.
- **Add Meetings** (`addmeetings`): Fixed poster upload picker, added "Select State", and enforced sequential cascading.
- **Add Business Information** (`addbussiness`): Fixed non-responsiveness on tap (removed constructor reset), added `#businessFileInput` and sequential cascading.
- **Register for Marriages** (`addmarriage`): Fixed non-responsiveness on tap (removed constructor reset) and enforced strict location cascading.
- **Add Job Needs** (`addjobs`): Fixed non-responsiveness on tap (removed constructor reset), added `#jobFileInput` and sequential cascading.
- **Add Information of News/Ads** (`addads`): Fixed non-responsiveness on tap (removed constructor reset) and added `#adsFileInput`.

### 10. Register of Attacks (`addattacks`)
- Added **"Select State"** field, removed constructor reset, added hidden `#attackFileInput` image upload fallback, and enabled strict location cascading.

### 11. Profile Photo & Edit Buffering (`profile`)
- **Infinite Buffering Resolution**: Removed blocking, unclosed `LoadingController` spinner (`ప్రాసెస్ అవుతుంది దయచేసి ఆగండి`) inside `gepanchayati()`, allowing users to seamlessly edit their profile information without infinite loading freezes.

### 12. Home Page Banners Carousel
- Replaced banners **1**, **3**, and **7** with refreshed image assets (`Banner01.png`, `Banner03.png`, `Banner07.png`).
- Deleted obsolete banners **2** and **8** (`Banner02.png`, `Banner08.png`) from slider data arrays and asset directories.

### 13. Student Registration Form (`student`)
- Added **"Select State"** for the **Home Address** section mirroring the College Address section.
- Implemented isolated `resDistricts` data binding and `onResStateChange()` handler with strict cascading hierarchy.

### 14. Ministry Registration Form (`ministry`)
- Fixed tap responsiveness in `forms.html` by adding `tappable (click)="gotopage(X)"` to card headers.
- Fixed template validation syntax typo `r['headnmber']?.errors?.['maxlength']` and enforced strict cascading location dropdowns.

### 15. Mobile Compatibility & Card Header Responsiveness
- Fixed event bubbling across `forms.html` and `account.html` card grids by binding tap handlers directly to `<ion-card-header>` elements as well as `<ion-card>`, ensuring 100% reliable opening on all Android screen sizes and touch digitizers.

---

## 3. Version Bump & Badging Summary

| Attribute | Previous (v0.0.39) | Current (v0.0.40) |
| :--- | :--- | :--- |
| **versionCode** | `39` | `40` |
| **versionName** | `0.0.39` | `0.0.40` |
| **minSdkVersion** | `24` (Android 7.0) | `24` (Android 7.0) |
| **targetSdkVersion** | `34` (Android 14) | `34` (Android 14) |
| **APK File** | `jbacApp-0.0.39.apk` | `jbacApp-0.0.40.apk` (121.2 MB) |
| **AAB File** | `jbacApp-0.0.39.aab` | `jbacApp-0.0.40.aab` (118.5 MB) |
| **Play Store Bundle** | `appreleasesigned.aab` | `appreleasesigned.aab` (118.5 MB) |

---

## 4. APK Badging Verification (`aapt dump badging`)

```text
package: name='io.ionic.starterjbac' versionCode='40' versionName='0.0.40' platformBuildVersionName='0.0.40' compileSdkVersion='28' compileSdkVersionCodename='9'
sdkVersion:'24'
targetSdkVersion:'34'
```

---

## 5. Signature Verification Details

### APK Signature (`apksigner verify --verbose`)
```text
Verifies
Verified using v1 scheme (JAR signing): false
Verified using v2 scheme (APK Signature Scheme v2): true
Verified using v3 scheme (APK Signature Scheme v3): true
Signer #1 certificate DN: CN=hi, OU=test, O=testt, L=rjy, ST=ap, C=ap
Signer #1 certificate SHA-256 digest: e26050ec000224dc89e44b256f662d4075af042221caf283e32685524ffd729d
Signer #1 key algorithm: RSA (2048 bits)
```

### AAB Signature (`jarsigner -verify`)
```text
jar verified.
Algorithm: SHA256withRSA
Key size: 2048 bits
Signed with: Jbac.keystore (alias jbac)
```
