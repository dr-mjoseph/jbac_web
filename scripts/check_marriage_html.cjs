const fs = require('fs');
const p = 'C:/Users/rajes/StudioProjects/jbac_app/src/pages/marriage/marriage.html';
if (fs.existsSync(p)) {
  const html = fs.readFileSync(p, 'utf8');
  console.log('marriage.html length:', html.length);
  console.log(html.substring(0, 1000));
}
