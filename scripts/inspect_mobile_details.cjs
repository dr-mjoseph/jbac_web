const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';

// 1. Check main.css side menu styles
const cssPath = path.join(mobilePath, 'www', 'build', 'main.css');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  console.log('--- main.css (ion-menu matches) ---');
  const menuLines = css.split('\n').filter(l => l.includes('ion-menu') || l.includes('jbac-menu') || l.includes('menu-inner'));
  console.log(menuLines.slice(0, 10).join('\n'));
}

// 2. Check home.html
const homeHtmlPath = path.join(mobilePath, 'src', 'pages', 'home', 'home.html');
if (fs.existsSync(homeHtmlPath)) {
  const homeHtml = fs.readFileSync(homeHtmlPath, 'utf8');
  console.log('\n--- home.html lines around item 19 & 20 ---');
  const lines = homeHtml.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('gotopage(19)') || l.includes('gotopage(20)') || l.includes('councelling') || l.includes('marriage')) {
      console.log(`L${i+1}: ${l}`);
      // also print surrounding lines
      for (let j = Math.max(0, i-2); j <= Math.min(lines.length-1, i+4); j++) {
        console.log(`   ${j+1}: ${lines[j]}`);
      }
    }
  });
}

// 3. Check home.ts
const homeTsPath = path.join(mobilePath, 'src', 'pages', 'home', 'home.ts');
if (fs.existsSync(homeTsPath)) {
  const homeTs = fs.readFileSync(homeTsPath, 'utf8');
  console.log('\n--- home.ts gotopage implementation ---');
  const lines = homeTs.split('\n');
  let capturing = false;
  lines.forEach((l, i) => {
    if (l.includes('gotopage(') || l.includes('gotopage (')) {
      capturing = true;
    }
    if (capturing) {
      console.log(`L${i+1}: ${l}`);
      if (l.includes('}') && lines[i-1] && lines[i-1].includes('break')) {
        // keep going for switch
      }
    }
  });
}
