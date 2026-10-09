const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJs = path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', 'main.js');

const content = fs.readFileSync(mainJs, 'utf8');
console.log('FamilyCouncelling in main.js:', content.includes('FamilyCouncelling'));
console.log('FamilyCouncellingPage in main.js:', content.includes('FamilyCouncellingPage'));
console.log('Doctorregister in main.js:', content.includes('Doctorregister'));
