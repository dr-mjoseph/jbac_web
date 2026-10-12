const fs = require('fs');

const mainJs = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/main.js', 'utf8');

const idx = mainJs.indexOf('FamilyCouncellingPage');
console.log(mainJs.slice(idx - 100, idx + 250));
