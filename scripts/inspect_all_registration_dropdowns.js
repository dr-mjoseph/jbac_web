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
  'supp-reg',
  'entry',
  'namodu'
];

const webAppDir = path.join(__dirname, '..', 'src', 'app', 'jesus');

for (const form of forms) {
  const htmlPath = path.join(webAppDir, form, `${form}.component.html`);
  const tsPath = path.join(webAppDir, form, `${form}.component.ts`);
  if (!fs.existsSync(htmlPath)) {
    console.log(`[SKIP] ${form} html not found`);
    continue;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const ts = fs.existsSync(tsPath) ? fs.readFileSync(tsPath, 'utf8') : '';

  console.log(`\n========================================`);
  console.log(`FORM: ${form}`);
  console.log(`========================================`);

  // Find all <select> blocks
  const selectRegex = /<select[\s\S]*?<\/select>/gi;
  const matches = html.match(selectRegex) || [];
  console.log(`Found ${matches.length} <select> dropdowns:`);

  for (let i = 0; i < matches.length; i++) {
    const s = matches[i];
    const formCtrl = (s.match(/formControlName="([^"]+)"/) || [])[1] || 'no-control';
    const nameAttr = (s.match(/name="([^"]+)"/) || [])[1] || '';
    const ngFor = (s.match(/\*ngFor="let\s+([^\s]+)\s+of\s+([^"]+)"/) || [])[2] || '';
    const hasHardcodedOptions = (s.match(/<option[^>]*>([\s\S]*?)<\/option>/gi) || []).length;
    const changeHandler = (s.match(/\(change\)="([^"]+)"/) || [])[1] || '';

    console.log(`  [${i+1}] control: "${formCtrl || nameAttr}" | ngFor: "${ngFor}" | optionCount: ${hasHardcodedOptions} | change: "${changeHandler}"`);

    if (ngFor) {
      const arrName = ngFor.trim().split(' ')[0];
      // Check in TS how arrName is loaded
      const inTs = ts.includes(arrName);
      // Find where arrName is populated
      const popMatches = [...ts.matchAll(new RegExp(`(?:this\\.)?${arrName}\\s*=\\s*([^;\\n]+)`, 'g'))].map(m => m[0].trim());
      console.log(`      TS declaration: ${inTs} | Populated: ${popMatches.join(' || ') || 'NOT POPULATED!'}`);
    }
  }
}
