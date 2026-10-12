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
  'signup'
];
const webAppDir = path.join(__dirname, '..', 'src', 'app', 'jesus');
forms.forEach(form => {
  const html = fs.readFileSync(path.join(webAppDir, form, form + '.component.html'), 'utf8');
  const ts = fs.readFileSync(path.join(webAppDir, form, form + '.component.ts'), 'utf8');
  console.log('=== ' + form + ' ===');
  const selectMatches = [...html.matchAll(/<select[\s\S]*?<\/select>/gi)];
  selectMatches.forEach((sm, i) => {
    const s = sm[0];
    const ctrl = (s.match(/formControlName="([^"]+)"/) || s.match(/name="([^"]+)"/) || ['','unnamed'])[1];
    const ngFor = s.match(/\*ngFor="let\s+([a-zA-Z0-9_$]+)\s+of\s+([a-zA-Z0-9_$.]+)"/);
    const click = (s.match(/\(click\)="([^"(]+)/) || ['',''])[1];
    const change = (s.match(/\(change\)="([^"(]+)/) || ['',''])[1];
    if (ngFor) {
      const arrayVar = ngFor[2].split('.')[0];
      const inTs = ts.includes(arrayVar);
      const isAssigned = new RegExp('(?:this\\.)?' + arrayVar + '\\s*(?::[^=]+)?=').test(ts);
      let clickCommented = false;
      if (click) {
        const regex = new RegExp('//[^\\n]*' + click);
        const activeRegex = new RegExp('^[ \\t]*' + click + '\\s*\\(', 'm');
        if (regex.test(ts) && !activeRegex.test(ts)) clickCommented = true;
      }
      const issues = [];
      if (!inTs) issues.push('MISSING IN TS');
      else if (!isAssigned) issues.push('NEVER ASSIGNED');
      if (clickCommented) issues.push('CLICK COMMENTED');
      console.log('  ' + ctrl + ' -> ' + arrayVar + ' ' + (click ? '(click='+click+')':'') + ' ' + (issues.length ? '===> ' + issues.join(', ') : 'OK'));
    }
  });
});
