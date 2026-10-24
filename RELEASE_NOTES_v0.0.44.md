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

## Critical Fix: Android 12+ Package Parse Failure (`INSTALL_PARSE_FAILED_MANIFEST_MALFORMED`)

### 1. Root Cause Analysis
- **Problem**: When attempting to install the release APK on Android 12, 13, 14, 15, or 16 (including Samsung One UI devices), the Android PackageInstaller aborted with:
  > **"App not installed as package appears to be invalid."**
- **Cause**: Starting with Android 12 (API 31), any application component (`<activity>`, `<service>`, `<receiver>`) containing an `<intent-filter>` **must explicitly declare `android:exported="true"` or `android:exported="false"`**.
- In earlier releases targeting API >= 31, `MainActivity` had `<intent-filter>` (for `android.intent.action.MAIN` and `android.intent.category.LAUNCHER`) without an explicit `android:exported` attribute. The Android OS `PackageParser` threw `INSTALL_PARSE_FAILED_MANIFEST_MALFORMED`, which Samsung One UI displays as "package appears to be invalid".
- Additionally, strict dual-layer signing (`v1` JAR signature + `v2` APK signature block) was enforced with `--min-sdk-version 23` during signing, ensuring compatibility with all Android device package managers.

### 2. Applied Fixes
- Added `android:exported="true"` to `MainActivity` in `AndroidManifest.xml` and `config.xml`.
- Bumped `versionCode` to `44` and `versionName` to `0.0.44` (strictly higher than published `0.0.42` and `0.0.43`).
- Ensured `targetSdkVersion` is strictly `36` (`cdvTargetSdkVersion=36`).
- Enforced dual v1 (JAR) and v2/v3 (APK) signature verification using `apksigner sign --min-sdk-version 23 --max-sdk-version 36 --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true`.

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
- **Signed APK**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.44.apk` (124.48 MB)
- **Signed AAB**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.44.aab` (121.58 MB)
- **Google Play AAB**: `C:\Users\rajes\StudioProjects\jbac_app\appreleasesigned.aab` (121.58 MB)
