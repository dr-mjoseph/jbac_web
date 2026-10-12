const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJsPath = path.join(mobilePath, 'www', 'build', 'main.js');

const code = fs.readFileSync(mainJsPath, 'utf8');

const linksMatch = code.match(/links:\s*\[[\s\S]*?\]/);
if (linksMatch) {
  console.log(linksMatch[0]);
}
