const fs = require('fs');

const tsPath = 'c:/Users/rajes/Documents/jbac_web/src/app/jesus/namodu/namodu.component.ts';
let content = fs.readFileSync(tsPath, 'utf8');

// 1. Add whatsapp to formBuilder
content = content.replace(
  /number:\s*\['',\s*\[Validators\.required,\s*Validators\.minLength\(10\)\]\],(\r?\n\s*)password:\s*\[''\],/,
  "number: ['', [Validators.required, Validators.minLength(10)]],$1whatsapp: [''],$1password: [''],"
);

// 2. Update payload in postregform
content = content.replace(
  /const submittedPhone = this\.entryform\.value\?\.phonenum \|\| this\.entryform\.value\?\.number \|\| '';\s*const payload = \{[\s\S]*?source:\s*'namodu',[\s\S]*?is_namodu:\s*true\s*\};/,
  `const submittedPhone = this.entryform.value?.phonenum || this.entryform.value?.number || '';
    const whatsappVal = this.entryform.value?.whatsapp || '';
    const payload = {
      ...this.entryform.value,
      password: submittedPhone,
      source: 'namodu',
      is_namodu: true,
      whatsapp: whatsappVal,
      whatsappno: whatsappVal,
      whatsapp_number: whatsappVal
    };`
);

fs.writeFileSync(tsPath, content, 'utf8');
console.log('Successfully updated namodu.component.ts!');
