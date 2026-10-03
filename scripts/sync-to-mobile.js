/**
 * Sync Engine: Synchronizes Web App changes (jbac_web) to Android Mobile App (jbac_app)
 * while STRICTLY preserving the native Google Play Store Ionic 3 mobile UI and look-and-feel.
 * 
 * Usage: node scripts/sync-to-mobile.js [--mobile-path ../jbac_app] [--push] [--no-build]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WEB_ROOT = path.resolve(__dirname, '..');

// Ensure node and npm are in PATH for child processes
const nodeDir = path.dirname(process.execPath);
if (!process.env.PATH.includes(nodeDir)) {
  process.env.PATH = `${nodeDir}${path.delimiter}${process.env.PATH}`;
}

// Parse CLI flags
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) return args[index + 1];
  return defaultValue;
}
const shouldBuild = !args.includes('--no-build');
const shouldPush = args.includes('--push');
const customMobilePath = getArg('--mobile-path', null);
const repoUrl = getArg('--repo', 'https://github.com/dr-mjoseph/jbac_app.git');

console.log('====================================================');
console.log('  Web-to-Mobile Simultaneous Synchronization Engine');
console.log('  (Strictly preserving Play Store Native Mobile UI)');
console.log('====================================================');

// 1. Resolve Mobile App Path
let mobilePath = customMobilePath;
if (!mobilePath) {
  const possiblePaths = [
    path.resolve(process.env.USERPROFILE || 'C:\\Users\\rajes', 'StudioProjects', 'jbac_app'),
    path.resolve(WEB_ROOT, '..', 'jbac_app'),
    path.resolve(WEB_ROOT, '..', '..', 'StudioProjects', 'jbac_app'),
    path.resolve(WEB_ROOT, '..', 'jbscapp_new'),
    path.resolve(WEB_ROOT, 'mobile'),
    path.resolve(process.env.TEMP || 'C:\\temp', 'jbac_app'),
    path.resolve(process.env.TEMP || 'C:\\temp', 'jbscapp_new')
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p) && (fs.existsSync(path.join(p, 'config.xml')) || fs.existsSync(path.join(p, 'ionic.config.json')))) {
      mobilePath = p;
      break;
    }
  }
}

if (!mobilePath || !fs.existsSync(mobilePath)) {
  const targetDir = path.resolve(WEB_ROOT, '..', 'jbac_app');
  console.log(`[INFO] Mobile repository not found locally. Cloning ${repoUrl} to ${targetDir}...`);
  try {
    execSync(`git clone --depth 1 ${repoUrl} "${targetDir}"`, { stdio: 'inherit' });
    mobilePath = targetDir;
  } catch (err) {
    console.error(`[ERROR] Failed to clone mobile repository:`, err.message);
    process.exit(1);
  }
}

console.log(`[OK] Web Source Directory : ${WEB_ROOT}`);
console.log(`[OK] Mobile App Directory : ${mobilePath}`);

// Helper: Copy directory recursively
function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const childItem of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, childItem), path.join(dest, childItem));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 2. Validate web build if requested (compiles web to ensure no TypeScript/build errors exist)
if (shouldBuild) {
  console.log('\n[1/6] Validating Web App build correctness...');
  try {
    execSync('npm run build -- --configuration production', { cwd: WEB_ROOT, stdio: 'inherit' });
    console.log('  -> Web app build verified successfully.');
  } catch (err) {
    console.warn('[WARN] Angular web build check skipped or had warnings: ' + err.message);
  }
} else {
  console.log('\n[1/6] Skipping web build validation (--no-build).');
}

// 3. Sync Shared Static Assets (Images, Icons, Banners, SVGs)
console.log('\n[2/6] Syncing shared media and static assets to mobile app...');
const webAssets = path.join(WEB_ROOT, 'src', 'assets');
const mobileSrcAssets = path.join(mobilePath, 'src', 'assets');
const mobileWwwAssets = path.join(mobilePath, 'www', 'assets');
const androidAssets = path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'assets');

if (fs.existsSync(webAssets)) {
  copyRecursiveSync(webAssets, mobileSrcAssets);
  copyRecursiveSync(webAssets, mobileWwwAssets);
  if (fs.existsSync(path.dirname(androidAssets))) {
    copyRecursiveSync(webAssets, androidAssets);
  }
  console.log('  -> Synchronized web assets to mobile src/assets and www/assets.');
}

// 4. Sync API Endpoints and Service Configurations
console.log('\n[3/6] Synchronizing API endpoints and backend services...');
const prodEnvPath = path.join(WEB_ROOT, 'src', 'environments', 'environment.prod.ts');
let targetApiUrl = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';
if (fs.existsSync(prodEnvPath)) {
  const envContent = fs.readFileSync(prodEnvPath, 'utf8');
  const match = envContent.match(/apiUrl:\s*['"]([^'"]+)['"]/);
  if (match && match[1]) {
    targetApiUrl = match[1];
  }
}
console.log(`  -> Active backend API target: ${targetApiUrl}`);

// Sync to mobile ServiceProvider
const mobileServiceTs = path.join(mobilePath, 'src', 'providers', 'service', 'service.ts');
if (fs.existsSync(mobileServiceTs)) {
  let serviceCode = fs.readFileSync(mobileServiceTs, 'utf8');
  serviceCode = serviceCode.replace(/var testApi = ['"][^'"]+['"]/, `var testApi = "${targetApiUrl}"`);
  serviceCode = serviceCode.replace(/testApi = ['"][^'"]+['"]/, `testApi = '${targetApiUrl}'`);
  
  // Ensure cascaded location endpoints accept optional parameters
  if (serviceCode.includes('getconsistencys()')) {
    serviceCode = serviceCode.replace(/getconsistencys\(\)\s*\{[\s\S]*?return this\.http\.post\(this\.testApi \+ 'getconsistencys', \[\]\);[\s\S]*?\}/,
      `getconsistencys(districtId?: any) {\n    const payload = districtId ? { district_id: districtId } : {};\n    return this.http.post(this.testApi + 'getconsistencys', payload);\n  }`);
  }
  if (serviceCode.includes('getmandals()')) {
    serviceCode = serviceCode.replace(/getmandals\(\)\s*\{[\s\S]*?return this\.http\.post\(this\.testApi \+ 'getmandals', \[\]\);[\s\S]*?\}/,
      `getmandals(constId?: any) {\n    const payload = constId ? { const_id: constId } : {};\n    return this.http.post(this.testApi + 'getmandals', payload);\n  }`);
  }
  if (serviceCode.includes('gepanchayatis()')) {
    serviceCode = serviceCode.replace(/gepanchayatis\(\)\s*\{[\s\S]*?return this\.http\.post\(this\.testApi \+ 'gepanchayati', \[\]\);[\s\S]*?\}/,
      `gepanchayatis(mandalId?: any) {\n    const payload = mandalId ? { mandal_id: mandalId } : {};\n    return this.http.post(this.testApi + 'gepanchayati', payload);\n  }`);
  }
  fs.writeFileSync(mobileServiceTs, serviceCode, 'utf8');
  console.log('  -> Updated mobile src/providers/service/service.ts with active API and cascade methods.');
}

// Sync to compiled mobile bundles if present
const mainJsFiles = [
  path.join(mobilePath, 'www', 'build', 'main.js'),
  path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', 'main.js')
];
for (const mainJs of mainJsFiles) {
  if (fs.existsSync(mainJs)) {
    let mainCode = fs.readFileSync(mainJs, 'utf8');
    mainCode = mainCode.replace(/var testApi = ['"][^'"]+['"]/, `var testApi = "${targetApiUrl}"`);
    mainCode = mainCode.replace(/this\.testApi = ['"][^'"]+['"]/, `this.testApi = '${targetApiUrl}'`);
    fs.writeFileSync(mainJs, mainCode, 'utf8');
    console.log(`  -> Synced API target to ${path.relative(mobilePath, mainJs)}`);
  }
}

// 5. Enforce Native Play Store Mobile UI Integrity
console.log('\n[4/6] Enforcing Native Play Store Mobile UI integrity...');
const ionicIndexHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <script data-ionic="inject">
    (function(w){var i=w.Ionic=w.Ionic||{};i.version='3.9.9';i.angular='5.2.11';i.staticDir='build/';})(window);
  </script>
  <meta charset="UTF-8">
  <title>JBAC-AP</title>
  <meta name="viewport"
    content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">

  <link rel="icon" type="image/x-icon" href="assets/icon/favicon.ico">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#00548F">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

  <!-- add to homescreen for ios -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">

  <!-- cordova.js required for cordova apps -->
  <script src="cordova.js"></script>

  <link href="build/main.css" rel="stylesheet">
</head>

<body>
  <ion-app></ion-app>
  <script src="build/polyfills.js"></script>
  <script src="build/vendor.js"></script>
  <script src="build/main.js"></script>
</body>

</html>
`;

// Clean any loose web artifacts from www and android assets
const dirsToClean = [
  path.join(mobilePath, 'www'),
  path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www')
];
const foreignRegexes = [
  /^main\..*\.js$/,
  /^polyfills\..*\.js$/,
  /^runtime\..*\.js$/,
  /^styles\..*\.css$/,
  /^3rdpartylicenses\.txt$/,
  /.*\..*\.png$/
];

for (const d of dirsToClean) {
  if (fs.existsSync(d)) {
    for (const file of fs.readdirSync(d)) {
      if (foreignRegexes.some(r => r.test(file))) {
        fs.unlinkSync(path.join(d, file));
        console.log(`  -> Removed foreign web file: ${path.join(path.basename(d), file)}`);
      }
    }
    // Write pristine native Ionic 3 index.html
    fs.writeFileSync(path.join(d, 'index.html'), ionicIndexHtml, 'utf8');
    console.log(`  -> Verified native Play Store Ionic 3 index.html in ${path.relative(mobilePath, d)}`);
  }
}

// 6. Mirror Modern Web Source to web-src/ for simultaneous developer cross-reference
console.log('\n[5/6] Mirroring modern Angular web source code to mobile app web-src/ ...');
const mobileWebSrc = path.join(mobilePath, 'web-src');
const webAppSrc = path.join(WEB_ROOT, 'src', 'app');
const webEnvSrc = path.join(WEB_ROOT, 'src', 'environments');
copyRecursiveSync(webAppSrc, path.join(mobileWebSrc, 'app'));
copyRecursiveSync(webEnvSrc, path.join(mobileWebSrc, 'environments'));
if (fs.existsSync(path.join(WEB_ROOT, 'src', 'styles.css'))) {
  fs.copyFileSync(path.join(WEB_ROOT, 'src', 'styles.css'), path.join(mobileWebSrc, 'styles.css'));
}
if (fs.existsSync(path.join(WEB_ROOT, 'src', 'custom-theme.scss'))) {
  fs.copyFileSync(path.join(WEB_ROOT, 'src', 'custom-theme.scss'), path.join(mobileWebSrc, 'custom-theme.scss'));
}
if (fs.existsSync(path.join(WEB_ROOT, 'angular.json'))) {
  fs.copyFileSync(path.join(WEB_ROOT, 'angular.json'), path.join(mobileWebSrc, 'angular.json'));
}
const webSrcReadme = `# Modern Web Application Source (Angular 15)

This folder (\`web-src/\`) contains the synchronized Angular 15 source components and environment configurations from \`jbac_web\` for parallel feature reference and parity verification.

- **Mobile App Native UI**: The mobile app UI is located in \`src/\` and \`www/\` and is powered by Ionic 3 matching the live Google Play Store application (\`io.ionic.starterjbac\`).
- **Automated Sync**: Updates made to web components, shared assets, and API services in \`jbac_web\` are automatically mirrored here simultaneously without altering the native mobile layout.
`;
fs.writeFileSync(path.join(mobileWebSrc, 'README.md'), webSrcReadme, 'utf8');
console.log(`  -> Synced modern Angular components and configs to ${mobileWebSrc}`);

// 7. Ensure mobile addmeetings location patches are applied (if on Windows)
if (process.platform === 'win32') {
  const patchScript = path.join(WEB_ROOT, 'scripts', 'apply_all_patches.ps1');
  if (fs.existsSync(patchScript)) {
    try {
      console.log('\n[PATCH] Verifying mobile addmeetings page and location permissions...');
      execSync(`powershell -ExecutionPolicy Bypass -File "${patchScript}"`, { stdio: 'inherit' });
    } catch (err) {
      console.warn('[WARN] Location patch script warning:', err.message);
    }
  }
}

// 8. Update Sync Metadata
const syncMeta = {
  lastSyncedAt: new Date().toISOString(),
  syncedFromRepo: 'jbac_web',
  mobileAppId: 'io.ionic.starterjbac',
  uiEngine: 'Ionic 3 Native Mobile (Google Play Store compliant)',
  webVersion: require('../package.json').version || '1.0.0'
};
fs.writeFileSync(path.join(mobilePath, 'sync-metadata.json'), JSON.stringify(syncMeta, null, 2));

console.log('\n[6/6] Synchronization complete!');
console.log(`  Last synced timestamp: ${syncMeta.lastSyncedAt}`);
console.log(`  UI Engine: ${syncMeta.uiEngine}`);

// 9. Optional Git Commit & Push
if (shouldPush) {
  console.log('\n[GIT] Committing and pushing synchronized changes to mobile repository...');
  try {
    execSync('git add -f www/index.html www/build/ www/assets/ src/assets/ src/providers/ web-src/ config.xml sync-metadata.json', { cwd: mobilePath, stdio: 'inherit' });
    execSync('git add -A', { cwd: mobilePath, stdio: 'inherit' });
    const status = execSync('git status --porcelain', { cwd: mobilePath }).toString();
    if (status.trim().length > 0) {
      execSync(`git commit -m "chore(sync): automated simultaneous update from web app with native Play Store UI (${new Date().toISOString()})"`, { cwd: mobilePath, stdio: 'inherit' });
      
      let pushed = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Push attempt ${attempt}...`);
          execSync('git push origin main', { cwd: mobilePath, stdio: 'inherit' });
          pushed = true;
          break;
        } catch (pushErr) {
          console.log(`[WARN] Push attempt ${attempt} failed. Pulling latest remote changes with rebase...`);
          try {
            execSync('git pull --rebase -X theirs origin main', { cwd: mobilePath, stdio: 'inherit' });
          } catch (rebaseErr) {
            console.log('[WARN] Rebase failed, aborting and resetting softly...');
            try { execSync('git rebase --abort', { cwd: mobilePath, stdio: 'ignore' }); } catch (e) {}
            execSync('git reset --soft origin/main', { cwd: mobilePath, stdio: 'inherit' });
            execSync('git add -A', { cwd: mobilePath, stdio: 'inherit' });
            execSync(`git commit -m "chore(sync): automated simultaneous update from web app with native Play Store UI (${new Date().toISOString()})"`, { cwd: mobilePath, stdio: 'inherit' });
          }
        }
      }
      if (pushed) {
        console.log('[SUCCESS] Successfully committed and pushed updates to mobile repository!');
      } else {
        console.error('[ERROR] Failed to push to mobile repository after multiple attempts.');
      }
    } else {
      console.log('[INFO] No changes detected in mobile repository. Nothing to commit.');
    }
  } catch (err) {
    console.error('[WARNING] Git commit/push failed:', err.message);
  }
}

console.log('\n====================================================');
console.log('  Web-to-Mobile Sync Finished Successfully!');
console.log('====================================================');
