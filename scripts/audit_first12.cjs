const fs = require('fs');
const path = require('path');
const forms = ['believerregister','churchregister','organisationregister','pastorregister','pastorassociationregister','ministryregister','studentregister','signup','addmarriages','addinstitute','addbusiness','addjobs'];
const webDir = path.join(__dirname, '..', 'src', 'app', 'jesus');
for (const form of forms) {
  const html = fs.readFileSync(path.join(webDir, form, form + '.component.html'), 'utf8');
  const ts = fs.readFileSync(path.join(webDir, form, form + '.component.ts'), 'utf8');
  const selects = [...html.matchAll(/<select[\s\S]*?<\/select>/gi)];
  console.log('--- ' + form + ' (' + selects.length + ') ---');
  for (let i = 0; i < selects.length; i++) {
    const sel = selects[i][0];
    const ctrl = (sel.match(/formControlName="([^"]+)"/) || sel.match(/name="([^"]+)"/) || [])[1] || 'no-ctrl';
    const ngFor = (sel.match(/\*ngFor="let\s+([^\s]+)\s+of\s+([^";\s]+)/) || [])[2];
    const optCount = (sel.match(/<option/gi) || []).length;
    console.log('  #' + (i+1) + ' [' + ctrl + '] ngFor=' + (ngFor || 'none') + ' opts=' + optCount);
  }
}
