const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/src/app/jesus/service.service.ts', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(0, 50).join('\n'));
