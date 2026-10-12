const fs = require('fs');
const main = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/main.js', 'utf8');
const key = 'app.html"*/';
const start = main.indexOf(key);
if (start !== -1) {
  const contentStart = start + key.length;
  const end = main.indexOf('/*ion-inline-end', contentStart);
  console.log(main.substring(contentStart, end));
}
