const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\institute\\institute.html', 'utf8');
html.split('\n').forEach((l, i) => {
  if (l.includes('toggle') || l.includes('Display') || l.includes('click')) console.log(`${i+1}: ${l.trim()}`);
});
const ts = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\institute\\institute.ts', 'utf8');
console.log('has toggleDisplayDiv in ts:', ts.includes('toggleDisplayDiv'));
