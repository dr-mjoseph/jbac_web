const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/backend/server.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('postregform')) {
    console.log(lines.slice(idx - 2, idx + 30).join('\n'));
  }
});
