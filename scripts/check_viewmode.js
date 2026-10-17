const fs = require('fs');
const html = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/src/pages/family-councelling/family-councelling.html', 'utf8');
const lines = html.split('\n');
console.log('Total lines:', lines.length);
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('viewMode ===') || lines[i].includes('viewMode ==')) {
    console.log(`Line ${i+1}: ${lines[i].trim()}`);
  }
}
