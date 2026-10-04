const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\institute\\institute.html', 'utf8').split('\n');
for (let i = 105; i < Math.min(130, html.length); i++) {
  console.log(`${i+1}: ${html[i]}`);
}
