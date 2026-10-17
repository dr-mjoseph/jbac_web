const fs = require('fs');
const path = require('path');
const f32 = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\32.js';
const c = fs.readFileSync(f32, 'utf8');
const idx = c.indexOf('యాప్ ఆక్టివేట్');
console.log(c.substring(Math.max(0, idx - 150), Math.min(c.length, idx + 450)));
