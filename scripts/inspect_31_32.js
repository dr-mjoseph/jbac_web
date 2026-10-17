const fs = require('fs');
const path = require('path');
const buildDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build';

const c32 = fs.readFileSync(path.join(buildDir, '32.js'), 'utf8');
console.log('32.js (EntryForm): contains "యాప్ ఆక్టివేట్":', c32.includes('యాప్ ఆక్టివేట్'));

const c31 = fs.readFileSync(path.join(buildDir, '31.js'), 'utf8');
console.log('31.js (ForgotPassword): contains "checknumberpassword":', c31.includes('checknumberpassword'));
