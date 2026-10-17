const fs = require('fs');
const tsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\forgot-password\\forgot-password.ts';
const htmlPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\forgot-password\\forgot-password.html';

if (fs.existsSync(tsPath)) {
    console.log('--- forgot-password.ts ---');
    console.log(fs.readFileSync(tsPath, 'utf8'));
}
if (fs.existsSync(htmlPath)) {
    console.log('--- forgot-password.html ---');
    console.log(fs.readFileSync(htmlPath, 'utf8'));
}
