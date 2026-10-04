const fs = require('fs');
const ts = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\profile\\profile.ts', 'utf8').split('\n');
console.log('=== profile.ts lines 1-60 ===');
for (let i = 0; i < 60; i++) console.log(`${i+1}: ${ts[i]}`);

console.log('=== profile.ts ionViewDidLoad ===');
let found = false;
ts.forEach((l, i) => {
  if (l.includes('ionViewDidLoad')) found = true;
  if (found && i < 330) console.log(`${i+1}: ${l}`);
  if (found && l.includes('}') && i > 320) found = false;
});
