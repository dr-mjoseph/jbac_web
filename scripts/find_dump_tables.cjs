const fs = require('fs');
const dump = fs.readFileSync('database/jbac_structure.sql', 'utf8');

const regex = /INSERT INTO `([^`]+)`/g;
const foundTables = new Set();
let match;
while ((match = regex.exec(dump)) !== null) {
  foundTables.add(match[1]);
}

console.log('Tables with INSERT INTO statements in jbac_structure.sql:');
console.log(Array.from(foundTables));
