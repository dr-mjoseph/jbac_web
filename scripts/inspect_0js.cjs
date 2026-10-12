const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const buildPath = path.join(mobilePath, 'www', 'build');

const code0 = fs.readFileSync(path.join(buildPath, '0.js'), 'utf8');
const idx = code0.indexOf('gotopage(19)');
console.log('gotopage(19) in 0.js:', idx);
if (idx !== -1) {
  console.log(code0.substring(Math.max(0, idx - 200), Math.min(code0.length, idx + 300)));
}

// Check where gotopage is implemented in 0.js
const tsIdx = code0.indexOf('gotopage = function');
console.log('gotopage function in 0.js:', tsIdx);
if (tsIdx !== -1) {
  console.log(code0.substring(tsIdx, tsIdx + 600));
}
