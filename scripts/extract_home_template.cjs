const fs = require('fs');

const s = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/1.js', 'utf8');

const startMarker = 'template:/*ion-inline-start:"C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\home\\home.html"*/\'';
let startIdx = s.indexOf(startMarker);
if (startIdx === -1) {
  startIdx = s.indexOf('template:');
}
const endMarker = '/*ion-inline-end:"C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\home\\home.html"*/';
const endIdx = s.indexOf(endMarker);

const tpl = s.slice(startIdx, endIdx);
fs.writeFileSync('scripts/extracted_home_tpl.html', tpl);
console.log('Saved extracted_home_tpl.html, length:', tpl.length);
