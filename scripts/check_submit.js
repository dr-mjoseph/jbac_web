const fs = require('fs');
['c:/Users/rajes/Documents/jbac_web/src/app/jesus/entry/entry.component.ts', 'c:/Users/rajes/Documents/jbac_web/src/app/jesus/namodu/namodu.component.ts'].forEach(p => {
  console.log('=== FILE:', p);
  const content = fs.readFileSync(p, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('onSubmit') || l.includes('insert') || l.includes('register') || l.includes('insertreg')) {
      console.log(`${idx+1}: ${l}`);
    }
  });
});
