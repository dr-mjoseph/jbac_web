const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/src/app/jesus/entry/entry.component.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('FormBuilder') || l.includes('this.fb.group') || l.includes('entryform =')) {
    console.log(lines.slice(idx, idx + 40).join('\n'));
  }
});
