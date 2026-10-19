const fs = require('fs');
const path = require('path');

const appRoot = 'C:/Users/rajes/StudioProjects/jbac_app';
console.log('=== Updating version to 33 (0.0.33) and targetSdkVersion 36 ===');

// 1. config.xml
const configXmlPath = path.join(appRoot, 'config.xml');
let configXml = fs.readFileSync(configXmlPath, 'utf8');
configXml = configXml.replace(/version="[0-9.]+"/g, 'version="0.0.33"');
configXml = configXml.replace(/android-versionCode="[0-9]+"/g, 'android-versionCode="33"');
configXml = configXml.replace(/<preference name="android-minSdkVersion" value="[0-9]+" \/>/g, '<preference name="android-minSdkVersion" value="24" />');
configXml = configXml.replace(/<preference name="android-targetSdkVersion" value="[0-9]+" \/>/g, '<preference name="android-targetSdkVersion" value="36" />');
configXml = configXml.replace(/<preference name="android-compileSdkVersion" value="[0-9]+" \/>/g, '<preference name="android-compileSdkVersion" value="34" />');
fs.writeFileSync(configXmlPath, configXml, 'utf8');
console.log('[OK] Updated config.xml');

// 2. platforms/android/app/src/main/res/xml/config.xml
const resXmlPath = path.join(appRoot, 'platforms/android/app/src/main/res/xml/config.xml');
if (fs.existsSync(resXmlPath)) {
  let resXml = fs.readFileSync(resXmlPath, 'utf8');
  resXml = resXml.replace(/version="[0-9.]+"/g, 'version="0.0.33"');
  resXml = resXml.replace(/android-versionCode="[0-9]+"/g, 'android-versionCode="33"');
  resXml = resXml.replace(/<preference name="android-minSdkVersion" value="[0-9]+" \/>/g, '<preference name="android-minSdkVersion" value="24" />');
  resXml = resXml.replace(/<preference name="android-targetSdkVersion" value="[0-9]+" \/>/g, '<preference name="android-targetSdkVersion" value="36" />');
  resXml = resXml.replace(/<preference name="android-compileSdkVersion" value="[0-9]+" \/>/g, '<preference name="android-compileSdkVersion" value="34" />');
  fs.writeFileSync(resXmlPath, resXml, 'utf8');
  console.log('[OK] Updated res/xml/config.xml');
}

// 3. AndroidManifest.xml
const manifestPath = path.join(appRoot, 'platforms/android/app/src/main/AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  manifest = manifest.replace(/android:versionCode="[0-9]+"/g, 'android:versionCode="33"');
  manifest = manifest.replace(/android:versionName="[^"]+"/g, 'android:versionName="0.0.33"');
  fs.writeFileSync(manifestPath, manifest, 'utf8');
  console.log('[OK] Updated AndroidManifest.xml to versionCode 33, versionName 0.0.33');
}

// 4. cdv-gradle-config.json
const cdvConfigPath = path.join(appRoot, 'platforms/android/cdv-gradle-config.json');
if (fs.existsSync(cdvConfigPath)) {
  const cdv = JSON.parse(fs.readFileSync(cdvConfigPath, 'utf8'));
  cdv.MIN_SDK_VERSION = 24;
  cdv.SDK_VERSION = 34;
  cdv.BUILD_TOOLS_VERSION = "30.0.3";
  fs.writeFileSync(cdvConfigPath, JSON.stringify(cdv, null, 4), 'utf8');
  console.log('[OK] Updated cdv-gradle-config.json');
}

// 5. app/build.gradle
const appGradlePath = path.join(appRoot, 'platforms/android/app/build.gradle');
if (fs.existsSync(appGradlePath)) {
  let bg = fs.readFileSync(appGradlePath, 'utf8');
  bg = bg.replace(/minSdkVersion\s+[0-9]+/g, 'minSdkVersion 24');
  bg = bg.replace(/targetSdkVersion\s+[0-9]+/g, 'targetSdkVersion 36');
  bg = bg.replace(/targetSdkVersion\s+cordovaConfig\.SDK_VERSION/g, 'targetSdkVersion 36');
  bg = bg.replace(/compileSdkVersion\s+[0-9]+/g, 'compileSdkVersion 34');
  fs.writeFileSync(appGradlePath, bg, 'utf8');
  console.log('[OK] Updated app/build.gradle to minSdkVersion 24, targetSdkVersion 36, compileSdkVersion 34');
}

// 6. CordovaLib/build.gradle
const libGradlePath = path.join(appRoot, 'platforms/android/CordovaLib/build.gradle');
if (fs.existsSync(libGradlePath)) {
  let lbg = fs.readFileSync(libGradlePath, 'utf8');
  lbg = lbg.replace(/minSdkVersion\s+[0-9]+/g, 'minSdkVersion 24');
  lbg = lbg.replace(/compileSdkVersion\s+[0-9]+/g, 'compileSdkVersion 34');
  fs.writeFileSync(libGradlePath, lbg, 'utf8');
  console.log('[OK] Updated CordovaLib/build.gradle');
}

console.log('=== Version 33 (0.0.33) Set Successfully! ===');
