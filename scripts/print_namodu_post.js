const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/src/app/jesus/namodu/namodu.component.ts', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(395, 435).join('\n'));
