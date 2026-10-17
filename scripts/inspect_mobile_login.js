const fs = require('fs');
const tsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\login\\login.ts';
if (fs.existsSync(tsPath)) {
    console.log(fs.readFileSync(tsPath, 'utf8'));
}
