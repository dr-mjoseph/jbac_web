# JBAC Mobile & Web Application Release Notes (v0.0.38 / versionCode 38)

**Release Date:** October 22, 2026  
**Version:** `0.0.38`  
**Android Version Code:** `38`  
**Target SDK:** `34` (Android 14)  
**Min SDK:** `24` (Android 7.0)  
**Production AAB:** `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.38.aab` (`appreleasesigned.aab`)  
**Test APK:** `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.38.apk`  
**Web Admin Live URL:** [https://jbac.in/admin](https://jbac.in/admin)  

---

## 📋 Google Play Console Submission Snippets

### 1. English (`en-US`) [Under 500 characters]
```text
What's new in version 0.0.38:
• State Selection & Cascading: Easily register under Andhra Pradesh or Telangana with automatic district filtering.
• Registration Forms Fix: Resolved card tap responsiveness; all forms (Believers, Pastors, Churches, Students, Ministries, Organizations) open smoothly.
• Performance & Stability: Enhanced cloud synchronization with AWS, optimized asset loading, and improved overall responsiveness.
```

### 2. Telugu (`te-IN`) [Under 500 characters]
```text
వెర్షన్ 0.0.38 నూతన విశేషాలు:
• రాష్ట్రాల ఎంపిక: ఆంధ్రప్రదేశ్ మరియు తెలంగాణ రాష్ట్రాల వారీగా జిల్లాలు, నియోజకవర్గాల వివరాలతో సులభంగా నమోదు చేసుకునే సదుపాయం.
• రిజిస్ట్రేషన్ ఫారాల పరిష్కారం: కార్డులపై ట్యాప్ చేసినప్పుడు అన్ని ఫారాలు (విశ్వాసి, పాస్టర్, చర్చి, విద్యార్థి మొదలైనవి) వేగంగా, సజావుగా ఓపెన్ అవుతాయి.
• పనితీరు & భద్రత: క్లౌడ్ కనెక్టివిటీ, వేగవంతమైన లోడింగ్ మరియు బగ్ పరిష్కారాలు.
```

### 3. Google Play Console XML Format
```xml
<en-US>
• State Selection & Cascading: Easily register under Andhra Pradesh or Telangana with automatic district filtering.
• Registration Forms Fix: Resolved card tap responsiveness; all forms (Believers, Pastors, Churches, Students, Ministries, Organizations) open smoothly.
• Performance & Stability: Enhanced cloud synchronization with AWS, optimized asset loading, and improved overall responsiveness.
</en-US>
<te-IN>
• రాష్ట్రాల ఎంపిక: ఆంధ్రప్రదేశ్ మరియు తెలంగాణ రాష్ట్రాల వారీగా జిల్లాలు, నియోజకవర్గాల వివరాలతో సులభంగా నమోదు చేసుకునే సదుపాయం.
• రిజిస్ట్రేషన్ ఫారాల పరిష్కారం: కార్డులపై ట్యాప్ చేసినప్పుడు అన్ని ఫారాలు (విశ్వాసి, పాస్టర్, చర్చి, విద్యార్థి మొదలైనవి) వేగంగా, సజావుగా ఓపెన్ అవుతాయి.
• పనితీరు & భద్రత: క్లౌడ్ కనెక్టివిటీ, వేగవంతమైన లోడింగ్ మరియు బగ్ పరిష్కారాలు.
</te-IN>
```

---

## 🚀 Detailed Changelog

### 1. Web Database Cockpit Synchronization (`https://jbac.in/admin`)
- **State-Wise Categorical Navigation**: Deployed the Categorical State View ribbon (`All States`, `Andhra Pradesh`, `Telangana`) with one-click filtering for Believers, Pastors, Churches, Students, Ministries, and Organizations.
- **Table-Level State Dropdown**: Integrated real-time state filtering directly into the dynamic schema table browser, filtering MySQL records on the fly.
- **S3 & CloudFront Cache Refresh**: Synchronized `public.html` (101,933 bytes) across S3 bucket `jbac-web-production-298363284024` (`/admin`, `/admin/index.html`, `/public.html`, `/dashboard/index.html`) and invalidated CloudFront CDN distribution `EOBBU8SU7H3BI`.

### 2. Google Play Console Version Code Conflict Resolution
- **Version Bump**: Resolved the upload error (*"Version code 37 has already been used. Try another version code."*) by incrementing `versionCode` to `38` and `version` to `0.0.38`.
- **Synchronized Manifests**: Updated `config.xml`, `package.json`, and `platforms/android/app/src/main/AndroidManifest.xml`.
- **Signed Artifacts**: Built and signed both release APK (`jbacApp-0.0.38.apk`, 118.7 MB) and release AAB (`jbacApp-0.0.38.aab` / `appreleasesigned.aab`, 115.84 MB) using the official `Jbac.keystore`.

### 3. Mobile Registration Form Tap Navigation
- **Webpack String Literal Syntax Remediation**: Sanitized raw newlines across all compiled JavaScript chunks (`main.js`, `12.js` to `41.js`) ensuring that `eval()` and JavaScript template execution never throw unhandled syntax errors.
- **Touch Responsiveness**: Added explicit `tappable` attributes and verified click handlers on all card elements in `forms.html` (`namodu.html`).
- **Zero BOM & Clean Code Verification**: Verified with automated Python bytecode and AST validation test suite.
