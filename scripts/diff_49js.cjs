const fs = require('fs');
const p1 = 'C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js';
const p2 = 'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/49.js';

const c1 = fs.readFileSync(p1, 'utf8');
const c2 = fs.readFileSync(p2, 'utf8');

console.log('c1 length:', c1.length);
console.log('c2 length:', c2.length);

// Check if c2 has syntax error or missing parts
try {
  const vm = require('vm');
  new vm.Script(c2);
  console.log('c2 syntax: OK');
} catch (e) {
  console.log('c2 syntax ERROR:', e.message);
}

// Find diffs
const l1 = c1.split('\n');
const l2 = c2.split('\n');
console.log('l1 lines:', l1.length, 'l2 lines:', l2.length);
for (let i = 0; i < Math.max(l1.length, l2.length); i++) {
  if (l1[i] !== l2[i]) {
    console.log(`Line ${i+1} differs:`);
    console.log('c1:', (l1[i] || '').substring(0, 100));
    console.log('c2:', (l2[i] || '').substring(0, 100));
    break;
  }
}
