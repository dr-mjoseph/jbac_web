const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/src/app/jesus/namodu/namodu.component.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('postregform')) {
    console.log(lines.slice(Math.max(0, idx - 5), idx + 25).join('\n'));
  }
});
