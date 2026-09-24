/**
 * Sync Engine: Synchronizes Web App changes (jbac_web) to Android Mobile App (jbac_app).
 * Usage: node scripts/sync-to-mobile.js [--mobile-path ../jbac_app] [--push] [--no-build]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WEB_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(WEB_ROOT, 'dist', 'churchwebsite');

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
console.log('  Web-to-Mobile Synchronization Engine');
console.log('====================================================');

// 1. Resolve Mobile App Path
let mobilePath = customMobilePath;
if (!mobilePath) {
  // Check common sibling paths
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
    if (fs.existsSync(p) && (fs.existsSync(path.join(p, 'config.xml')) || fs.existsSync(path.join(p, 'ionic.config.json')) || fs.existsSync(path.join(p, 'capacitor.config.json')))) {
      mobilePath = p;
      break;
    }
  }
}

// If mobile directory is still not found, clone into temporary or sibling directory
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

// 2. Build Web App (if enabled)
if (shouldBuild) {
  console.log('\n[1/4] Building Web App production bundle...');
  try {
    execSync('npm run build -- --configuration production', { cwd: WEB_ROOT, stdio: 'inherit' });
  } catch (err) {
    console.error('[ERROR] Angular build failed. Aborting sync.');
    process.exit(1);
  }
} else {
  console.log('\n[1/4] Skipping build as --no-build was passed.');
}

if (!fs.existsSync(DIST_DIR)) {
  console.error(`[ERROR] Build output directory not found at ${DIST_DIR}`);
  process.exit(1);
}

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

// 3. Ensure mobile repository .gitignore tracks www/
console.log('\n[2/5] Checking mobile repository .gitignore...');
const mobileGitignore = path.join(mobilePath, '.gitignore');
if (fs.existsSync(mobileGitignore)) {
  let gitignoreContent = fs.readFileSync(mobileGitignore, 'utf8');
  // Remove /www or www or www/ lines
  const original = gitignoreContent;
  gitignoreContent = gitignoreContent
    .split('\n')
    .filter(line => !/^\s*\/?www\/?\s*$/.test(line))
    .join('\n');
  if (!gitignoreContent.includes('!www/**')) {
    gitignoreContent += '\n# Ensure compiled web app distribution is tracked for mobile build\n!www/**\n!www\n';
  }
  if (gitignoreContent !== original) {
    fs.writeFileSync(mobileGitignore, gitignoreContent, 'utf8');
    console.log('  -> Updated mobile .gitignore to ensure www/ is tracked by Git.');
  }
}

// 4. Sync Compiled Web Distribution to Mobile www/
console.log('\n[3/5] Syncing compiled web assets to mobile app www/ ...');
const mobileWww = path.join(mobilePath, 'www');
if (!fs.existsSync(mobileWww)) {
  fs.mkdirSync(mobileWww, { recursive: true });
} else {
  // Clean old root hashed bundle files to prevent accumulation
  for (const item of fs.readdirSync(mobileWww)) {
    const itemPath = path.join(mobileWww, item);
    if (fs.statSync(itemPath).isFile() && (item.endsWith('.js') || item.endsWith('.css') || item.endsWith('.txt'))) {
      fs.unlinkSync(itemPath);
    }
  }
}
copyRecursiveSync(DIST_DIR, mobileWww);
console.log(`  -> Synced dist/churchwebsite to ${mobileWww}`);

// Post-process mobile www/index.html for Cordova / Capacitor relative asset loading
const mobileIndexHtml = path.join(mobileWww, 'index.html');
if (fs.existsSync(mobileIndexHtml)) {
  let html = fs.readFileSync(mobileIndexHtml, 'utf8');
  // Ensure relative base href for WebView
  if (html.includes('<base href="/"')) {
    html = html.replace('<base href="/"', '<base href="./"');
  } else if (!html.includes('<base href=')) {
    html = html.replace(/<head>/i, '<head>\n  <base href="./">');
  }
  // Inject cordova.js if not already present so Cordova plugins (camera, statusbar, splashscreen) work
  if (!html.includes('cordova.js')) {
    if (html.includes('</body>')) {
      html = html.replace('</body>', '  <script src="cordova.js"></script>\n</body>');
    } else {
      html += '\n<script src="cordova.js"></script>';
    }
  }
  fs.writeFileSync(mobileIndexHtml, html, 'utf8');
  console.log('  -> Post-processed mobile www/index.html (set base-href="./", injected cordova.js)');
}

// 5. Sync Modern Web Source Code to Mobile web-src/
console.log('\n[4/5] Mirroring modern Angular web source code to mobile app web-src/ ...');
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

This folder (\`web-src/\`) contains the synchronized Angular 15 source components and environment configurations from \`jbac_web\`.

- **Live Compiled Distribution**: Available in \`www/\` (packaged into the mobile APK/AAB).
- **Automated Sync**: Every update in \`jbac_web\` is automatically built and mirrored here.
`;
fs.writeFileSync(path.join(mobileWebSrc, 'README.md'), webSrcReadme, 'utf8');
console.log(`  -> Synced modern Angular components and configs to ${mobileWebSrc}`);

// Also sync shared assets
const webAssets = path.join(WEB_ROOT, 'src', 'assets');
const mobileAssets = path.join(mobilePath, 'src', 'assets');
if (fs.existsSync(webAssets) && fs.existsSync(path.join(mobilePath, 'src'))) {
  copyRecursiveSync(webAssets, mobileAssets);
  console.log(`  -> Synced assets to ${mobileAssets}`);
}

// 6. Ensure mobile native addmeetings page and permissions are patched
const patchScript = path.join(WEB_ROOT, 'scripts', 'apply_all_patches.ps1');
if (fs.existsSync(patchScript)) {
  try {
    console.log('\n[PATCH] Ensuring mobile addmeetings page and location permissions are patched...');
    execSync(`powershell -ExecutionPolicy Bypass -File "${patchScript}"`, { stdio: 'inherit' });
  } catch (err) {
    console.warn('[WARN] Could not run patch script automatically:', err.message);
  }
}

// 7. Update Sync Metadata
const syncMeta = {
  lastSyncedAt: new Date().toISOString(),
  syncedFromRepo: 'jbac_web',
  webVersion: require('../package.json').version || '1.0.0'
};
fs.writeFileSync(path.join(mobilePath, 'sync-metadata.json'), JSON.stringify(syncMeta, null, 2));

console.log('\n[5/5] Synchronization complete!');
console.log(`  Last synced timestamp: ${syncMeta.lastSyncedAt}`);

// 7. Optional Git Commit & Push
if (shouldPush) {
  console.log('\n[GIT] Committing and pushing synchronized changes to mobile repository...');
  try {
    execSync('git add -f www/', { cwd: mobilePath, stdio: 'inherit' });
    execSync('git add -A', { cwd: mobilePath, stdio: 'inherit' });
    const status = execSync('git status --porcelain', { cwd: mobilePath }).toString();
    if (status.trim().length > 0) {
      execSync(`git commit -m "chore(sync): automated update from web app (${new Date().toISOString()})"`, { cwd: mobilePath, stdio: 'inherit' });
      
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
            execSync('git add -f www/', { cwd: mobilePath, stdio: 'inherit' });
            execSync('git add -A', { cwd: mobilePath, stdio: 'inherit' });
            execSync(`git commit -m "chore(sync): automated update from web app (${new Date().toISOString()})"`, { cwd: mobilePath, stdio: 'inherit' });
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
    console.error('[WARNING] Git push failed:', err.message);
  }
}

console.log('\n====================================================');
console.log('  Web-to-Mobile Sync Finished Successfully!');
console.log('====================================================');
