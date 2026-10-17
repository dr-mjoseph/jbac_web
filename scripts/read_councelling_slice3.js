const fs = require('fs');

const htmlPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\family-councelling\\family-councelling.html';
const content = fs.readFileSync(htmlPath, 'utf8');
const lines = content.split('\n');

console.log('--- Lines 30-60 of family-councelling.html ---');
console.log(lines.slice(29, 60).join('\n'));
