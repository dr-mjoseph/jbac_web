const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.angular')) {
        results = results.concat(walk(full));
      }
    } else {
      if (file.endsWith('.component.html')) {
        results.push(full);
      }
    }
  });
  return results;
}

const htmlFiles = walk('src/app');
console.log('Total HTML files:', htmlFiles.length);

const formsWithSelect = [];

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('<select')) {
    const selects = [...content.matchAll(/<select[^>]*>/g)].map(m => m[0]);
    const options = [...content.matchAll(/\*ngFor="let\s+([a-zA-Z0-9_]+)\s+of\s+([^"]+)"/g)].map(m => m[2]);
    formsWithSelect.push({
      file: path.relative(process.cwd(), f),
      selectCount: selects.length,
      selects: selects,
      optionsSources: options
    });
  }
});

console.log('Files with <select> dropdowns:', formsWithSelect.length);
formsWithSelect.forEach(item => {
  console.log(`\n=== ${item.file} (${item.selectCount} selects) ===`);
  item.selects.forEach((s, i) => console.log(`  [${i+1}] ${s}`));
  console.log('  Sources:', item.optionsSources);
});
