const fs = require('fs');
const js = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

const classStart = js.indexOf('var FamilyCouncellingPage =');
const classEnd = js.indexOf('return FamilyCouncellingPage;', classStart);

console.log('Class code snippet:\n', js.substring(classStart, classStart + 1500));
