const fs = require('fs');

const mainJs = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/main.js', 'utf8');
const mainCss = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/main.css', 'utf8');

console.log('mainJs has app.html:', mainJs.includes('app.html'));
console.log('mainCss has .menu-inner:', mainCss.includes('.menu-inner'));
console.log('mainCss has .made:', mainCss.includes('.made'));
console.log('mainCss has .jbac-menu-item:', mainCss.includes('.jbac-menu-item'));
