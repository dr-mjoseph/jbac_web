const fs = require('fs');

const files = [
  'addmarriages/addmarriages.component.ts',
  'addmeetings/addmeetings.component.ts',
  'addinstitute/addinstitute.component.ts',
  'addchurchtimings/addchurchtimings.component.ts',
  'organisationregister/organisationregister.component.ts',
  'pastorassociationregister/pastorassociationregister.component.ts',
  'signup/signup.component.ts'
];

files.forEach(f => {
  const p = 'src/app/jesus/' + f;
  if (!fs.existsSync(p)) return;
  const content = fs.readFileSync(p, 'utf8');
  console.log(`\n================= ${f} =================`);

  // Look for ngOnInit
  const initMatch = content.match(/ngOnInit\s*\(\)\s*\{([\s\S]*?)\n  \}/);
  if (initMatch) {
    console.log('ngOnInit snippet:\n' + initMatch[1].trim().substring(0, 300));
  }

  // Look for pastor or church filter methods
  const methods = ['pastorfilterdropdown', 'pastorspeakers', 'pastorfilter', 'filterchurchdata', 'pastororganization', 'pastorassociation'];
  methods.forEach(m => {
    const mMatch = content.indexOf(m + '(');
    if (mMatch !== -1) {
      console.log(`Method ${m} found:\n` + content.substring(mMatch, mMatch + 250));
    }
  });
});
