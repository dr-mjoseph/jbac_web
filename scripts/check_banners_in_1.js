const fs = require('fs');
const f1 = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\1.js';
const c = fs.readFileSync(f1, 'utf8');
console.log('1.js has baneers URL:', c.includes('baneers'));
console.log('1.js has Banner01.png:', c.includes('Banner01.png'));
