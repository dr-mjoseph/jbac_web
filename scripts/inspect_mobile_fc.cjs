const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const fcHtmlPath = path.join(mobilePath, 'src', 'pages', 'family-councelling', 'family-councelling.html');
const fcTsPath = path.join(mobilePath, 'src', 'pages', 'family-councelling', 'family-councelling.ts');
const fcScssPath = path.join(mobilePath, 'src', 'pages', 'family-councelling', 'family-councelling.scss');

if (fs.existsSync(fcHtmlPath)) {
  const html = fs.readFileSync(fcHtmlPath, 'utf8');
  console.log('=== family-councelling.html size:', html.length, '===');
  console.log('First 500 chars:');
  console.log(html.substring(0, 500));
}

if (fs.existsSync(fcTsPath)) {
  const ts = fs.readFileSync(fcTsPath, 'utf8');
  console.log('\n=== family-councelling.ts size:', ts.length, '===');
  console.log('First 500 chars:');
  console.log(ts.substring(0, 500));
}
