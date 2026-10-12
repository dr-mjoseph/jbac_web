const fs = require('fs');
const s = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\main.js', 'utf8');
const idx = s.indexOf('links: [');
// Find matching closing bracket
let depth = 0;
let endIdx = -1;
for (let i = idx + 7; i < s.length; i++) {
  if (s[i] === '[') depth++;
  else if (s[i] === ']') {
    if (depth === 0) {
      endIdx = i;
      break;
    }
    depth--;
  }
}
const linksBlock = s.substring(idx, endIdx + 1);
console.log("Found links block of length:", linksBlock.length);
console.log("Includes FamilyCouncellingPage?", linksBlock.includes('FamilyCouncellingPage'));
console.log("Includes MarriagePage?", linksBlock.includes('MarriagePage'));
console.log("Includes DoctorregisterPage?", linksBlock.includes('DoctorregisterPage'));

const names = [...linksBlock.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1]);
console.log("All page names in links (" + names.length + "):", names.join(', '));
