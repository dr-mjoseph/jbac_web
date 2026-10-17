const fs = require('fs');
const path = require('path');

const dirs = [
    'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\assets\\images',
    'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\assets\\images',
    'C:\\Users\\rajes\\StudioProjects\\jbac_app\\platforms\\android\\app\\src\\main\\assets\\www\\assets\\images'
];

dirs.forEach(d => {
    console.log(`\nDirectory: ${d}`);
    for (let i = 1; i <= 8; i++) {
        const num = i < 10 ? `0${i}` : `${i}`;
        const p = path.join(d, `Banner${num}.png`);
        if (fs.existsSync(p)) {
            console.log(`  Banner${num}.png: ${fs.statSync(p).size} bytes`);
        } else {
            console.log(`  MISSING: Banner${num}.png`);
        }
    }
});
