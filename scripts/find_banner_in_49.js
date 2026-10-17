const fs = require('fs');
const f49 = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\49.js';
const c = fs.readFileSync(f49, 'utf8');
const idx = c.indexOf('మీరు డాక్టరా');
if (idx !== -1) {
    console.log(c.substring(Math.max(0, idx - 100), Math.min(c.length, idx + 400)));
} else {
    console.log('Not found "మీరు డాక్టరా"');
}
