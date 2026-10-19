const fs = require('fs');
const path = require('path');

const webRoot = 'c:/Users/rajes/Documents/jbac_web';
const mobileRoot = 'C:/Users/rajes/StudioProjects/jbac_app';

console.log('=== Updating Documentation Files ===');

// 1. PROJECT_JOURNAL_AND_EXECUTION_LOG.md
const journalPath = path.join(webRoot, 'PROJECT_JOURNAL_AND_EXECUTION_LOG.md');
if (fs.existsSync(journalPath)) {
  let content = fs.readFileSync(journalPath, 'utf8');
  if (!content.includes('## 14. Multi-User Consecutive Registration Bug Fix')) {
    const addition = `

---

## 14. Multi-User Consecutive Registration Bug Fix & Profile Edit Implementation

### A. The Multi-User Registration Lock Issue
- **Symptom**: When a user registered for one person on any registration form (such as \`/entry\`, \`/namodu\`, or individual role forms like Believer, Student, Pastor), the submission succeeded. However, if the same user attempted to register another person immediately on the same form, filling out all fields and clicking submit showed an error: *"All fields are mandatory"*, even though all visible fields were filled.
- **Root Cause**:
  1. On successful submission, form resets (\`form.reset()\`) cleared field values but left underlying reactive form validation states, touch states, or boolean flags (such as \`submitted = true\`, or unselected terms/checkboxes) in an invalid/un-reset state.
  2. Geographic dropdown arrays (\`constituency\`, \`mandals\`, \`panchayati\`) retained selections from the prior registrant or were cleared without re-enabling default valid states.
  3. Terms and conditions checkboxes (\`term\`) became \`false\` or \`null\` upon \`.reset()\`, failing the \`Validators.requiredTrue\` constraint silently and blocking the second submission.
- **Resolution**:
  - Implemented comprehensive form reset handlers across both web (\`entry.component.ts\`, \`namodu.component.ts\`, \`believerregister.component.ts\`, \`pastorassociationregister.component.ts\`) and mobile app pages.
  - Reset \`this.submitted = false\` upon submission success.
  - Pre-populated/auto-checked terms and conditions (\`term: true\`) upon form reset so consecutive registrations are ready for immediate entry.
  - Reset cascaded geographic arrays cleanly (\`this.constituency = []\`, \`this.mandals = []\`, \`this.panchayati = []\`).

### B. Edit Profile Feature
- Added an **"Edit Profile (ప్రొఫైల్‌ని సవరించండి)"** option in the authenticated user drawer and profile menu matching the user's registered role fields.
- Added session route guards: if a user is authenticated, navigating to "Edit Profile" loads their existing profile data for update; if unauthenticated, they are redirected to login.

---

## 15. Mobile App Registration Unresponsiveness Root Cause & Control Parity Audit

### A. Root Cause of "Church", "Ministry", and "Organization" Unresponsiveness
- **Symptom**: In the mobile app (\`jbac_app\`), when tapping on **"Church"**, **"Ministry"**, or **"Organization"** in the registration list (\`FormsPage\`), the cards were unresponsive.
- **Diagnosis**:
  1. In \`src/pages/church/church.ts\` and \`src/pages/organisation/organisation.ts\`, \`retypepassword\` had been commented out in the \`FormGroup\` constructor (\`this.formBuilder.group\`).
  2. In \`church.ts\` and \`ministry.ts\`, the \`term\` control definition was also omitted from the \`FormGroup\`.
  3. However, the HTML templates (\`church.html\`, \`organisation.html\`, \`ministry.html\`) still declared \`formControlName="retypepassword"\`, \`formControlName="term"\`, and \`form.get('retypepassword').errors\`.
  4. When the user tapped on the card, Angular attempted to instantiate the page. Because the form controls were missing from the \`FormGroup\`, Angular threw runtime exceptions (\`Cannot find control with name: 'term'\` and \`TypeError: Cannot read properties of null (reading 'errors')\`).
  5. The uncaught error aborted the navigation push silently before the view could transition, making the card look completely unresponsive.

### B. Automated Control Parity Audit & Fix
- Developed an automated AST/regex parity audit script (\`scripts/audit_form_controls.cjs\`) scanning all HTML templates against both TypeScript sources and compiled JavaScript bundles (\`www/build/\` and \`platforms/android/.../www/build/\`).
- Verified 100% control parity across all 7 registration pages:
  - **Church** (\`35.js\` / \`church.ts\`): Restored \`retypepassword\` and \`term: [true]\`.
  - **Ministry** (\`21.js\` / \`ministry.ts\`): Restored \`retypepassword\`, \`term: [true]\`, and added the \`r\` getter prototype for \`r['field'].errors\` template bindings.
  - **Organisation** (\`18.js\` / \`organisation.ts\`): Restored \`retypepassword\` and \`term: [true]\`.
  - **Association** (\`38.js\` / \`association.ts\`): Restored \`retypepassword\` and \`term: [true]\`.
  - **Pastor** (\`16.js\` / \`pastor.ts\`): Restored \`retypepassword\` and clean reset.
  - **Believer** (\`37.js\` / \`believer.ts\`): Verified all 38 controls.
  - **Student** (\`12.js\` / \`student.ts\`): Verified all 41 controls.
- Cleaned accidental syntax artifacts across all TypeScript sources.
- Verified JavaScript syntax across all bundles using Node.js \`vm.Script\`.

---

## 16. Google Play Store Release v0.0.33 Packaging (.apk & .aab)

### A. Version Bump & SDK Compliance
- Executed \`scripts/set_version_33.js\` updating:
  - \`config.xml\`: \`version="0.0.33"\`, \`android-versionCode="33"\`, \`android-targetSdkVersion="36"\`.
  - \`platforms/android/app/src/main/res/xml/config.xml\`: Version 33 / SDK 36.
  - \`platforms/android/app/src/main/AndroidManifest.xml\`: \`android:versionCode="33"\`, \`android:versionName="0.0.33"\`.
  - \`platforms/android/app/build.gradle\`: \`targetSdkVersion 36\`, \`compileSdkVersion 34\`, \`minSdkVersion 24\`.

### B. Build Execution & Artifact Verification
- Executed automated build and signing pipeline (\`scripts/build_and_sign_release_v33.ps1\`):
  1. Ran Gradle release compilation: \`assembleRelease\` & \`bundleRelease\`.
  2. Aligned and signed APK with \`Jbac.keystore\` via \`apksigner\` (v2 & v3 signature schemes).
  3. Signed Android App Bundle (\`.aab\`) with \`Jbac.keystore\` via \`jarsigner\` (SHA256withRSA).
  4. Verified APK badging via \`aapt dump badging\`:
     - \`package: name='io.ionic.starterjbac' versionCode='33' versionName='0.0.33'\`
     - \`sdkVersion: '24'\`
     - \`targetSdkVersion: '36'\`
- **Generated Production Release Outputs**:
  - **Play Store Upload Bundle**: \`C:\\Users\\rajes\\StudioProjects\\jbac_app\\appreleasesigned.aab\` *(115.81 MB)*
  - **Direct Device APK**: \`C:\\Users\\rajes\\StudioProjects\\jbac_app\\jbacApp-0.0.33.apk\` *(118.68 MB)*
`;
    fs.writeFileSync(journalPath, content.trim() + addition, 'utf8');
    console.log('[OK] Updated PROJECT_JOURNAL_AND_EXECUTION_LOG.md');
  }
}

// 2. ROADMAP.md in jbac_web
const roadmapPath = path.join(webRoot, 'ROADMAP.md');
if (fs.existsSync(roadmapPath)) {
  let content = fs.readFileSync(roadmapPath, 'utf8');
  if (!content.includes('## 📱 6. Mobile App Navigation Fixes & Google Play Release v0.0.33')) {
    content = content.replace(
      /## 🎯 6\. Pending Launch & Post-Release Tasks[\s\S]*$/,
      `## 📱 6. Mobile App Navigation Fixes & Google Play Release v0.0.33
- [x] **Consecutive Multi-User Registration**:
  - Resolved form validation lock on consecutive registrations across \`/entry\`, \`/namodu\`, and all individual registration forms.
  - Implemented clean form state, touch state, and location array resets.
  - Pre-populated/auto-checked terms and conditions checkbox on form reset.
- [x] **User Profile Management**:
  - Added "Edit Profile" (ప్రొఫైల్‌ని సవరించండి) option to mobile drawer menu and web portal with secure login route guards.
- [x] **Mobile Registration Unresponsiveness Resolution**:
  - Diagnosed unresponsiveness on Church, Ministry, and Organisation cards in \`FormsPage\`.
  - Restored missing \`term\`, \`retypepassword\`, and \`r\` getter in controllers and runtime chunks (\`35.js\`, \`21.js\`, \`18.js\`, \`38.js\`).
  - Automated control parity audit across all 7 registration pages (Church, Ministry, Organisation, Association, Pastor, Believer, Student).
- [x] **Release Packaging & Signing (v0.0.33)**:
  - Bumped version code to \`33\` and semantic version to \`0.0.33\` with \`targetSdkVersion 36\`.
  - Built and signed release APK: \`jbacApp-0.0.33.apk\` (118.68 MB).
  - Built and signed release Android App Bundle: \`jbacApp-0.0.33.aab\` / \`appreleasesigned.aab\` (115.81 MB).

---

## 🎯 7. Pending Launch & Post-Release Tasks
- [ ] Complete Google Play Console Review & Rollout for Release 33.
- [ ] Monitor crash telemetry and user feedback via Google Play Console dashboard.
- [ ] Run automated end-to-end smoke testing across all live production forms on https://jbac.in.
`
    );
    fs.writeFileSync(roadmapPath, content, 'utf8');
    console.log('[OK] Updated ROADMAP.md');
  }
}

// 3. README.md in jbac_web
const webReadmePath = path.join(webRoot, 'README.md');
if (fs.existsSync(webReadmePath)) {
  let content = fs.readFileSync(webReadmePath, 'utf8');
  content = content.replace(/jbacApp-0\.0\.32\.apk\/aab/g, 'jbacApp-0.0.33.apk/aab');
  content = content.replace(/Current Version.*?0\.0\.32/g, 'Current Version: 0.0.33');
  fs.writeFileSync(webReadmePath, content, 'utf8');
  console.log('[OK] Updated jbac_web/README.md');
}

// 4. README.md in jbac_app
const mobileReadmePath = path.join(mobileRoot, 'README.md');
if (fs.existsSync(mobileReadmePath)) {
  let content = fs.readFileSync(mobileReadmePath, 'utf8');
  content = content.replace(/Current Version.*?0\.0\.32/g, 'Current Version: `0.0.33` (`versionCode 33`)');
  content = content.replace(/versionCode.*?32/g, 'versionCode: `33`');
  content = content.replace(/versionName.*?0\.0\.32/g, 'versionName: `0.0.33`');
  content = content.replace(/jbacApp-0\.0\.32/g, 'jbacApp-0.0.33');
  content = content.replace(/Release 32/g, 'Release 33');
  content = content.replace(/v0\.0\.32/g, 'v0.0.33');
  content = content.replace(/build_and_sign_release_v32\.ps1/g, 'build_and_sign_release_v33.ps1');

  if (!content.includes('Church, Ministry, and Organisation Registration Fixes')) {
    content = content.replace(
      /## 🌟 Key Application Features/,
      `## 🌟 Recent Updates (Release 0.0.33)

- **Registration Unresponsiveness Fixed**: Resolved Angular runtime exceptions on Church (\`35.js\`), Ministry (\`21.js\`), and Organisation (\`18.js\`) pages caused by missing \`term\` and \`retypepassword\` form controls.
- **Consecutive Multi-User Registration**: Fixed validation lock that previously blocked consecutive registrations with "all fields mandatory". All form states, touch states, and geographic dropdowns now reset cleanly.
- **Edit Profile**: Added "Edit Profile" (ప్రొఫైల్‌ని సవరించండి) to side drawer menu with session login validation.

---

## 🌟 Key Application Features`
    );
  }

  fs.writeFileSync(mobileReadmePath, content, 'utf8');
  console.log('[OK] Updated jbac_app/README.md');
}

console.log('=== All Documentation Files Successfully Updated! ===');
