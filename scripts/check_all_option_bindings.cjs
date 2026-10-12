const fs = require('fs');

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

forms.forEach(form => {
  const htmlPath = `src/app/jesus/${form}/${form}.component.html`;
  if (!fs.existsSync(htmlPath)) return;
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Find all <option ...>...</option>
  const options = [...html.matchAll(/<option[^>]*>([\s\S]*?)<\/option>/g)];
  console.log(`\n=== ${form} (${options.length} options) ===`);
  options.forEach((opt, i) => {
    const raw = opt[0].replace(/\s+/g, ' ');
    if (raw.includes('ngFor')) {
      console.log(`  [${i+1}] ${raw}`);
    }
  });
});
