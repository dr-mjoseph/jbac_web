const fs = require('fs');
const path = require('path');

const regForms = [
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

regForms.forEach(form => {
  const htmlPath = `src/app/jesus/${form}/${form}.component.html`;
  const tsPath = `src/app/jesus/${form}/${form}.component.ts`;
  if (!fs.existsSync(htmlPath)) return;

  const html = fs.readFileSync(htmlPath, 'utf8');
  const ts = fs.existsSync(tsPath) ? fs.readFileSync(tsPath, 'utf8') : '';

  console.log(`\n==================================================`);
  console.log(`COMPONENT: ${form}`);
  console.log(`==================================================`);

  // Find all <select ...> ... </select>
  const selectBlocks = html.match(/<select[\s\S]*?<\/select>/g) || [];
  console.log(`Found ${selectBlocks.length} selects`);

  selectBlocks.forEach((block, idx) => {
    const formControl = (block.match(/formControlName="([^"]+)"/) || [])[1] || 'none';
    const ngFor = (block.match(/\*ngFor="let\s+([a-zA-Z0-9_]+)\s+of\s+([^"]+)"/) || []);
    const optVar = ngFor[1];
    const optArray = ngFor[2];
    const optLabel = (block.match(/\{\{([^}]+)\}\}/) || [])[1] || 'static';
    const clickOrChange = (block.match(/\((change|click)\)="([^"]+)"/) || [])[0] || '';

    // Check if optArray is declared or initialized in ts
    let tsStatus = 'unknown';
    if (optArray) {
      const cleanArray = optArray.trim();
      const inTs = ts.includes(cleanArray);
      tsStatus = inTs ? 'present in TS' : 'MISSING in TS!';
    }

    console.log(`  [${idx+1}] Control: ${formControl} | Array: ${optArray || 'static'} (${tsStatus}) | Display: {{${optLabel.trim()}}} | Event: ${clickOrChange}`);
  });
});
