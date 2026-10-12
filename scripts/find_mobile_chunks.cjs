const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const buildPath = path.join(mobilePath, 'www', 'build');

const files = fs.readdirSync(buildPath);
console.log('Build files count:', files.length);

// Check FamilyCouncellingPage chunk
files.filter(f => f.endsWith('.js')).forEach(f => {
  const code = fs.readFileSync(path.join(buildPath, f), 'utf8');
  if (code.includes('FamilyCouncellingPage') || code.includes('family-councelling')) {
    console.log(`Found FamilyCouncelling in ${f} (size: ${code.length})`);
  }
  if (code.includes('MarriagePage') || code.includes('marriage.html')) {
    console.log(`Found MarriagePage in ${f} (size: ${code.length})`);
  }
});
