const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJs = path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', 'main.js');
const content = fs.readFileSync(mainJs, 'utf8');

const regex = /\.\.\/pages\/about\/about\.module/g;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log('Match at index:', m.index);
  console.log(content.substring(m.index - 50, m.index + 200));
}
