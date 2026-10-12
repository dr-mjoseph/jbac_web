const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJsPath = path.join(mobilePath, 'www', 'build', 'main.js');

const code = fs.readFileSync(mainJsPath, 'utf8');

// Search for links: [ ... ]
const linksMatch = code.match(/links:\s*\[[\s\S]*?\]/);
if (linksMatch) {
  console.log('=== Deeplinker Links in main.js ===');
  const linksStr = linksMatch[0];
  console.log('Has FamilyCouncellingPage in links?', linksStr.includes('FamilyCouncellingPage'));
  console.log('Has MarriagePage in links?', linksStr.includes('MarriagePage'));
  console.log('Has DoctorregisterPage in links?', linksStr.includes('DoctorregisterPage'));

  // Print all lines mentioning FamilyCouncelling or Marriage
  linksStr.split('\n').forEach(l => {
    if (l.includes('Councell') || l.includes('Marriage') || l.includes('Doctor')) {
      console.log('  ' + l.trim());
    }
  });
} else {
  console.log('links array not found in main.js');
}
