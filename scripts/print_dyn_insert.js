const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/backend/server.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('async function dynamicInsert') || l.includes('const dynamicInsert')) {
    console.log(lines.slice(idx, idx + 35).join('\n'));
  }
});
