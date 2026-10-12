const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const appDir = 'C:/Users/rajes/StudioProjects/jbac_app';
const tempDir = path.join(appDir, 'build_temp');
const zipalign = path.join(appDir, 'zipalign.exe');
const apksigner = 'C:/Users/rajes/AppData/Local/Android/Sdk/build-tools/30.0.3/lib/apksigner.jar';
const keystore = path.join(appDir, 'Jbac.keystore');

const testApk = path.join(tempDir, 'test-update.apk');
const alignedApk = path.join(tempDir, 'test-aligned.apk');
const signedApk = path.join(tempDir, 'test-signed.apk');

console.log('1. Running zipalign...');
execSync(`"${zipalign}" -p -f 4 "${testApk}" "${alignedApk}"`);
console.log('Zipalign finished.');

console.log('2. Running apksigner sign...');
const signCmd = `java -jar "${apksigner}" sign --ks "${keystore}" --ks-pass pass:123456 --ks-key-alias jbac --key-pass pass:123456 --out "${signedApk}" "${alignedApk}"`;
execSync(signCmd);
console.log('Apksigner sign finished.');

console.log('3. Verifying signed apk...');
const verifyOutput = execSync(`java -jar "${apksigner}" verify -v "${signedApk}"`).toString();
console.log('Verify result:');
console.log(verifyOutput.split('\n').filter(l => l.includes('Verif')).join('\n'));
