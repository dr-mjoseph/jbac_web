const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJs = path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', 'main.js');
const content = fs.readFileSync(mainJs, 'utf8');

const linksStart = content.indexOf('links: [');
const linksEnd = content.indexOf(']', linksStart);
console.log('links array full:');
console.log(content.substring(linksStart, linksEnd + 100));

// Find where webpack dynamic imports or map is:
const mapIdx = content.indexOf('loadChildren');
console.log('\nNear loadChildren:');
console.log(content.substring(mapIdx - 100, mapIdx + 300));
