const fs = require('fs');
const path = require('path');

const mobileDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages';

console.log('=== REMEDIATING MOBILE APP (jbac_app) ===');

// 1. Remediate believer/believer.ts
const believerPath = path.join(mobileDir, 'believer', 'believer.ts');
if (fs.existsSync(believerPath)) {
  let content = fs.readFileSync(believerPath, 'utf8');

  // Fix: assign this.beliverform = this.form in constructor
  if (!content.includes('this.beliverform = this.form')) {
    content = content.replace(
      'this.form = this.formBuilder.group({',
      'this.beliverform = this.form = this.formBuilder.group({'
    );
  }

  // Fix: replace this.beliverform with this.form in getpastorsdata
  content = content.replace(/this\.beliverform\.value/g, 'this.form.value');

  // Fix: add getwing() and getchurchesdata()
  if (!content.includes('getchurchfilter')) {
    const methodsToAdd = `
  getchurchfilter: any = [];
  getchurchesdata() {
    var d = this.form.value.districts;
    var c = this.form.value.constituencyname;
    var m = this.form.value.mandals;
    if (!d || !c || !m) {
      this.service.getchurch().subscribe((res: any) => {
        this.getchurchfilter = res && res.data ? res.data : [];
      });
    } else {
      var data = { districts: d, constituencyname: c, mandal_id: m };
      this.service.getchurchesdatafilters(data).subscribe((res: any) => {
        this.getchurchfilter = res && res.data ? res.data : [];
      });
    }
  }

  getwing() {
    this.service.getwing().subscribe((res: any) => {
      this.wings = res && res.data ? res.data : [];
    });
  }
`;
    content = content.replace('lead: boolean = false;', `${methodsToAdd}\n  lead: boolean = false;`);
  }

  // Fix: call this.getwing() in ionViewDidLoad()
  if (!content.includes('this.getwing();')) {
    content = content.replace(
      'this.getdenomations();',
      'this.getdenomations();\n    this.getwing();\n    this.getchurchesdata();'
    );
  }

  fs.writeFileSync(believerPath, content, 'utf8');
  console.log('[OK] Remediated believer/believer.ts');
}

// 2. Remediate addinstitute/addinstitute.ts
const addinstPath = path.join(mobileDir, 'addinstitute', 'addinstitute.ts');
if (fs.existsSync(addinstPath)) {
  let content = fs.readFileSync(addinstPath, 'utf8');
  if (!content.includes('getpastorassciationas')) {
    const addition = `
  getpastorassciationas: any = [];
  pastorfilter() {
    this.service.getpastor().subscribe((res: any) => {
      this.getpastorassciationas = res && res.data ? res.data : [];
    });
  }
`;
    content = content.replace('ionViewDidLoad() {', `${addition}\n  ionViewDidLoad() {`);
    content = content.replace('this.getbelivers();', 'this.getbelivers();\n    this.pastorfilter();');
    fs.writeFileSync(addinstPath, content, 'utf8');
    console.log('[OK] Remediated addinstitute/addinstitute.ts');
  }
}

// 3. Remediate addmarriage/addmarriage.ts
const addmrgPath = path.join(mobileDir, 'addmarriage', 'addmarriage.ts');
if (fs.existsSync(addmrgPath)) {
  let content = fs.readFileSync(addmrgPath, 'utf8');
  if (!content.includes('pastoras')) {
    const addition = `
  pastoras: any = [];
  pastorfilterdropdown() {
    this.service.getpastor().subscribe((res: any) => {
      this.pastoras = res && res.data ? res.data : [];
    });
  }
`;
    content = content.replace('ionViewDidLoad() {', `${addition}\n  ionViewDidLoad() {`);
    content = content.replace('this.getbelivers();', 'this.getbelivers();\n    this.pastorfilterdropdown();');
    fs.writeFileSync(addmrgPath, content, 'utf8');
    console.log('[OK] Remediated addmarriage/addmarriage.ts');
  }
}

// 4. Remediate organisation/organisation.ts
const orgPath = path.join(mobileDir, 'organisation', 'organisation.ts');
if (fs.existsSync(orgPath)) {
  let content = fs.readFileSync(orgPath, 'utf8');
  if (!content.includes('getorganizationpastors')) {
    const addition = `
  getorganizationpastors: any = [];
  getorgnaziationpstorsget() {
    this.service.getpastor().subscribe((res: any) => {
      this.getorganizationpastors = res && res.data ? res.data : [];
    });
  }
`;
    content = content.replace('ionViewDidLoad() {', `${addition}\n  ionViewDidLoad() {`);
    content = content.replace('this.getdistric();', 'this.getdistric();\n    this.getorgnaziationpstorsget();');
    fs.writeFileSync(orgPath, content, 'utf8');
    console.log('[OK] Remediated organisation/organisation.ts');
  }
}

// 5. Remediate institute/institute.ts
const instPath = path.join(mobileDir, 'institute', 'institute.ts');
if (fs.existsSync(instPath)) {
  let content = fs.readFileSync(instPath, 'utf8');
  if (!content.includes('toggleDisplayDiv')) {
    const addition = `
  isShowDiv: boolean = true;
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
`;
    content = content.replace('export class InstitutePage {', `export class InstitutePage {\n${addition}`);
    fs.writeFileSync(instPath, content, 'utf8');
    console.log('[OK] Remediated institute/institute.ts');
  }
}

// 6. Remediate searchhouse/searchhouse.ts
const shPath = path.join(mobileDir, 'searchhouse', 'searchhouse.ts');
if (fs.existsSync(shPath)) {
  let content = fs.readFileSync(shPath, 'utf8');
  if (!content.includes('callNumber')) {
    const addition = `
  callNumber(num: any) {
    if (num) {
      window.open('tel:' + num, '_system');
    }
  }
`;
    content = content.replace('export class SearchhousePage {', `export class SearchhousePage {\n${addition}`);
    fs.writeFileSync(shPath, content, 'utf8');
    console.log('[OK] Remediated searchhouse/searchhouse.ts');
  }
}

// 7. Remediate profile/profile.ts
const profPath = path.join(mobileDir, 'profile', 'profile.ts');
if (fs.existsSync(profPath)) {
  let content = fs.readFileSync(profPath, 'utf8');
  if (!content.includes('getpastorsdatas')) {
    const arraysToAdd = `
  getpastorsdatas: any = [];
  getchurchfilter: any = [];
  getstudentspastors: any = [];
  getchurchstudentfilter: any = [];
  getministrypastors: any = [];
  getchurchpastors: any = [];
  getorganizationpastors: any = [];
  getpastorassciationas: any = [];
  ministryname: any = [];
`;
    content = content.replace('export class ProfilePage {', `export class ProfilePage {\n${arraysToAdd}`);

    const methodsToAdd = `
  getpastorsdata() {
    this.service.getpastor().subscribe((res: any) => {
      this.getpastorsdatas = res && res.data ? res.data : [];
      this.getstudentspastors = this.getpastorsdatas;
      this.getministrypastors = this.getpastorsdatas;
      this.getchurchpastors = this.getpastorsdatas;
      this.getorganizationpastors = this.getpastorsdatas;
      this.getpastorassciationas = this.getpastorsdatas;
    });
  }

  getchurchesdata() {
    this.service.getchurch().subscribe((res: any) => {
      this.getchurchfilter = res && res.data ? res.data : [];
      this.getchurchstudentfilter = this.getchurchfilter;
    });
  }

  getpastorssdata() { this.getpastorsdata(); }
  getchurchesstudentdata() { this.getchurchesdata(); }

  getministriesdata() {
    this.service.getministry().subscribe((res: any) => {
      this.ministryname = res && res.data ? res.data : [];
    });
  }
`;
    content = content.replace('ionViewDidLoad() {', `ionViewDidLoad() {\n    this.getpastorsdata();\n    this.getchurchesdata();\n    this.getministriesdata();`);
    content = content.replace('getservice() {', `${methodsToAdd}\n  getservice() {`);
    fs.writeFileSync(profPath, content, 'utf8');
    console.log('[OK] Remediated profile/profile.ts');
  }
}

console.log('\n=== ALL MOBILE REMEDIATIONS APPLIED SUCCESSFULLY ===');
