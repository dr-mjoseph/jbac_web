const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const appHtmlPath = path.join(mobilePath, 'src', 'app', 'app.html');

if (fs.existsSync(appHtmlPath)) {
  console.log('=== app.html raw content ===');
  const content = fs.readFileSync(appHtmlPath, 'utf8');
  console.log(content);
} else {
  console.log('app.html not found at', appHtmlPath);
}

const appTsPath = path.join(mobilePath, 'src', 'app', 'app.component.ts');
if (fs.existsSync(appTsPath)) {
  console.log('=== app.component.ts raw content ===');
  const tsContent = fs.readFileSync(appTsPath, 'utf8');
  console.log(tsContent);
}
