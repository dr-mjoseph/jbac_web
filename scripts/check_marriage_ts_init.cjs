const fs = require('fs');
const ts = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/src/pages/marriage/marriage.ts', 'utf8');

const lines = ts.split('\n');
console.log('Total lines in marriage.ts:', lines.length);
lines.slice(25, 90).forEach((l, i) => console.log((i+26) + ': ' + l));
