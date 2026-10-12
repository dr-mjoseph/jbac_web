const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJsPath = path.join(mobilePath, 'www', 'build', 'main.js');

const code = fs.readFileSync(mainJsPath, 'utf8');

const startIdx = code.indexOf('links: [');
const endIdx = code.indexOf(']', startIdx);
// Find the matching closing bracket
let depth = 0;
let realEnd = -1;
for (let i = startIdx + 7; i < code.length; i++) {
  if (code[i] === '[') depth++;
  else if (code[i] === ']') {
    if (depth === 0) {
      realEnd = i;
      break;
    }
    depth--;
  }
}

const linksSection = code.substring(startIdx, realEnd + 1);
const names = [...linksSection.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1]);
console.log('Total registered page names in links:', names.length);
console.log('Registered names:');
console.log(names.join(', '));
console.log('\nLast 5 items in links:');
console.log(code.substring(realEnd - 500, realEnd + 1));
