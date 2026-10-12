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

async function testAll() {
  const issues = [];
  
  for (const form of forms) {
    const htmlPath = path.join(webAppDir, form, `${form}.component.html`);
    const tsPath = path.join(webAppDir, form, `${form}.component.ts`);
    if (!fs.existsSync(htmlPath) || !fs.existsSync(tsPath)) continue;

    const html = fs.readFileSync(htmlPath, 'utf8');
    const ts = fs.readFileSync(tsPath, 'utf8');

    // Match all <select> blocks
    const selectRegex = /<select[\s\S]*?<\/select>/gi;
    let match;
    while ((match = selectRegex.exec(html)) !== null) {
      const selectHtml = match[0];
      const ctrlMatch = selectHtml.match(/formControlName="([^"]+)"/) || selectHtml.match(/name="([^"]+)"/);
      const ctrl = ctrlMatch ? ctrlMatch[1] : 'unnamed';
      
      const ngForMatch = selectHtml.match(/\*ngFor="let\s+([a-zA-Z0-9_$]+)\s+of\s+([a-zA-Z0-9_$]+)"/);
      const options = [...selectHtml.matchAll(/<option[\s\S]*?<\/option>/gi)];

      if (!ngForMatch) {
        // Hardcoded options
        const validOptions = options.filter(o => !o[0].includes('disabled') && !o[0].includes('selected'));
        if (validOptions.length === 0) {
          issues.push({ form, ctrl, issue: 'No selectable options in static select' });
        }
      } else {
        const itemVar = ngForMatch[1];
        const arrayVar = ngForMatch[2];

        // Check if arrayVar is defined in TS
        if (!ts.includes(arrayVar)) {
          issues.push({ form, ctrl, issue: `Array '${arrayVar}' is used in *ngFor but NOT in TS file` });
          continue;
        }

        // Check how arrayVar is populated
        // e.g. this.districts = ...
        const popRegex = new RegExp(`(?:this\\.)?${arrayVar}\\s*=\\s*([^;\\n]+)`);
        const isPopulated = popRegex.test(ts);
        if (!isPopulated) {
          issues.push({ form, ctrl, issue: `Array '${arrayVar}' is NEVER populated in TS file` });
        }

        // Check if the property accessed exists in template: e.g. {{item.distrct_nm}}
        const propMatches = [...selectHtml.matchAll(new RegExp(`{{\\s*${itemVar}\\.([a-zA-Z0-9_$]+)`, 'g'))];
        const valMatches = [...selectHtml.matchAll(new RegExp(`value="{{\\s*${itemVar}\\.([a-zA-Z0-9_$]+)`, 'g'))]
          .concat([...selectHtml.matchAll(new RegExp(`\\[value\\]="${itemVar}\\.([a-zA-Z0-9_$]+)"`, 'g'))]);

        // Check change handler if any
        const changeMatch = selectHtml.match(/\(change\)="([^"(]+)/);
        if (changeMatch) {
          const handler = changeMatch[1];
          if (!ts.includes(`${handler}(`)) {
            issues.push({ form, ctrl, issue: `Change handler '${handler}' is not defined in TS` });
          }
        }
      }
    }
  }

  console.log(`\nFound ${issues.length} potential issues across registration forms:`);
  console.log(JSON.stringify(issues, null, 2));
}

testAll();
