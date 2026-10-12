const fs = require('fs');
const js = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

const tplStart = js.indexOf('template: `');
const tplEnd = js.indexOf('`', tplStart + 12);
const tpl = js.substring(tplStart, tplEnd);

let pos = 0;
while (true) {
  const i = tpl.indexOf('(click)=', pos);
  if (i === -1) break;
  const quote = tpl[i + 8];
  const close = tpl.indexOf(quote, i + 9);
  console.log(tpl.substring(i, close + 1));
  pos = close + 1;
}
