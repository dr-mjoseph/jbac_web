const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/src/app/jesus/namodu/namodu.component.ts', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);

lines.forEach((l, idx) => {
  if (l.includes('post') || l.includes('submit') || l.includes('entryform =')) {
    console.log(lines.slice(Math.max(0, idx - 2), idx + 15).join('\n'));
    console.log('-----------------------------');
  }
});
