const fs = require('fs');
const ts = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/src/pages/marriage/marriage.ts', 'utf8');

const lines = ts.split('\n');
lines.slice(210, 286).forEach((l, i) => console.log((i+211) + ': ' + l));
