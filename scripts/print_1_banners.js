const fs = require('fs');
const f1 = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\1.js';
const c = fs.readFileSync(f1, 'utf8');
const idx = c.indexOf('banners = [');
console.log(c.substring(idx, idx + 600));
