const fs = require('fs');

const fortyNine = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

const regex = /\(click\)="([^"]+)"/g;
const clicks = new Set();
let match;
while ((match = regex.exec(fortyNine)) !== null) {
  clicks.add(match[1]);
}

console.log('Unique click handlers in 49.js:');
console.log(Array.from(clicks));

// Check if tappable is used
const tappableCount = (fortyNine.match(/tappable/g) || []).length;
console.log('Tappable count in 49.js:', tappableCount);
