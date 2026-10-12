const fs = require('fs');
const html = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/src/pages/family-councelling/family-councelling.html', 'utf8');
const scss = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/src/pages/family-councelling/family-councelling.scss', 'utf8');

console.log('--- family-councelling.scss ---');
console.log(scss);

console.log('--- Check elements in family-councelling.html ---');
const lines = html.split('\n');
console.log('Total HTML lines:', lines.length);
lines.slice(0, 100).forEach((l, i) => console.log((i+1) + ': ' + l));
