const fs = require('fs');
const lines = fs.readFileSync('src/app/jesus/profile/profile.component.html', 'utf8').split('\n');
lines.forEach((l, idx) => {
  if (l.includes('type="file"') && !l.includes('(change)')) {
    console.log('Line without change handler:', idx + 1, l.trim());
    console.log('Context:\n' + lines.slice(Math.max(0, idx - 5), idx + 6).join('\n'));
  }
});
