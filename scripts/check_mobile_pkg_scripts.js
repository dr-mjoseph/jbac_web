const fs = require('fs');
const pkgPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\package.json';
console.log(JSON.stringify(JSON.parse(fs.readFileSync(pkgPath, 'utf8')).scripts, null, 2));
