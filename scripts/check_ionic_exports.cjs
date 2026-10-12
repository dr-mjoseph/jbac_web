const fs = require('fs');

const content = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/vendor.js', 'utf8');
const idx = content.indexOf('/* 24 */');
const endIdx = content.indexOf('/* 25 */', idx);
const mod24 = content.slice(idx, endIdx);

const targets = ['NavController', 'NavParams', 'AlertController', 'ToastController', 'LoadingController', 'IonicPageModule'];

targets.forEach(name => {
  const re = new RegExp('__webpack_require__\\.d\\(__webpack_exports__,\\s*["\']([^"\']+)["\'],[\\s\\S]*?' + name, 'g');
  const match = re.exec(mod24);
  console.log(name, '=>', match ? match[1] : 'NOT FOUND');
});

// Also print all exports in mod24
console.log('--- ALL EXPORTS IN 24 ---');
const expRe = /__webpack_require__\.d\(__webpack_exports__,\s*["']([^"']+)["'],\s*function\(\)\s*\{\s*return\s*([^;]+);/g;
let m;
const exportMap = {};
while ((m = expRe.exec(mod24)) !== null) {
  exportMap[m[1]] = m[2];
}
console.log(JSON.stringify(exportMap, null, 2));
