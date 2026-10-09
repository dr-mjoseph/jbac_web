const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJs = path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', 'main.js');

if (fs.existsSync(mainJs)) {
  const content = fs.readFileSync(mainJs, 'utf8');
  const idx = content.indexOf('HelpinghandsPage');
  if (idx !== -1) {
    console.log('Found HelpinghandsPage in platform main.js:');
    console.log(content.substring(idx - 100, idx + 800));
  } else {
    console.log('HelpinghandsPage not found!');
  }
}
