const fs = require('fs');

// 1. config.xml
const configPath = 'C:/Users/rajes/StudioProjects/jbac_app/config.xml';
let config = fs.readFileSync(configPath, 'utf8');
config = config.replace(/version="[0-9.]+"\s+android-versionCode="[0-9]+"/, 'version="0.0.35" android-versionCode="35"');
fs.writeFileSync(configPath, config, 'utf8');
console.log('Updated config.xml to 0.0.35 / 35');

// 2. package.json
const pkgPath = 'C:/Users/rajes/StudioProjects/jbac_app/package.json';
let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = '0.0.35';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
console.log('Updated package.json to 0.0.35');

// 3. AndroidManifest.xml
const manifestPath = 'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/AndroidManifest.xml';
let manifest = fs.readFileSync(manifestPath, 'utf8');
manifest = manifest.replace(/android:versionCode="[0-9]+"/, 'android:versionCode="35"');
manifest = manifest.replace(/android:versionName="[0-9.]+"/, 'android:versionName="0.0.35"');
fs.writeFileSync(manifestPath, manifest, 'utf8');
console.log('Updated AndroidManifest.xml to 0.0.35 / 35');
