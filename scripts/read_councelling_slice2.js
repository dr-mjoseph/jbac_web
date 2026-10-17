const fs = require('fs');

const tsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\family-councelling\\family-councelling.ts';
const content = fs.readFileSync(tsPath, 'utf8');
const lines = content.split('\n');

console.log('--- Lines 100-180 ---');
console.log(lines.slice(99, 180).join('\n'));
