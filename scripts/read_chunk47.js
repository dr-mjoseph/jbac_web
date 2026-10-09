const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const buildDir = path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build');

console.log('=== 47.js ===');
console.log(fs.readFileSync(path.join(buildDir, '47.js'), 'utf8'));
