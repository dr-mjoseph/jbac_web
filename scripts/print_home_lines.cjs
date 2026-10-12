const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const homeHtmlPath = path.join(mobilePath, 'src', 'pages', 'home', 'home.html');

const html = fs.readFileSync(homeHtmlPath, 'utf8');
const lines = html.split('\n');
console.log(lines.slice(40, 95).map((l, i) => `${i+41}: ${l}`).join('\n'));
