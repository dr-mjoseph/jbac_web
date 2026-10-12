const fs = require('fs');
const code = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\main.js', 'utf8');

let idx = 0;
while ((idx = code.indexOf('couple.svg', idx)) !== -1) {
  console.log('Found couple.svg at index', idx);
  console.log(code.substring(Math.max(0, idx - 150), Math.min(code.length, idx + 200)));
  idx += 10;
}
