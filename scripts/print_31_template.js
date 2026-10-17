const fs = require('fs');
const f31 = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\31.js';
const c = fs.readFileSync(f31, 'utf8');
const idx = c.indexOf('template:');
console.log(c.substring(idx, idx + 800));
