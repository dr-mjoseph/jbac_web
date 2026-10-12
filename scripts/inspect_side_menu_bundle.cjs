const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJsPath = path.join(mobilePath, 'www', 'build', 'main.js');
const mainCssPath = path.join(mobilePath, 'www', 'build', 'main.css');

const mainJs = fs.readFileSync(mainJsPath, 'utf8');
const mainCss = fs.readFileSync(mainCssPath, 'utf8');

console.log('=== main.js Side Menu & pages array ===');
// Search for pages array in main.js
const pagesMatch = mainJs.match(/this\.pages\s*=\s*\[[\s\S]*?\];/);
if (pagesMatch) {
  console.log(pagesMatch[0]);
} else {
  console.log('Could not find this.pages in main.js');
}

// Search for app.html template in main.js
const templateMatch = mainJs.match(/<ion-menu[\s\S]*?<\/ion-menu>/);
if (templateMatch) {
  console.log('\n=== Inlined ion-menu in main.js ===');
  console.log(templateMatch[0]);
}

console.log('\n=== main.css ion-menu rules ===');
const cssBlocks = mainCss.match(/[^{}]*(?:ion-menu|\.menu-inner|jbac-menu)[^{]*\{[^}]*\}/gi);
if (cssBlocks) {
  console.log(cssBlocks.join('\n'));
} else {
  console.log('No specific ion-menu rules found');
}
