const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\searchhouse\\searchhouse.html', 'utf8').split('\n');
html.forEach((l, i) => {
  if (l.includes('callNumber') || l.includes('call') || l.includes('Call')) console.log(`${i+1}: ${l.trim()}`);
});
const ts = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\searchhouse\\searchhouse.ts', 'utf8');
console.log('has callNumber in ts:', ts.includes('callNumber'));
