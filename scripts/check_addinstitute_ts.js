const fs = require('fs');
const p = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\addinstitute\\addinstitute.ts';
const content = fs.readFileSync(p, 'utf8');
console.log('has getpastorassciationas:', content.includes('getpastorassciationas'));
console.log('has pastorfilter:', content.includes('pastorfilter'));
console.log('ionViewDidLoad content:');
const lines = content.split('\n');
let print = false;
lines.forEach((l, i) => {
  if (l.includes('ionViewDidLoad')) print = true;
  if (print && i < 100) console.log(`${i+1}: ${l}`);
  if (print && l.includes('}') && i > 70) print = false;
});
