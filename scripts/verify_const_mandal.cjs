const fs = require('fs');
const s = fs.readFileSync('src/app/jesus/dropdown_fallback_data.ts', 'utf8');

const data = eval(`(${s.replace('export const FALLBACK_DROPDOWN_DATA = ', '').replace(/;?\s*$/, '')})`);

let unmatchedConst = [];
data.consistencies.forEach(c => {
  const matches = data.mandals.filter(m => m.const_id == c.id);
  if (matches.length === 0) {
    unmatchedConst.push(c);
  }
});

console.log('Total consistencies:', data.consistencies.length);
console.log('Unmatched consistencies:', unmatchedConst.length);
if (unmatchedConst.length > 0) {
  console.log('Sample unmatched:', unmatchedConst.slice(0, 5));
}
