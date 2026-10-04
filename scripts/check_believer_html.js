const fs = require('fs');
const path = require('path');
const p = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\believer\\believer.html';
const content = fs.readFileSync(p, 'utf8').split('\n');
content.forEach((line, i) => {
  if (line.includes('church') || line.includes('Church') || line.includes('wing') || line.includes('Wing')) {
    console.log(`${i+1}: ${line.trim()}`);
  }
});
