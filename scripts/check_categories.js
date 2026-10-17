const fs = require('fs');
['c:/Users/rajes/Documents/jbac_web/src/app/jesus/entry/entry.component.html', 'c:/Users/rajes/Documents/jbac_web/src/app/jesus/namodu/namodu.component.html'].forEach(path => {
  console.log('--- PATH:', path);
  const content = fs.readFileSync(path, 'utf8');
  const regex = /<select[^>]*formControlName=["']category["'][^>]*>([\s\S]*?)<\/select>/gi;
  let m;
  while ((m = regex.exec(content)) !== null) {
    console.log(m[0]);
  }
});
