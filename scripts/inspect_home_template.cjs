const fs = require('fs');

const one = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/1.js', 'utf8');

// Find the template string in 1.js
const tplStart = one.indexOf('template:');
const tplEnd = one.indexOf('//# sourceMappingURL=home.js.map');
const tpl = one.slice(tplStart, tplEnd);

console.log('Template length in 1.js:', tpl.length);

// Find all ion-col in 1.js
const regex = /<ion-col[^>]*>([\s\S]*?)<\/ion-col>/g;
let match;
let count = 0;
while ((match = regex.exec(tpl)) !== null) {
  count++;
  console.log(count + ': ' + match[0].replace(/\s+/g, ' ').slice(0, 120));
}
