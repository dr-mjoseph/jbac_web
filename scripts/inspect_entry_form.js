const fs = require('fs');
const tsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\entry-form\\entry-form.ts';
if (fs.existsSync(tsPath)) {
    const content = fs.readFileSync(tsPath, 'utf8');
    content.split('\n').forEach((l, i) => {
        if (l.includes('alert') || l.includes('Alert') || l.includes('submit') || l.includes('Submit') || l.includes('success') || l.includes('Success')) {
            console.log(`${i + 1}: ${l}`);
        }
    });
}
