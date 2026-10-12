const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const buildPath = path.join(mobilePath, 'www', 'build');

['29.js', '30.js', '47.js', '48.js'].forEach(f => {
  const code = fs.readFileSync(path.join(buildPath, f), 'utf8');
  console.log(`\n=== ${f} (size: ${code.length}) ===`);
  console.log(code.substring(0, 500));
});
