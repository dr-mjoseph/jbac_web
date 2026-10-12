const fs = require('fs');
const f1 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/1.js', 'utf8');

console.log('1.js length:', f1.length);

let idx = 0;
while ((idx = f1.indexOf('gotopage', idx)) !== -1) {
  console.log('--- gotopage occurrence at', idx, '---');
  console.log(f1.substring(Math.max(0, idx - 100), Math.min(f1.length, idx + 250)));
  idx += 8;
}
