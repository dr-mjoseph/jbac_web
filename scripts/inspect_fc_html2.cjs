const fs = require('fs');
const html = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/src/pages/family-councelling/family-councelling.html', 'utf8');
const lines = html.split('\n');
lines.slice(100, 200).forEach((l, i) => console.log((i+101) + ': ' + l));
