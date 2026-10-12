const fs = require('fs');

const s = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

const tplStartMarker = 'template: `';
const startIdx = s.indexOf(tplStartMarker);
if (startIdx === -1) {
  console.error('template marker not found');
  process.exit(1);
}

const contentStart = startIdx + tplStartMarker.length;
// Find closing backtick
let endIdx = -1;
for (let i = contentStart; i < s.length; i++) {
  if (s[i] === '`' && s[i - 1] !== '\\') {
    endIdx = i;
    break;
  }
}

const tpl = s.slice(contentStart, endIdx);
console.log('Found template, length:', tpl.length);
fs.writeFileSync('scripts/extracted_fc_tpl.html', tpl);

// Validate HTML tags
const tagRegex = /<\/?([a-zA-Z0-9\-_]+)(?:\s+[^>]*)?>/g;
let match;
const selfClosing = new Set(['img', 'input', 'br', 'hr', 'source', 'ion-icon', 'col']);
const stack = [];
const errors = [];

while ((match = tagRegex.exec(tpl)) !== null) {
  const full = match[0];
  const tag = match[1].toLowerCase();
  const isClosing = full.startsWith('</');
  const isSelf = full.endsWith('/>') || selfClosing.has(tag);

  if (isSelf) continue;

  if (isClosing) {
    if (stack.length === 0) {
      errors.push('Unexpected closing tag: </' + tag + '> at pos ' + match.index);
    } else {
      const top = stack.pop();
      if (top !== tag) {
        errors.push(`Mismatched tag at pos ${match.index}: expected </${top}>, found </${tag}>`);
      }
    }
  } else {
    stack.push(tag);
  }
}

console.log('Unclosed tags remaining:', stack);
console.log('Tag errors:', errors);
