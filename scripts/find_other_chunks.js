const fs = require('fs');
const path = require('path');
const buildDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build';

fs.readdirSync(buildDir).forEach(f => {
    if (f.endsWith('.js')) {
        const c = fs.readFileSync(path.join(buildDir, f), 'utf8');
        if (c.includes('EntryFormPage') || c.includes('నమోదు కాలేదు') || c.includes('ForgotPasswordPage')) {
            console.log(`Chunk ${f}: length=${c.length}, hasEntry=${c.includes('EntryFormPage')}, hasForgot=${c.includes('ForgotPasswordPage')}`);
        }
    }
});
