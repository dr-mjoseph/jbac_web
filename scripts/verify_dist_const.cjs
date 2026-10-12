const fs = require('fs');
const s = fs.readFileSync('src/app/jesus/dropdown_fallback_data.ts', 'utf8');

const data = eval(`(${s.replace('export const FALLBACK_DROPDOWN_DATA = ', '').replace(/;?\s*$/, '')})`);

console.log('Total districts:', data.districts.length);
console.log('Total consistencies:', data.consistencies.length);
console.log('Total mandals:', data.mandals.length);

let unmatchedDistricts = [];
data.districts.forEach(d => {
  const matches = data.consistencies.filter(c => c.dstrct_id == d.id);
  console.log(`District ${d.id} (${d.distrct_nm}): ${matches.length} consistencies`);
  if (matches.length === 0) {
    unmatchedDistricts.push(d);
  }
});

console.log('Unmatched districts:', unmatchedDistricts.length);
