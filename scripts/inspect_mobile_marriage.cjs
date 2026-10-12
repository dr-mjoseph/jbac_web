const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const marriageHtmlPath = path.join(mobilePath, 'src', 'pages', 'marriage', 'marriage.html');
const marriageTsPath = path.join(mobilePath, 'src', 'pages', 'marriage', 'marriage.ts');

if (fs.existsSync(marriageHtmlPath)) {
  const html = fs.readFileSync(marriageHtmlPath, 'utf8');
  console.log('=== marriage.html size:', html.length, '===');
  console.log(html.substring(0, 1000));
}

if (fs.existsSync(marriageTsPath)) {
  const ts = fs.readFileSync(marriageTsPath, 'utf8');
  console.log('=== marriage.ts size:', ts.length, '===');
  console.log(ts.substring(0, 500));
}
