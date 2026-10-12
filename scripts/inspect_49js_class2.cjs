const fs = require('fs');
const js = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

const classStart = js.indexOf('var FamilyCouncellingPage =');
console.log(js.substring(classStart + 1500, classStart + 3500));
