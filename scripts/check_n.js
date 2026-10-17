const fs = require('fs');
const vendor = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/vendor.js', 'utf8');
const p = vendor.indexOf('/* 24 */');
const nextMod = vendor.indexOf('/* 25 */', p);
const mod24 = vendor.substring(p, nextMod);
for (const key of ['"m"', '"n"']) {
  const idx = mod24.indexOf(key);
  console.log(key, 'definition:', mod24.substring(idx - 50, idx + 150));
}
