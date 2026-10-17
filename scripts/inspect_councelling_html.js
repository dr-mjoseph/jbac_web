const fs = require('fs');

const htmlPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\family-councelling\\family-councelling.html';
const content = fs.readFileSync(htmlPath, 'utf8');

// Find segment or tabs or register button
content.split('\n').forEach((line, i) => {
    if (line.includes('register') || line.includes('Register') || line.includes('segment') || line.includes('viewMode') || line.includes('ion-segment-button')) {
        console.log(`${i + 1}: ${line}`);
    }
});
