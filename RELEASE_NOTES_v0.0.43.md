# JBAC Release Notes - v0.0.43 (versionCode 43)

**Release Date:** October 24, 2026  
**Build Target:** Android API Level 36 (`targetSdkVersion: 36`, `minSdkVersion: 24`, `compileSdkVersion: 28`)  
**Signing Keystore:** `Jbac.keystore` (Alias: `jbac`, SHA256withRSA)  
**Build Environment:** Java OpenJDK 8 (`jdk-8.0.504.1-hotspot`), Gradle 4.10.3, Android Build Tools 30.0.3  
**Artifacts Produced:**
- `jbacApp-0.0.43.apk` (Production APK signed with v1 JAR + v2 & v3 APK schemes)
- `jbacApp-0.0.43.aab` (Google Play App Bundle signed with `jarsigner`)
- `appreleasesigned.aab` (Play Console Ready Bundle)

---

## 1. Executive Summary

Release `v0.0.43` succeeds previously published release `0.0.42`, upgrading the application to **`versionCode: 43`** with **`targetSdkVersion: 36`** (API Level 36). It resolves the Android package installation failure (`App not installed as package appears to be invalid`), incorporates full dual-layer signing (v1 JAR signature + v2/v3 APK signature schemes), and delivers all 16 bug fixes and strict sequential geographic cascading rules (`State ➔ District ➔ Constituency ➔ Mandal ➔ Panchayat`).

---

## 2. Key Technical Improvements & Problem Resolutions

### A. Resolution for "App not installed as package appears to be invalid"
1. **Version Code Elevation (`versionCode: 43` > `42`)**:
   - Android's PackageInstaller blocks direct APK installation when the version code being installed is lower than an existing installation on the device (`INSTALL_FAILED_VERSION_DOWNGRADE`). Because version `0.0.42` was previously deployed/installed, `0.0.40` was rejected by the system.
   - Incrementing `versionCode` to **`43`** allows seamless update and installation over version `42`.
2. **Dual-Layer Signing (v1 JAR + v2/v3 Scheme Integration)**:
   - To guarantee maximum compatibility across Samsung One UI and modern Android PackageInstallers, the APK is signed with both `jarsigner` (generating `META-INF/MANIFEST.MF`, `META-INF/JBAC.SF`, and `META-INF/JBAC.RSA`) and `apksigner` (applying APK Signature Scheme v2 and v3).
3. **Note on Existing App Signatures**:
   - If a device currently has a version installed directly from the Google Play Store (which uses Google Play App Signing key re-signing) or a debug build (`app-debug.apk`), Android requires uninstalling the previous build once before sideloading the release APK.

### B. Upgraded Target API Level 36 (`targetSdkVersion: 36`)
- Configured `android-targetSdkVersion: 36` in `config.xml`, `platforms/android/gradle.properties` (`cdvTargetSdkVersion=36`), and `AndroidManifest.xml`.
- Verified badging output confirming `targetSdkVersion:'36'`.

### C. Retained Core Bug Fixes & Cascading Features
- Strict sequential geographic cascading enforced everywhere:
  $$\text{State (Andhra Pradesh / Telangana)} \longrightarrow \text{District} \longrightarrow \text{Constituency} \longrightarrow \text{Mandal} \longrightarrow \text{Panchayat}$$
- Camera and gallery upload pickers responsive with native action sheets and `#fileInput` fallbacks.
- Unresponsive card headers in `forms.html` and `account.html` resolved with header tap handlers.
- News category dropdown filtering fixed (`/dashboardapi/getnews`).
- Photo gallery fallbacks added for missing/broken images.
- Infinite profile editing spinner removed.
- Home page banners refreshed (1, 3, 7 replaced; 2, 8 removed).
- Student Home Address State selection enabled.

---

## 3. Version Bump & Badging Summary

| Attribute | Previous (v0.0.42) | Current (v0.0.43) |
| :--- | :--- | :--- |
| **versionCode** | `42` | `43` |
| **versionName** | `0.0.42` | `0.0.43` |
| **minSdkVersion** | `24` (Android 7.0) | `24` (Android 7.0) |
| **targetSdkVersion** | `34` | `36` (Android API Level 36) |
| **compileSdkVersion** | `28` | `28` |
| **Release APK** | `jbacApp-0.0.42.apk` | `jbacApp-0.0.43.apk` (121.28 MB) |
| **Release AAB** | `jbacApp-0.0.42.aab` | `jbacApp-0.0.43.aab` (118.48 MB) |
| **Play Store Bundle** | `appreleasesigned.aab` | `appreleasesigned.aab` (118.48 MB) |

---

## 4. APK Badging Verification (`aapt dump badging`)

```text
package: name='io.ionic.starterjbac' versionCode='43' versionName='0.0.43' platformBuildVersionName='0.0.43' compileSdkVersion='28' compileSdkVersionCodename='9'
sdkVersion:'24'
targetSdkVersion:'36'
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
