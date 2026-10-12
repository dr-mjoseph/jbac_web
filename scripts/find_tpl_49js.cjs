const fs = require('fs');
const js = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

let idx = 0;
while ((idx = js.indexOf('template', idx)) !== -1) {
  console.log('template occurrence at', idx);
  console.log(js.substring(Math.max(0, idx - 40), Math.min(js.length, idx + 250)));
  console.log('---');
  idx += 8;
}
