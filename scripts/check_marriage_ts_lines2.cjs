const fs = require('fs');
const ts = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/src/pages/marriage/marriage.ts', 'utf8');

const lines = ts.split('\n');
lines.slice(150, 210).forEach((l, i) => console.log((i+151) + ': ' + l));
