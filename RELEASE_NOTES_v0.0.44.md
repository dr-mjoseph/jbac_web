# Release Notes - JBAC Mobile App v0.0.44

## Release Metadata
- **Version Name**: `0.0.44`
- **Version Code**: `44`
- **Target SDK Version**: `36` (Android 16 / Baklava, API Level 36)
- **Minimum SDK Version**: `24` (Android 7.0 Nougat)
- **Compile SDK Version**: `28` / `36`
- **Keystore**: `Jbac.keystore` (Alias: `jbac`, SHA256withRSA)
- **Signature Schemes**: Dual v1 (JAR signing) + v2 (APK Signature Scheme v2) + v3 enabled

---

## Key Updates & Bug Fixes in v0.0.44

### 1. Unified Native File & Camera Upload Container (`div.imgerdt`)
- **Root Cause**: In legacy Ionic 3, standard `<input type="file">` and action buttons placed inside `<ion-item>` had their UI collapsed and hidden by Ionic's `.item-inner` flex container. Furthermore, programmatic file input triggering from asynchronous ActionSheet callbacks was blocked by Chromium WebView security.
- **Solution**: Replaced `<ion-item>` wrappers with a dedicated `<div class="imgerdt">` container featuring a visible, styled native file chooser (`<input type="file" accept="image/*">`), an outline Camera/Gallery button (`openphoto()`), and an instant preview thumbnail.
- **Pages Updated**:
  - `Submit Institutes`: [`addinstitute.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/addinstitute/addinstitute.html)
  - `Submit Your Business`: [`addbussiness.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/addbussiness/addbussiness.html)
  - `Submit for Marriages`: [`addmarriage.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/addmarriage/addmarriage.html)
  - `For Jobs`: [`addjobs.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/addjobs/addjobs.html)
  - `For Adds`: [`addads.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/addads/addads.html)
  - `Submit Meeting Poster`: [`addmeetings.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/addmeetings/addmeetings.html)
  - `Record News`: [`news.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/news/news.html)
  - `For Our Help`: [`help.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/help/help.html)

### 2. Strict Sequential Geographic Cascading
- Enforced strict state selection prerequisite: District, Constituency, Mandal, and Panchayat dropdowns remain disabled (`[disabled]`) until a State is chosen.
- Selecting a state or changing an upstream filter clears and resets all downstream selections.
- **Pages Updated**:
  - `Marriage Services`: [`marriage.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/marriage/marriage.html) & [`marriage.ts`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/marriage/marriage.ts)
  - `View Meetings`: [`meeting.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/meeting/meeting.html) & [`meeting.ts`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/meeting/meeting.ts)
  - `Christian Services`: [`institute.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/institute/institute.html) & [`institute.ts`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/institute/institute.ts)
  - `Jobs`: [`jobs.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/jobs/jobs.html) & [`jobs.ts`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/jobs/jobs.ts)
  - `Search Business/Rent`: [`searchhouse.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/searchhouse/searchhouse.html) & [`searchhouse.ts`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/searchhouse/searchhouse.ts)

### 3. About Me YouTube Channel Link
- Added dedicated YouTube card with a red subscribe button and direct external link to:
  `https://www.youtube.com/@DrJOSEPHPRAKASHMOSIGANTI7/featured` via `window.open(..., '_system')`.
- **Files**: [`about.html`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/about/about.html) & [`about.ts`](file:///C:/Users/rajes/StudioProjects/jbac_app/src/pages/about/about.ts)

### 4. Android 12+ Manifest & Dual-Layer Signing
- Added `android:exported="true"` to `MainActivity` in `AndroidManifest.xml` and `config.xml` preventing `INSTALL_PARSE_FAILED_MANIFEST_MALFORMED`.
- Enforced dual v1 (JAR signing) + v2/v3 (APK signing) with `--min-sdk-version 23 --max-sdk-version 36`.

---

## Verification Results

### APK Verification (`jbacApp-0.0.44.apk`)
```text
Verifies:                                 true
Verified using v1 scheme (JAR signing):   true
Verified using v2 scheme (APK v2):        true
Verified using v3 scheme (APK v3):        true
Signer DN:                                CN=hi, OU=test, O=testt, L=rjy, ST=ap, C=ap
Signer SHA-256 Digest:                   e26050ec000224dc89e44b256f662d4075af042221caf283e32685524ffd729d
Target SDK:                               36
Version Code:                             44
Version Name:                             0.0.44
```

### AAB Verification (`jbacApp-0.0.44.aab` / `appreleasesigned.aab`)
```text
jar verified.
Signer:                                   CN=hi, OU=test, O=testt, L=rjy, ST=ap, C=ap
Signature Algorithm:                      SHA256withRSA
Digest Algorithm:                         SHA-256
```

---

## Artifact File Locations
- **Signed APK**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.44.apk`
- **Signed AAB**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.44.aab`
- **Google Play AAB**: `C:\Users\rajes\StudioProjects\jbac_app\appreleasesigned.aab`
