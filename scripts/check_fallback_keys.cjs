const fs = require('fs');
const s = fs.readFileSync('src/app/jesus/dropdown_fallback_data.ts', 'utf8');

const regex = /"([a-zA-Z0-9_]+)":\s*\[/g;
const keys = [];
let m;
while ((m = regex.exec(s)) !== null) {
  keys.push(m[1]);
}
console.log('Keys in FALLBACK_DROPDOWN_DATA:', keys);
