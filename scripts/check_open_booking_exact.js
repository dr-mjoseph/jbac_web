const fs = require('fs');
const f49 = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\49.js';
const c = fs.readFileSync(f49, 'utf8');
const idx = c.indexOf('openBookingForm = function');
console.log(JSON.stringify(c.substring(idx - 10, idx + 180)));
