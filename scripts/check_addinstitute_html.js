const fs = require('fs');
const p = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\addinstitute\\addinstitute.html';
const content = fs.readFileSync(p, 'utf8').split('\n');
content.forEach((line, i) => {
  if (line.includes('pastor') || line.includes('Pastor')) {
    console.log(`${i+1}: ${line.trim()}`);
  }
});
