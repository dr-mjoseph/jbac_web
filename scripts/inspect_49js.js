const fs = require('fs');
const f49 = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\49.js';
if (fs.existsSync(f49)) {
    const c = fs.readFileSync(f49, 'utf8');
    console.log('49.js length:', c.length);
    ['getFallbackDoctors', 'Samuel', 'openBooking', 'ionView', 'tab'].forEach(kw => {
        console.log(`Contains "${kw}":`, c.includes(kw));
    });
}
