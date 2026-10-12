const fs = require('fs');
const js = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

const key = 'family-councelling.html"*/';
const start = js.indexOf(key);
if (start !== -1) {
  const contentStart = start + key.length;
  const end = js.indexOf('/*ion-inline-end', contentStart);
  console.log('Template length in 49.js:', end - contentStart);
  const tpl = js.substring(contentStart, end);
  console.log('Template preview:\n', tpl.substring(0, 1000));
} else {
  console.log('family-councelling.html not found in 49.js');
}
