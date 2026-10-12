const fs = require('fs');
const js = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

const idx = js.indexOf('FamilyCouncellingPage.prototype.loadDoctors');
if (idx !== -1) {
  console.log(js.substring(idx, idx + 1000));
}
