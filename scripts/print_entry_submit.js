const fs = require('fs');
const tsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\entry-form\\entry-form.ts';
const content = fs.readFileSync(tsPath, 'utf8');
const lines = content.split('\n');
console.log(lines.slice(185, 230).join('\n'));
