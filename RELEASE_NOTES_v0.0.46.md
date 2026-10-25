# Release Notes - JBAC Mobile App & Web Platform v0.0.46

## Release Metadata
- **Version Name**: `0.0.46`
- **Version Code**: `46`
- **Target SDK Version**: `36` (Android 16 / Baklava, API Level 36)
- **Minimum SDK Version**: `24` (Android 7.0 Nougat)
- **Compile SDK Version**: `36` / `28`
- **Keystore**: `Jbac.keystore` (Alias: `jbac`, SHA256withRSA)
- **Signature Schemes**: Dual v1 (JAR signing) + v2 (APK Signature Scheme v2) + v3 enabled
- **Play Console Bundle**: `appreleasesigned.aab` / `jbacApp-0.0.46.aab`
- **Direct Install APK**: `jbacApp-0.0.46.apk`

---

## Key Features & Bug Fixes in v0.0.46

### 1. Strict Sequential Geographic Filtering for Activation Form (`EntryFormPage`)
- **Ordering Enforced**: `1. State ➔ 2. District ➔ 3. Constituency ➔ 4. Mandal ➔ 5. Panchayat`.
- **Sequential Disabling**:
  - `District` is strictly disabled until `State` is selected.
  - `Constituency` is strictly disabled until `District` is selected.
  - `Mandal` is strictly disabled until `Constituency` is selected.
  - `Panchayat` is strictly disabled until `Mandal` is selected.
- **Downstream Reset**: Changing any parent dropdown resets downstream controls and collections to prevent mismatched data.
- **Header & Navigation**: Replaced overlapping layout with standard `<ion-buttons start>` back arrow and centered `<ion-title>`.
- **Form Data Preservation**: Resolved `poorp()` alert method that was clearing user inputs prematurely.

### 2. User Edit Profile: State Selection & Sequential Filtering Everywhere
- **Unified State Support Across All Categories** (`ProfilePage` in mobile app & `UpdateComponent` in web):
  - Believer Form (`beliverform`)
  - Student Form (`studentform` - College and Residential Address)
  - Ministry Form (`ministryform` / `updateprofileministry`)
  - Pastor Form (`pastorform`)
  - Church Form (`churchregsiterform`)
  - Independent Organisation Form (`independentorgainsationform`)
  - Pastors Association Form (`pastorsassociations`)
  - Entry Form (`entryform`)
- **Non-Destructive Pre-Population**: `geteditdtails()` automatically derives and sets `state_id`, fetches matching districts, and patches existing location IDs cleanly without wiping saved selections.

### 3. Mobile Compatibility: Smooth & Instant Go-Back Navigation
- **Click-Block Overlay Fix**: Addressed Ionic 3 click-block timer (`.click-block-active`) that was covering the top navbar for 330ms after select/modal dismissals. Set `top: 56px !important`, `z-index: 999`, and `pointer-events: none !important`.
- **Navbar Elevation**: Raised `ion-header`, `ion-navbar`, and `.toolbar` to `z-index: 100000 !important` with `pointer-events: auto`.
- **Touch Area Optimization**: Configured `.back-button` to min 48x48px with `touch-action: manipulation !important` and `z-index: 100001` for instantaneous digitizer responsiveness.
- **Title Hitbox Shielding**: Added `pointer-events: none` to the toolbar title container so centered titles do not obstruct the back arrow touch bounding box.
- **Hardware Back Button Handler**: Registered `platform.registerBackButtonAction()` to cleanly close open menus, dismiss active alerts/modals, and pop navigation views down to `HomePage`.

### 4. Android 16 (API Level 36) Compliance & Security
- `targetSdkVersion` set to `36`.
- Verified zero requests for `READ_MEDIA_IMAGES` (maintaining full Google Play Photos & Videos policy compliance).
- Dual signed with v1, v2, and v3 schemes.

---

## Artifact File Locations
- **Signed APK**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.46.apk`
- **Signed AAB**: `C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.46.aab`
- **Google Play AAB**: `C:\Users\rajes\StudioProjects\jbac_app\appreleasesigned.aab`
