const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const pkg = JSON.parse(fs.readFileSync(path.join(mobilePath, 'package.json'), 'utf8'));
console.log('dependencies:', pkg.dependencies);
console.log('devDependencies:', pkg.devDependencies);
