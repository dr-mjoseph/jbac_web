const fs = require('fs');
const path = require('path');
const mobileDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages';

function dumpLines(rel, start, end) {
  const p = path.join(mobileDir, rel);
  const content = fs.readFileSync(p, 'utf8').split('\n');
  console.log(`=== ${rel} (lines ${start}-${end}) ===`);
  for (let i = start - 1; i < Math.min(end, content.length); i++) {
    console.log(`${i + 1}: ${content[i]}`);
  }
}

dumpLines('believer/believer.ts', 10, 45);
dumpLines('believer/believer.ts', 80, 145);
dumpLines('believer/believer.html', 150, 200);
