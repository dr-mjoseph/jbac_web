const fs = require('fs');
const path = require('path');

const forms = [
  'churchregister',
  'pastorregister',
  'organisationregister',
  'pastorassociationregister',
  'signup',
  'addinstitute',
  'addbusiness',
  'addjobs',
  'addattacks',
  'addads',
  'addchurchtimings',
  'addmeetings'
];

const webAppDir = path.join(__dirname, '..', 'src', 'app', 'jesus');

forms.forEach(form => {
  const tsPath = path.join(webAppDir, form, `${form}.component.ts`);
  const ts = fs.readFileSync(tsPath, 'utf8');

  const hasGetBeliver = ts.includes('getbeliver(') || ts.includes('getbeliver ()');
  const calledOnInit = ts.includes('this.getbeliver()') || ts.includes('this.getbeliver ()');
  const usesBeliversData = ts.includes('getbeliversdata');
  const setsMinistryName = ts.includes('ministryname = res.data');

  console.log(`${form}: hasMethod=${hasGetBeliver}, calledOnInit=${calledOnInit}, usesBeliversData=${usesBeliversData}, setsMinistryName=${setsMinistryName}`);
});
