const fs = require('fs');

const tsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\family-councelling\\family-councelling.ts';
const htmlPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\family-councelling\\family-councelling.html';

console.log('--- family-councelling.ts exists:', fs.existsSync(tsPath));
console.log('--- family-councelling.html exists:', fs.existsSync(htmlPath));

if (fs.existsSync(tsPath)) {
    const tsContent = fs.readFileSync(tsPath, 'utf8');
    console.log('TS length:', tsContent.length);
    // Find getFallbackDoctors, openBookingForm, checkLogin
    ['getFallbackDoctors', 'openBooking', 'register', 'login', 'tab', 'book'].forEach(kw => {
        const matches = [];
        tsContent.split('\n').forEach((line, i) => {
            if (line.toLowerCase().includes(kw.toLowerCase())) {
                matches.push(`${i + 1}: ${line.trim()}`);
            }
        });
        console.log(`\nMatches for "${kw}":`, matches.slice(0, 5));
    });
}
