const fs = require('fs');
const f49 = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\49.js';
const c = fs.readFileSync(f49, 'utf8');
const idx = c.indexOf('Samuel');
const arrayStart = c.lastIndexOf('[', idx);
const arrayEnd = c.indexOf(']', idx) + 1;
console.log('--- Doctors array in 49.js ---');
console.log(c.substring(arrayStart, arrayEnd));
