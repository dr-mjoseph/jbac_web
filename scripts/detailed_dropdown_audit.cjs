const fs = require('fs');
const path = require('path');

const forms = [
  'believerregister',
  'churchregister',
  'doctorregister',
  'organisationregister',
  'pastorregister',
  'pastorassociationregister',
  'ministryregister',
  'studentregister',
  'signup',
  'addmarriages',
  'addinstitute',
  'addbusiness',
  'addjobs',
  'addattacks',
  'addads',
  'addchurchtimings',
  'addmeetings',
  'family-councelling',
  'entry',
  'namodu'
];

const webDir = path.join(__dirname, '..', 'src', 'app', 'jesus');

console.log("=== COMPREHENSIVE DROPDOWN AUDIT ACROSS ALL REGISTRATION FORMS ===");

for (const form of forms) {
  const htmlPath = path.join(webDir, form, `${form}.component.html`);
  const tsPath = path.join(webDir, form, `${form}.component.ts`);
  if (!fs.existsSync(htmlPath) || !fs.existsSync(tsPath)) continue;

  const html = fs.readFileSync(htmlPath, 'utf8');
  const ts = fs.readFileSync(tsPath, 'utf8');

  const selects = [...html.matchAll(/<select[\s\S]*?<\/select>/gi)];
  console.log(`\n--------------------------------------------------`);
  console.log(`FORM: [${form}] (Found ${selects.length} dropdowns)`);
  console.log(`--------------------------------------------------`);

  for (let i = 0; i < selects.length; i++) {
    const sel = selects[i][0];
    const ctrl = (sel.match(/formControlName="([^"]+)"/) || sel.match(/name="([^"]+)"/) || [])[1] || 'no-control';
    const ngFor = (sel.match(/\*ngFor="let\s+([^\s]+)\s+of\s+([^";\s]+)/) || [])[2];
    const change = (sel.match(/\(change\)="([^"]+)"/) || [])[1] || '';
    const click = (sel.match(/\(click\)="([^"]+)"/) || [])[1] || '';
    const optionCount = (sel.match(/<option/gi) || []).length;

    let status = 'OK';
    let details = '';

    if (ngFor) {
      // Find how ngFor is defined & populated in TS
      const isDecl = ts.includes(ngFor);
      const isAssigned = new RegExp(`(?:this\\.)?${ngFor}\\s*=\\s*`).test(ts);
      if (!isDecl) {
        status = 'CRITICAL: Not declared in TS!';
      } else if (!isAssigned) {
        status = 'CRITICAL: Declared but NEVER assigned!';
      } else {
        // Check what assigns it
        const assigns = [...ts.matchAll(new RegExp(`(?:this\\.)?${ngFor}\\s*=\\s*([^;\\n]+);`, 'g'))].map(m => m[1].trim());
        details = `assigned via: ${assigns.join(' || ')}`;
      }
    } else {
      if (optionCount <= 1) {
        status = 'WARNING: Only 1 or 0 options!';
      } else {
        details = `${optionCount} static options`;
      }
    }

    console.log(`  Dropdown #${i+1} [${ctrl}]: ngFor="${ngFor || 'none'}" | Status: ${status} | ${details}`);
    if (change) console.log(`      (change)="${change}"`);
    if (click) console.log(`      (click)="${click}"`);
  }
}
