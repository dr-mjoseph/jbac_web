const fs = require('fs');
const path = require('path');
const p = 'C:/Users/rajes/StudioProjects/jbac_app/src/pages/marriage/marriage.ts';
if (fs.existsSync(p)) {
  const ts = fs.readFileSync(p, 'utf8');
  console.log('marriage.ts exists! Length:', ts.length);
  console.log(ts.substring(0, 800));
} else {
  console.log('marriage.ts does not exist');
}
