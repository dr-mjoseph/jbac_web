const fs = require('fs');

const fortyNine = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

// Find all occurrences of viewMode in template
const tplStart = fortyNine.indexOf('template:');
const tpl = fortyNine.slice(tplStart);

let pos = 0;
while (true) {
  const idx = tpl.indexOf('viewMode', pos);
  if (idx === -1) break;
  console.log('--- viewMode in template at', idx, '---');
  console.log(tpl.slice(idx - 30, idx + 100));
  pos = idx + 1;
}
