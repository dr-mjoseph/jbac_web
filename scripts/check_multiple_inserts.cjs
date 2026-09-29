const fs = require('fs');
const path = require('path');

const dump = fs.readFileSync(path.resolve(__dirname, '../database/jbac_structure.sql'), 'utf8');

const regex = /INSERT INTO `([^`]+)`/g;
const counts = {};
let match;
while ((match = regex.exec(dump)) !== null) {
  counts[match[1]] = (counts[match[1]] || 0) + 1;
}

console.log('Tables with multiple INSERT INTO statements:');
for (const [tbl, cnt] of Object.entries(counts)) {
  if (cnt > 1) {
    console.log(`${tbl}: ${cnt} statements`);
  }
}
