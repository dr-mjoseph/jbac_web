const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJsPath = path.join(mobilePath, 'www', 'build', 'main.js');

const code = fs.readFileSync(mainJsPath, 'utf8');

const startIdx = code.indexOf('links: [');
if (startIdx !== -1) {
  const endIdx = code.indexOf(']', startIdx);
  const fullLinks = code.substring(startIdx, endIdx + 1);
  console.log('Total characters in links:', fullLinks.length);
  // parse items
  const items = [...fullLinks.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1]);
  console.log('Registered page names in Deeplinker:', items);
}
