const fs = require('fs');
const path = require('path');

const forms = [
  'believerregister',
  'churchregister',
  'doctorregister',
  'ministryregister',
  'organisationregister',
  'pastorassociationregister',
  'pastorregister',
  'studentregister',
  'signup',
  'entry',
  'namodu',
  'addmarriages',
  'addmeetings',
  'addchurchtimings',
  'addbusiness',
  'addinstitute',
  'addjobs',
  'addattacks'
];

forms.forEach(name => {
  const tsPath = `src/app/jesus/${name}/${name}.component.ts`;
  if (fs.existsSync(tsPath)) {
    const ts = fs.readFileSync(tsPath, 'utf8');
    // Find all this.service.xxx calls
    const serviceCalls = [...ts.matchAll(/this\.service\.([a-zA-Z0-9_]+)\s*\(/g)].map(m => m[1]);
    const uniqueCalls = [...new Set(serviceCalls)];
    console.log(`\n=== ${name} ===`);
    console.log('Service calls:', uniqueCalls);
    // Find all ngOnInit calls or constructors
    const initMatch = ts.match(/ngOnInit\s*\(\)\s*\{([^}]*)\}/);
    if (initMatch) {
      console.log('ngOnInit body snippet:', initMatch[1].trim().replace(/\s+/g, ' ').substring(0, 200));
    }
  }
});
