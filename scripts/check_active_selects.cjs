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

forms.forEach(form => {
  const htmlPath = path.join(webAppDir, form, `${form}.component.html`);
  const tsPath = path.join(webAppDir, form, `${form}.component.ts`);
  if (!fs.existsSync(htmlPath)) return;

  const rawHtml = fs.readFileSync(htmlPath, 'utf8');
  // Strip comments
  const cleanHtml = rawHtml.replace(/<!--[\s\S]*?-->/g, '');
  const ts = fs.existsSync(tsPath) ? fs.readFileSync(tsPath, 'utf8') : '';

  const matches = [...cleanHtml.matchAll(/<select[\s\S]*?<\/select>/gi)];
  console.log(`\n=== ${form} (Active Selects: ${matches.length}) ===`);

  matches.forEach((m, idx) => {
    const s = m[0];
    const ctrl = (s.match(/formControlName="([^"]+)"/) || s.match(/name="([^"]+)"/) || ['','unnamed'])[1];
    const ngFor = s.match(/\*ngFor="let\s+([a-zA-Z0-9_$]+)\s+of\s+([a-zA-Z0-9_$.]+)"/);
    const click = (s.match(/\(click\)="([^"(]+)/) || ['',''])[1];
    const change = (s.match(/\(change\)="([^"(]+)/) || ['',''])[1];

    if (!ngFor) {
      console.log(`  [${idx+1}] ctrl=${ctrl} (Static options)`);
    } else {
      const arrayVar = ngFor[2].split('.')[0];
      const inTs = ts.includes(arrayVar);
      console.log(`  [${idx+1}] ctrl=${ctrl} -> Array: ${arrayVar} ${click ? '(click='+click+')':''} ${change ? '(change='+change+')':''} ${inTs ? 'OK' : '===> MISSING IN TS'}`);
    }
  });
});
