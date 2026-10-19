const fs = require('fs');
const path = require('path');

const buildDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build';
const files = fs.readdirSync(buildDir).filter(f => f.endsWith('.js'));

console.log('Searching for all registration modules in build chunks...');

files.forEach(f => {
  const content = fs.readFileSync(path.join(buildDir, f), 'utf8');
  const matches = content.match(/__webpack_require__\.d\(__webpack_exports__,\s*["']([^"']+)["']/g);
  if (matches) {
    matches.forEach(m => {
      const name = m.split('"')[1] || m.split("'")[1];
      if (name && (name.includes('Page') || name.includes('Module'))) {
        const hasRetypeInGroup = content.includes('// retypepassword') || content.includes('//retypepassword');
        const hasRetypeInTpl = content.includes('formControlName="retypepassword"') || content.includes("formControlName=\\\"retypepassword\\\"");
        const hasTermInGroup = content.includes('// term') || content.includes('//term');
        const hasTermInTpl = content.includes('formControlName="term"') || content.includes("formControlName=\\\"term\\\"");
        console.log(`Chunk ${f}: ${name} | RetypeCommented: ${hasRetypeInGroup} | RetypeInTpl: ${hasRetypeInTpl} | TermCommented: ${hasTermInGroup} | TermInTpl: ${hasTermInTpl}`);
      }
    });
  }
});
