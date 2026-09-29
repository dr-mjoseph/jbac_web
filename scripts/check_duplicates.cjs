const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = walk('./src/app');
let count = 0;
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const matches = line.match(/\(change\)=/g);
    if (matches && matches.length > 1) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
      count++;
    }
  });
});
console.log('Total duplicate change lines found:', count);
