const fs = require('fs');
const vm = require('vm');

// Read vendor.js and 49.js
const vendorCode = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/vendor.js', 'utf8');
const f49Code = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

// We can check if there are any suspicious template bindings or directives in 49.js
// Let's inspect all bindings in 49.js:
const tplStart = f49Code.indexOf('template: `') + 11;
const tplEnd = f49Code.indexOf('</ion-content>\r\n`') !== -1 ? f49Code.indexOf('</ion-content>\r\n`') + 14 : f49Code.indexOf('</ion-content>\n`') + 14;
const tpl = f49Code.slice(tplStart, tplEnd);

console.log('Template length:', tpl.length);

// Let's look for suspicious things in the template:
// 1. Check for unescaped special characters
// 2. Check for [(ngModel)] without formControl
// 3. Check for properties on elements
const bindings = [];
const regex = /\[([^\]]+)\]="([^"]+)"/g;
let m;
while ((m = regex.exec(tpl)) !== null) {
  bindings.push({ target: m[1], expr: m[2] });
}
console.log('Found bindings count:', bindings.length);
bindings.slice(0, 15).forEach(b => console.log('  [' + b.target + ']="' + b.expr + '"'));

// 4. Check for events (click), etc.
const events = [];
const evRegex = /\(([^\)]+)\)="([^"]+)"/g;
while ((m = evRegex.exec(tpl)) !== null) {
  events.push({ target: m[1], handler: m[2] });
}
console.log('Found events count:', events.length);
events.slice(0, 15).forEach(e => console.log('  (' + e.target + ')="' + e.handler + '"'));
