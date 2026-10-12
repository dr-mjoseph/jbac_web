const fs = require('fs');
const js = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

const tplStart = js.indexOf('template: `');
const tplEnd = js.indexOf('`\n        })', tplStart);
const tpl = js.substring(tplStart + 11, tplEnd);

console.log('Template length:', tpl.length);

const clickMatches = [...tpl.matchAll(/\(click\)="([^"]+)"/g)].map(m => m[1]);
console.log('Click handlers found:', [...new Set(clickMatches)]);

// Check if these methods exist in 49.js
const uniqueHandlers = [...new Set(clickMatches.map(c => c.split('(')[0].split('=')[0].trim()))];
uniqueHandlers.forEach(h => {
  if (h && !h.includes('.')) {
    const exists = js.includes('FamilyCouncellingPage.prototype.' + h) || js.includes(h + ' = function') || h === 'viewMode';
    console.log(`Handler "${h}": ${exists ? 'EXISTS' : 'MISSING!'}`);
  }
});
