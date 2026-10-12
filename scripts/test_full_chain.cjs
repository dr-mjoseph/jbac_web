const fs = require('fs');

console.log('--- Step 1: Check map in module 182 in main.js ---');
const main = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/main.js', 'utf8');

const m182Idx = main.indexOf('/***/ 182:');
const m182End = main.indexOf('/***/ 183:', m182Idx);
const m182Content = main.slice(m182Idx, m182End !== -1 ? m182End : m182Idx + 4000);

const hasPath = m182Content.includes('"../pages/family-councelling/family-councelling.module"');
console.log('Module 182 has family-councelling path:', hasPath);

// Check if 49.js has module 511 and 512
const f49 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');
console.log('49.js has module 511:', f49.includes('511:'));
console.log('49.js has module 512:', f49.includes('512:'));

// Check what module 511 exports
console.log('511 exports FamilyCouncellingPageModule:', f49.includes('FamilyCouncellingPageModule'));

// Check links array in main.js
const linkMatch = main.match(/\{[^}]*loadChildren:\s*'([^']+)'[^}]*name:\s*'FamilyCouncellingPage'[^}]*\}/);
console.log('Link match for FamilyCouncellingPage:', linkMatch ? linkMatch[0] : 'NONE');

// Check deep link name in gotopage
const g19Match = main.match(/gotopage[^{]*\{[^}]*19[^{]*push\('([^']+)'\)/);
console.log('gotopage 19 in main.js:', g19Match ? g19Match[0] : 'NOT IN MAIN');

const h1 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/1.js', 'utf8');
const g19In1 = h1.match(/else\s+if\s*\(id\s*==\s*19\)\s*\{[^}]*push\('([^']+)'\)/);
console.log('gotopage 19 in 1.js:', g19In1 ? g19In1[0] : 'NOT FOUND IN 1.js');
