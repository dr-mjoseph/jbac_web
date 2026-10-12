const fs = require('fs');
const f1 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/1.js', 'utf8');

const key = 'home.html"*/';
const start = f1.indexOf(key);
if (start !== -1) {
  const contentStart = start + key.length;
  const end = f1.indexOf('/*ion-inline-end', contentStart);
  console.log('Template length in 1.js:', end - contentStart);
  console.log(f1.substring(contentStart, contentStart + 1500));
}
