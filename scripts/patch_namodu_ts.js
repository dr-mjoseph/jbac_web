const fs = require('fs');

const tsPath = 'c:/Users/rajes/Documents/jbac_web/src/app/jesus/namodu/namodu.component.ts';
let content = fs.readFileSync(tsPath, 'utf8');

content = content.replace(
  /const submittedPhone = this\.entryform\.value\?\.phonenum \|\| '';\s*this\.service\.postregform\(this\.entryform\.value\)\.subscribe\(/,
  `const submittedPhone = this.entryform.value?.phonenum || this.entryform.value?.number || '';
    const payload = {
      ...this.entryform.value,
      source: 'namodu',
      is_namodu: true
    };
    this.service.postregform(payload).subscribe(`
);

fs.writeFileSync(tsPath, content, 'utf8');
console.log('Successfully updated namodu.component.ts!');
