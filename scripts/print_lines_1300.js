const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/backend/server.ts', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1300, 1335).join('\n'));
