const fs = require('fs');

const homeTsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\home\\home.ts';
if (fs.existsSync(homeTsPath)) {
    const content = fs.readFileSync(homeTsPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
        if (l.includes('banner') || l.includes('Banner') || l.includes('baneer') || l.includes('slides')) {
            console.log(`${idx + 1}: ${l}`);
        }
    });
} else {
    console.log('Not found:', homeTsPath);
}
