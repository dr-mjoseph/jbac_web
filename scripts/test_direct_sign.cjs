const { execSync } = require('child_process');
const path = require('path');

const appDir = 'C:/Users/rajes/StudioProjects/jbac_app';
const apksigner = 'C:/Users/rajes/AppData/Local/Android/Sdk/build-tools/30.0.3/lib/apksigner.jar';
const keystore = path.join(appDir, 'Jbac.keystore');
const testApk = path.join(appDir, 'build_temp/test-update.apk');
const signedApk = path.join(appDir, 'build_temp/test-signed-direct.apk');

const signCmd = `java -jar "${apksigner}" sign --ks "${keystore}" --ks-pass pass:123456 --ks-key-alias jbac --key-pass pass:123456 --out "${signedApk}" "${testApk}"`;
console.log('Signing...');
execSync(signCmd);
console.log('Signed successfully!');

const verify = execSync(`java -jar "${apksigner}" verify -v "${signedApk}"`).toString();
console.log('Verify:');
console.log(verify.split('\n').filter(l => l.includes('Verif')).join('\n'));
