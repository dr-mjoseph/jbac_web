const fs = require('fs');
const path = require('path');

const buildDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build';
fs.readdirSync(buildDir).forEach(f => {
    if (f.endsWith('.js')) {
        const content = fs.readFileSync(path.join(buildDir, f), 'utf8');
        if (content.includes('FamilyCouncellingPage') || content.includes('Dr. Samuel') || content.includes('openBookingForm')) {
            console.log(`Found in ${f}: length=${content.length}`);
        }
    }
});
