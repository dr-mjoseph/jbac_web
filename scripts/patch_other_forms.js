const fs = require('fs');

// 1. Patch signup.component.ts
const signupPath = 'c:/Users/rajes/Documents/jbac_web/src/app/jesus/signup/signup.component.ts';
let signupContent = fs.readFileSync(signupPath, 'utf8');

signupContent = signupContent.replace(
  /this\.service\.postbeliver\(this\.beliverform\.value\)\.subscribe\(/,
  `const val = this.beliverform.value;
      const payload = {
        ...val,
        district_id: val.districts || val.district_id,
        constituency_id: val.constituencyname || val.constituency_id,
        mandal_id: val.mandals || val.mandal_id,
        panchayat_id: val.panchayati || val.panchayat_id || val.village_id
      };
      this.service.postbeliver(payload).subscribe(`
);
fs.writeFileSync(signupPath, signupContent, 'utf8');
console.log('Patched signup.component.ts');

// 2. Patch believerregister.component.ts
const believerPath = 'c:/Users/rajes/Documents/jbac_web/src/app/jesus/believerregister/believerregister.component.ts';
let believerContent = fs.readFileSync(believerPath, 'utf8');

believerContent = believerContent.replace(
  /this\.service\.postbeliver\(this\.beliverform\.value\)\.subscribe\(/,
  `const val = this.beliverform.value;
      const payload = {
        ...val,
        district_id: val.districts || val.district_id,
        constituency_id: val.constituencyname || val.constituency_id,
        mandal_id: val.mandals || val.mandal_id,
        panchayat_id: val.panchayati || val.panchayat_id || val.village_id
      };
      this.service.postbeliver(payload).subscribe(`
);
fs.writeFileSync(believerPath, believerContent, 'utf8');
console.log('Patched believerregister.component.ts');

// 3. Patch studentregister.component.ts
const studentPath = 'c:/Users/rajes/Documents/jbac_web/src/app/jesus/studentregister/studentregister.component.ts';
let studentContent = fs.readFileSync(studentPath, 'utf8');

studentContent = studentContent.replace(
  /password:\s*\[''\],\s*retypepassword:\s*\[''\],/,
  "password: ['', [Validators.required, Validators.minLength(4)]],\n      retypepassword: ['', [Validators.required, Validators.minLength(4)]],"
);
fs.writeFileSync(studentPath, studentContent, 'utf8');
console.log('Patched studentregister.component.ts');

// 4. Patch pastorassociationregister.component.ts
const paPath = 'c:/Users/rajes/Documents/jbac_web/src/app/jesus/pastorassociationregister/pastorassociationregister.component.ts';
let paContent = fs.readFileSync(paPath, 'utf8');

// In pastorsassociations group:
paContent = paContent.replace(
  /workingareas:\s*\[''\],\s*description:\s*\[''\],\s*password:\s*\[''\],\s*retypepassword:\s*\[''\],/,
  "workingareas: [''],\n      description: [''],\n      password: ['', [Validators.required, Validators.minLength(6)]],\n      retypepassword: ['', [Validators.required, Validators.minLength(6)]],"
);

// Remove default password fallback in postpastorassociations()
paContent = paContent.replace(
  /\/\/ Default password to phone number or '123456' if left empty so login always works[\s\S]*?this\.pastorsassociations\.patchValue\(\{[\s\S]*?\}\);\s*\}/,
  "// Password validation check\n    if (!pass) {\n      // password is required\n    }"
);

fs.writeFileSync(paPath, paContent, 'utf8');
console.log('Patched pastorassociationregister.component.ts');

// 5. Patch pastorassociationregister.component.html labels
const paHtmlPath = 'c:/Users/rajes/Documents/jbac_web/src/app/jesus/pastorassociationregister/pastorassociationregister.component.html';
let paHtmlContent = fs.readFileSync(paHtmlPath, 'utf8');

paHtmlContent = paHtmlContent.replace(
  /<label class="form-label">పాస్‌వర్డ్ సెట్ చేసుకోండి \(లాగిన్ కొరకు - ఐచ్ఛికము\)<\/label>/,
  '<label class="form-label">పాస్‌వర్డ్ సెట్ చేసుకోండి <span style="color:red; -webkit-text-stroke-width:thick;"> *</span></label>'
);

paHtmlContent = paHtmlContent.replace(
  /<label class="form-label">పాస్‌వర్డ్ మరలా ధృవీకరించండి \(Retype-Password\)<\/label>/,
  '<label class="form-label">పాస్‌వర్డ్ మరలా ధృవీకరించండి (Retype-Password) <span style="color:red; -webkit-text-stroke-width:thick;"> *</span></label>'
);

fs.writeFileSync(paHtmlPath, paHtmlContent, 'utf8');
console.log('Patched pastorassociationregister.component.html');
