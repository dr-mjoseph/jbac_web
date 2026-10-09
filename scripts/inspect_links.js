const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJs = path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', 'main.js');
const content = fs.readFileSync(mainJs, 'utf8');

// Find the links array:
const linksStart = content.indexOf('links: [');
if (linksStart !== -1) {
  const linksEnd = content.indexOf(']', linksStart);
  console.log('=== links array in main.js ===');
  console.log(content.substring(linksStart, linksEnd + 1));
} else {
  console.log('links: [ not found');
}
