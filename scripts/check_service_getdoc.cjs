const fs = require('fs');
const s = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/src/providers/service/service.ts', 'utf8');

const idx = s.indexOf('getcouncellingdoctors');
if (idx !== -1) {
  console.log(s.substring(idx - 100, idx + 800));
}
