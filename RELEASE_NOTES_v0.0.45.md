# Release Notes - JBAC Mobile App v0.0.45

## Release Metadata
- **Version Name**: `0.0.45`
- **Version Code**: `45`
- **Target SDK Version**: `36` (Android 16 / Baklava, API Level 36)
- **Minimum SDK Version**: `24` (Android 7.0 Nougat)
- **Compile SDK Version**: `28` / `36`
- **Keystore**: `Jbac.keystore` (Alias: `jbac`, SHA256withRSA)
- **Signature Schemes**: Dual v1 (JAR signing) + v2 (APK Signature Scheme v2) + v3 enabled

---

## Critical Update in v0.0.45

### Removal of `READ_MEDIA_IMAGES` & Google Play Permission Policy Compliance
- **Root Cause**: Google Play's Photo and Video Permissions policy restricts `READ_MEDIA_IMAGES` strictly to dedicated photo/gallery management applications. For all other apps where users pick photos for uploads, Google requires using the system photo picker without requesting `READ_MEDIA_IMAGES`.
- **Solution**:
  - Removed `<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />` from both `AndroidManifest.xml` and `config.xml`.
  - Upgraded release to `versionCode: 45` and `versionName: 0.0.45`.
  - Photo uploading, brochure attachments, and camera capture continue to work seamlessly via the native file chooser (`<input type="file" accept="image/*">`) and Android system picker without requiring any sensitive media permissions.
  - Resolves the Play Console blocking error: *"All developers requesting access to the photo and video permissions are required to tell Google Play about the core functionality of their app"*.

---

## Verification Results

### APK Verification (`jbacApp-0.0.45.apk`)
```text
Verifies:                                 true
Verified using v1 scheme (JAR signing):   true
Verified using v2 scheme (APK v2):        true
Verified using v3 scheme (APK v3):        true
Signer DN:                                CN=hi, OU=test, O=testt, L=rjy, ST=ap, C=ap
Signer SHA-256 Digest:                   e26050ec000224dc89e44b256f662d4075af042221caf283e32685524ffd729d
Target SDK:                               36
Version Code:                             45
Version Name:                             0.0.45
```

### AAB Verification (`jbacApp-0.0.45.aab` / `appreleasesigned.aab`)
```text
jar verified.
Signer:                                   CN=hi, OU=test, O=testt, L=rjy, ST=ap, C=ap
Signature Algorithm:                      SHA256withRSA
Digest Algorithm:                         SHA-256
```

---

## Artifact File Locations
- **Signed APK**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.45.apk`
- **Signed AAB**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.45.aab`
- **Google Play AAB**: `C:\Users\rajes\StudioProjects\jbac_app\appreleasesigned.aab`
