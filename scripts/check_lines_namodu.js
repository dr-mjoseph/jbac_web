const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/src/app/jesus/namodu/namodu.component.ts', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(410, 430).map((l, i) => `${i+411}: ${JSON.stringify(l)}`).join('\n'));
