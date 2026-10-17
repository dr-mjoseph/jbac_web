const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/backend/server.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1540, 1575).join('\n'));
