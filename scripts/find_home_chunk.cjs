const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const buildPath = path.join(mobilePath, 'www', 'build');

const files = fs.readdirSync(buildPath).filter(f => f.endsWith('.js'));
files.forEach(f => {
  const code = fs.readFileSync(path.join(buildPath, f), 'utf8');
  if (code.includes('gotopage(') || code.includes('HomePage') || code.includes('home.html')) {
    console.log(`Found home in ${f} (size: ${code.length})`);
    if (code.includes('gotopage(19)')) {
      console.log(`  -> ${f} CONTAINS gotopage(19)!`);
    } else if (code.includes('gotopage(')) {
      console.log(`  -> ${f} contains gotopage, but NOT 19!`);
    }
  }
});
