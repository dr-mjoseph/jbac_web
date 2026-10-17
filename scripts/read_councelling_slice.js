const fs = require('fs');

const tsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\family-councelling\\family-councelling.ts';
const content = fs.readFileSync(tsPath, 'utf8');
const lines = content.split('\n');

console.log('--- Lines 180-290 ---');
console.log(lines.slice(179, 290).join('\n'));
