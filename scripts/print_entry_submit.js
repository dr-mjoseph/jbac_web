const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/src/app/jesus/entry/entry.component.ts', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(380, 460).join('\n'));
