const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\addmarriage\\addmarriage.html', 'utf8');
html.split('\n').forEach((l, i) => {
  if (l.includes('pastor') || l.includes('Pastor')) console.log(`${i+1}: ${l.trim()}`);
});
const ts = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\addmarriage\\addmarriage.ts', 'utf8');
console.log('has pastoras in ts:', ts.includes('pastoras'));
