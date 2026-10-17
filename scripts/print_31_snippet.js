const fs = require('fs');
const path = require('path');
const f31 = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\31.js';
const c = fs.readFileSync(f31, 'utf8');
const idx = c.indexOf('checknumberpassword');
console.log(c.substring(Math.max(0, idx - 100), Math.min(c.length, idx + 450)));
