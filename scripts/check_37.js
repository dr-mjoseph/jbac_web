const fs = require('fs');
const c37 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/37.js', 'utf8');
const p = c37.indexOf('IonicPageModule');
console.log('Around IonicPageModule in 37.js:');
console.log(c37.substring(p - 150, p + 150));
// Let's check the start of this module 417
const m417 = c37.indexOf('417:');
console.log('Module 417 text:');
console.log(c37.substring(m417, m417 + 800));
