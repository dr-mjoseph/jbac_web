const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJsPath = path.join(mobilePath, 'www', 'build', 'main.js');

const code = fs.readFileSync(mainJsPath, 'utf8');

const startIdx = code.indexOf('links: [');
if (startIdx !== -1) {
  console.log(code.substring(startIdx, startIdx + 1500));
}
