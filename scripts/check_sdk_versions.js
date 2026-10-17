const fs = require('fs');

const configXml = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/config.xml', 'utf8');
console.log('config.xml widget tag:');
console.log(configXml.match(/<widget[^>]+>/)?.[0]);
console.log('config.xml preferences:');
console.log(configXml.match(/<preference name="android-minSdkVersion"[^>]+>/)?.[0]);
console.log(configXml.match(/<preference name="android-targetSdkVersion"[^>]+>/)?.[0]);

const appGradle = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/build.gradle', 'utf8');
console.log('\napp/build.gradle sdk info:');
const pDef = appGradle.indexOf('defaultConfig {');
console.log(appGradle.substring(pDef, pDef + 300));

const manifest = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/AndroidManifest.xml', 'utf8');
console.log('\nAndroidManifest.xml manifest tag:');
console.log(manifest.match(/<manifest[^>]+>/)?.[0]);
console.log('uses-sdk tag:');
console.log(manifest.match(/<uses-sdk[^>]+>/)?.[0]);
