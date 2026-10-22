const fs = require('fs');

const html = fs.readFileSync('src/app/jesus/studentregister/studentregister.component.html', 'utf8');

// Check form tag balance
const openForms = (html.match(/<form\b/gi) || []).length;
const closeForms = (html.match(/<\/form>/gi) || []).length;
console.log('Open <form>:', openForms, 'Close </form>:', closeForms);

const openDivs = (html.match(/<div\b/gi) || []).length;
const closeDivs = (html.match(/<\/div>/gi) || []).length;
console.log('Open <div>:', openDivs, 'Close </div>:', closeDivs);

// Check if any comments are unclosed
const openComments = (html.match(/<!--/g) || []).length;
const closeComments = (html.match(/-->/g) || []).length;
console.log('Open <!--:', openComments, 'Close -->:', closeComments);

if (openComments !== closeComments) {
  console.error('MISMATCH IN COMMENTS!');
  process.exit(1);
}

// Check formControlNames in HTML vs TS
const strippedHtml = html.replace(/<!--[\s\S]*?-->/g, '');
const regex = /formControlName=["']([^"']+)["']/g;
const formControls = [];
let m;
while ((m = regex.exec(strippedHtml)) !== null) {
  formControls.push(m[1]);
}

const ts = fs.readFileSync('src/app/jesus/studentregister/studentregister.component.ts', 'utf8');
const groupMatch = ts.match(/this\.studentform\s*=\s*this\.formBuilder\.group\(\{([\s\S]*?)\}\s*\)/);
const definedControls = {};
if (groupMatch) {
  const lines = groupMatch[1].split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    const match = trimmed.match(/^([a-zA-Z0-9_]+)\s*:\s*(\[[^\]]*\])/);
    if (match) {
      definedControls[match[1]] = match[2];
    }
  }
}

let missing = 0;
for (const fc of new Set(formControls)) {
  if (!definedControls[fc]) {
    console.error('Missing in TS FormBuilder:', fc);
    missing++;
  }
}

if (missing === 0) {
  console.log('ALL HTML form controls exist in TS FormBuilder!');
} else {
  console.error(`Found ${missing} missing form controls!`);
  process.exit(1);
}
