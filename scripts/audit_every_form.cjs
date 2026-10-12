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

console.log('=== AUDITING ALL 21 REGISTRATION / ENTRY FORMS ===\n');

forms.forEach(form => {
  const htmlPath = path.join(webAppDir, form, `${form}.component.html`);
  const tsPath = path.join(webAppDir, form, `${form}.component.ts`);
  if (!fs.existsSync(htmlPath) || !fs.existsSync(tsPath)) {
    console.log(`[!] Missing files for ${form}`);
    return;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const ts = fs.readFileSync(tsPath, 'utf8');

  console.log(`\n--- FORM: ${form} ---`);

  const selectMatches = [...html.matchAll(/<select[\s\S]*?<\/select>/gi)];
  selectMatches.forEach((sm, i) => {
    const s = sm[0];
    const ctrl = (s.match(/formControlName="([^"]+)"/) || s.match(/name="([^"]+)"/) || ['','unnamed'])[1];
    const ngFor = s.match(/\*ngFor="let\s+([a-zA-Z0-9_$]+)\s+of\s+([a-zA-Z0-9_$.]+)"/);
    const click = (s.match(/\(click\)="([^"(]+)/) || ['',''])[1];
    const change = (s.match(/\(change\)="([^"(]+)/) || ['',''])[1];

    if (!ngFor) {
      const optCount = [...s.matchAll(/<option/gi)].length;
      console.log(`  Select #${i+1} [ctrl: ${ctrl}] Static (${optCount} options)`);
    } else {
      const itemVar = ngFor[1];
      const arrayVar = ngFor[2].split('.')[0];
      
      const inTs = ts.includes(arrayVar);
      const isAssigned = new RegExp(`(?:this\\.)?${arrayVar}\\s*(?::[^=]+)?=`).test(ts);
      const clickInTs = click ? (ts.includes(click + '(') || ts.includes(click + ' =')) : true;
      const changeInTs = change ? (ts.includes(change + '(') || ts.includes(change + ' =')) : true;

      // Check if click handler commented out
      let clickCommented = false;
      if (click && clickInTs) {
        const regex = new RegExp(`//[^\n]*${click}`);
        if (regex.test(ts)) {
          // Check if only commented
          const activeRegex = new RegExp(`^[ \t]*${click}\\s*\\(`, 'm');
          if (!activeRegex.test(ts)) {
            clickCommented = true;
          }
        }
      }

      const issues = [];
      if (!inTs) issues.push(`ARRAY '${arrayVar}' MISSING IN TS`);
      else if (!isAssigned) issues.push(`ARRAY '${arrayVar}' NEVER ASSIGNED`);
      if (click && !clickInTs) issues.push(`CLICK HANDLER '${click}' MISSING IN TS`);
      if (clickCommented) issues.push(`CLICK HANDLER '${click}' COMMENTED OUT IN TS`);
      if (change && !changeInTs) issues.push(`CHANGE HANDLER '${change}' MISSING IN TS`);

      console.log(`  Select #${i+1} [ctrl: ${ctrl}] Array: ${arrayVar} ${click ? '(click='+click+')' : ''} ${change ? '(change='+change+')' : ''} ${issues.length ? '===> ISSUES: ' + issues.join(' | ') : 'OK'}`);
    }
  });
});
