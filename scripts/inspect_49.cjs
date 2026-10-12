const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const chunk49Path = path.join(mobilePath, 'www', 'build', '49.js');

if (fs.existsSync(chunk49Path)) {
  const code = fs.readFileSync(chunk49Path, 'utf8');
  console.log('49.js length:', code.length);
  // Check for syntax or mojibake
  const mojibakeCount = (code.match(/\?{4,}/g) || []).length;
  console.log('Question mark clusters in 49.js:', mojibakeCount);
  console.log('Contains FamilyCouncellingPage?', code.includes('FamilyCouncellingPage'));
}
