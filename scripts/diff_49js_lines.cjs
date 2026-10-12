const fs = require('fs');
const p1 = 'C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js';
const p2 = 'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/49.js';

const c1 = fs.readFileSync(p1, 'utf8');
const c2 = fs.readFileSync(p2, 'utf8');

const l1 = c1.split('\n');
const l2 = c2.split('\n');

for (let i = 0; i < Math.max(l1.length, l2.length); i++) {
  if (l1[i] !== l2[i]) {
    console.log(`Line ${i+1}:`);
    console.log('c1 length:', (l1[i]||'').length, 'content:', (l1[i] || '').substring(0, 150));
    console.log('c2 length:', (l2[i]||'').length, 'content:', (l2[i] || '').substring(0, 150));
    console.log('---');
    if (i > 10) break;
  }
}
