const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const fcTsPath = path.join(mobilePath, 'src', 'pages', 'family-councelling', 'family-councelling.ts');

const ts = fs.readFileSync(fcTsPath, 'utf8');
const lines = ts.split('\n');

console.log('Total lines in family-councelling.ts:', lines.length);

// Print constructor and lifecycle hooks
lines.slice(0, 150).forEach((l, i) => console.log(`${i+1}: ${l}`));
