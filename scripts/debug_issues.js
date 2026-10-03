const fs = require('fs');
const path = require('path');

console.log('=== 1. DEBUGGING PASTORREGISTER ===');
const pastorHtml = fs.readFileSync('src/app/jesus/pastorregister/pastorregister.component.html', 'utf8');
const pastorTs = fs.readFileSync('src/app/jesus/pastorregister/pastorregister.component.ts', 'utf8');

const pControls = [...pastorHtml.matchAll(/formControlName=['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Total controls in pastorregister.component.html:', pControls.length);

const pFgMatch = pastorTs.match(/this\.pastorform\s*=\s*this\.formBuilder\.group\(\{([\s\S]*?)\}\);/);
if (pFgMatch) {
  const fgKeys = [...pFgMatch[1].matchAll(/([a-zA-Z0-9_$]+)\s*:/g)].map(m => m[1]);
  const missing = pControls.filter(c => !fgKeys.includes(c));
  console.log('Missing controls in pastorform FormGroup:', missing);
}

// Find elements with formControlName that are NOT input, select, textarea
const nonStandardControls = [...pastorHtml.matchAll(/<([a-zA-Z0-9_-]+)[^>]*formControlName=['"]([^'"]+)['"][^>]*>/g)]
  .filter(m => !['input', 'select', 'textarea'].includes(m[1].toLowerCase()));
console.log('Non-standard elements with formControlName:', nonStandardControls.map(m => ({ tag: m[1], control: m[2], snippet: m[0].slice(0, 100) })));

console.log('\n=== 2. DEBUGGING MISSING CONTROLS (term, category, prob_category) ===');
const componentsToCheck = ['signup', 'believerregister', 'studentregister', 'ministryregister', 'pastorregister', 'churchregister', 'organisationregister', 'pastorassociationregister', 'supp-reg', 'wish', 'entry', 'namodu'];

for (const comp of componentsToCheck) {
  const hPath = `src/app/jesus/${comp}/${comp}.component.html`;
  const tPath = `src/app/jesus/${comp}/${comp}.component.ts`;
  if (!fs.existsSync(hPath) || !fs.existsSync(tPath)) continue;

  const h = fs.readFileSync(hPath, 'utf8');
  const t = fs.readFileSync(tPath, 'utf8');

  const htmlControls = [...h.matchAll(/formControlName=['"]([^'"]+)['"]/g)].map(m => m[1]);
  // Find all formBuilder.group definitions in t
  const groups = [...t.matchAll(/this\.[a-zA-Z0-9_$]+\s*=\s*this\.formBuilder\.group\(\{([\s\S]*?)\}\);/g)];
  const allGroupKeys = new Set();
  for (const g of groups) {
    const keys = [...g[1].matchAll(/([a-zA-Z0-9_$]+)\s*:/g)].map(m => m[1]);
    keys.forEach(k => allGroupKeys.add(k));
  }

  const missing = [...new Set(htmlControls.filter(c => !allGroupKeys.has(c)))];
  if (missing.length > 0) {
    console.log(`[${comp}] Missing controls in TS:`, missing);
  }
}
