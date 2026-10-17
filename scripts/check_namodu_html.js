const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/src/app/jesus/namodu/namodu.component.html', 'utf8');
console.log('HTML length:', content.length);
const regex = /<form[\s\S]*?<\/form>/gi;
const m = regex.exec(content);
if (m) {
  console.log('FORM TAG:\n', m[0].slice(0, 500));
}
