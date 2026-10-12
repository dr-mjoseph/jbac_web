const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/rajes/StudioProjects/jbac_app/www/build';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const matches = [];
  
  // Search for Marriage, Counselling, FamilyCouncelling, etc.
  const regex = /(marriage|councell|counsell|వివాహ|కుటుంబ)/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(content)) !== null) {
    count++;
    if (matches.length < 5) {
      const start = Math.max(0, match.index - 50);
      const end = Math.min(content.length, match.index + 80);
      matches.push(content.slice(start, end).replace(/\r?\n/g, ' '));
    }
  }
  if (count > 0) {
    console.log(`=== File ${f} (Total matches: ${count}) ===`);
    matches.forEach(m => console.log('   ...', m, '...'));
  }
});
