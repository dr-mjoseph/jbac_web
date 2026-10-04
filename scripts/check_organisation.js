const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\organisation\\organisation.html', 'utf8');
html.split('\n').forEach((l, i) => {
  if (l.includes('pastor') || l.includes('Pastor')) console.log(`${i+1}: ${l.trim()}`);
});
const ts = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\organisation\\organisation.ts', 'utf8');
console.log('has getorganizationpastors in ts:', ts.includes('getorganizationpastors'));
