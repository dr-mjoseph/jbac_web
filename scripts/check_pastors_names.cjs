const fs = require('fs');
const s = fs.readFileSync('src/app/jesus/dropdown_fallback_data.ts', 'utf8');

const data = eval(`(${s.replace('export const FALLBACK_DROPDOWN_DATA = ', '').replace(/;?\s*$/, '')})`);

let nullPastors = 0;
data.pastors.forEach((p, i) => {
  if (!p.pastorname && !p.name) {
    nullPastors++;
  }
});

console.log('Total pastors in fallback:', data.pastors.length);
console.log('Pastors with null name/pastorname:', nullPastors);
if (nullPastors > 0) {
  console.log('First 3 items:', data.pastors.slice(0, 3));
}
