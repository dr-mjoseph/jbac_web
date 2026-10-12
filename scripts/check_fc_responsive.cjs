const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const fcHtmlPath = path.join(mobilePath, 'src', 'pages', 'family-councelling', 'family-councelling.html');

const html = fs.readFileSync(fcHtmlPath, 'utf8');
const lines = html.split('\n');

console.log('Total lines in family-councelling.html:', lines.length);

// Check segment buttons
console.log('\n--- Segments ---');
lines.filter(l => l.includes('ion-segment-button')).forEach(l => console.log(l.trim()));

// Check fixed widths or overflows
console.log('\n--- Fixed widths or potential overflow styles ---');
lines.forEach((l, idx) => {
  if (l.match(/width:\s*\d{3,}px/) || l.match(/min-width:\s*\d{3,}px/) || l.includes('overflow') || l.includes('nowrap')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});
