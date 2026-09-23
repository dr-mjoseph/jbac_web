/**
 * Sync Engine: Synchronizes Web App changes (final_jan30th) to Android Mobile App (jbscapp_new).
 * Usage: node scripts/sync-to-mobile.js [--mobile-path ../jbscapp_new] [--push] [--no-build]
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
const repoUrl = getArg('--repo', 'https://github.com/mjosephp7-dot/jbscapp_new.git');

console.log('====================================================');
console.log('  Web-to-Mobile Synchronization Engine');
console.log('====================================================');

// 1. Resolve Mobile App Path
let mobilePath = customMobilePath;
if (!mobilePath) {
  // Check common sibling paths
  const possiblePaths = [
    path.resolve(WEB_ROOT, '..', 'jbscapp_new'),
    path.resolve(WEB_ROOT, 'mobile'),
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
  const targetDir = path.resolve(WEB_ROOT, '..', 'jbscapp_new');
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

// 3. Sync Compiled Web Distribution to Mobile www/
console.log('\n[2/4] Syncing compiled web assets to mobile app www/ ...');
const mobileWww = path.join(mobilePath, 'www');
if (!fs.existsSync(mobileWww)) fs.mkdirSync(mobileWww, { recursive: true });
copyRecursiveSync(DIST_DIR, mobileWww);
console.log(`  -> Synced dist/churchwebsite to ${mobileWww}`);

// 4. Sync Shared Assets (Images, Icons, Banners)
console.log('\n[3/4] Syncing shared media and banner assets...');
const webAssets = path.join(WEB_ROOT, 'src', 'assets');
const mobileAssets = path.join(mobilePath, 'src', 'assets');
if (fs.existsSync(webAssets) && fs.existsSync(path.join(mobilePath, 'src'))) {
  copyRecursiveSync(webAssets, mobileAssets);
  console.log(`  -> Synced assets to ${mobileAssets}`);
}

// 5. Update Sync Metadata
const syncMeta = {
  lastSyncedAt: new Date().toISOString(),
  syncedFromRepo: 'final_jan30th',
  webVersion: require('../package.json').version || '1.0.0'
};
fs.writeFileSync(path.join(mobilePath, 'sync-metadata.json'), JSON.stringify(syncMeta, null, 2));

console.log('\n[4/4] Synchronization complete!');
console.log(`  Last synced timestamp: ${syncMeta.lastSyncedAt}`);

// 6. Optional Git Commit & Push
if (shouldPush) {
  console.log('\n[GIT] Committing and pushing synchronized changes to mobile repository...');
  try {
    execSync('git add -A', { cwd: mobilePath, stdio: 'inherit' });
    const status = execSync('git status --porcelain', { cwd: mobilePath }).toString();
    if (status.trim().length > 0) {
      execSync(`git commit -m "chore(sync): automated update from web app (${new Date().toISOString()})"`, { cwd: mobilePath, stdio: 'inherit' });
      execSync('git push origin main', { cwd: mobilePath, stdio: 'inherit' });
      console.log('[SUCCESS] Successfully committed and pushed updates to mobile repository!');
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
