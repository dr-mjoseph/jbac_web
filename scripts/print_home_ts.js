const fs = require('fs');
const homeTsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\home\\home.ts';
const content = fs.readFileSync(homeTsPath, 'utf8');
const lines = content.split('\n');
console.log(lines.slice(10, 30).join('\n'));
