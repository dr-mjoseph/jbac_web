const fs = require('fs');
const f49 = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\49.js';
const c = fs.readFileSync(f49, 'utf8');
const idx = c.indexOf('Samuel');
console.log(c.substring(Math.max(0, idx - 200), Math.min(c.length, idx + 800)));
