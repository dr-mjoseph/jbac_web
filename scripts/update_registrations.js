const fs = require('fs');
const path = require('path');

console.log('--- Updating Registration Forms with State Selection ---');

// Helper to replace or log
function updateFile(filePath, transforms) {
  let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  let changed = false;
  for (const t of transforms) {
    if (typeof t.target === 'string') {
      if (content.includes(t.target)) {
        content = content.replace(t.target, t.replacement);
        changed = true;
      } else if (!content.includes(t.verify || t.replacement)) {
        console.warn(`[WARN] Target not found in ${path.basename(filePath)}:\n${t.target.slice(0, 80)}...`);
      }
    } else if (t.target instanceof RegExp) {
      if (t.target.test(content)) {
        content = content.replace(t.target, t.replacement);
        changed = true;
      } else if (!content.includes(t.verify || '')) {
        console.warn(`[WARN] Regex target not found in ${path.basename(filePath)}: ${t.target}`);
      }
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
    console.log(`[OK] Updated ${path.basename(filePath)}`);
  } else {
    console.log(`[SKIP/ALREADY DONE] ${path.basename(filePath)}`);
  }
}

// 1. Believer Register
const bTs = path.join(__dirname, '../src/app/jesus/believerregister/believerregister.component.ts');
let bTsContent = fs.readFileSync(bTs, 'utf8').replace(/\r\n/g, '\n');

if (!bTsContent.includes('states: any = [];')) {
  bTsContent = bTsContent.replace('  districts: any;', '  states: any = [];\n  districts: any;');
}
if (!bTsContent.includes("state_id: ['1'")) {
  bTsContent = bTsContent.replace(
    "districts: ['', [Validators.required]],",
    "state_id: ['1', [Validators.required]],\n      districts: ['', [Validators.required]],"
  );
}
if (!bTsContent.includes('this.getstates();')) {
  bTsContent = bTsContent.replace(
    'this.getdistric();',
    'this.getstates();\n    this.getdistric(1);'
  );
}
if (!bTsContent.includes('onStateChange(event: any)')) {
  const bMethods = `getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res?.data || [
        { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
        { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
      ];
    });
  }

  onStateChange(event: any) {
    const stateId = event?.target?.value || event || '1';
    this.beliverform.patchValue({
      districts: '',
      constituencyname: '',
      mandals: '',
      panchayati: ''
    });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.getdistric(stateId);
  }

  getdistric(stateId?: any) {
    const sid = stateId || this.beliverform.get('state_id')?.value || 1;
    this.service.getdistrict(sid).subscribe(res => {
      this.districts = res.data;
    });
  }`;

  bTsContent = bTsContent.replace(
    /getdistric\(\)\s*\{\s*this\.service\.getdistrict\(\)\.subscribe\(res\s*=>\s*\{\s*this\.districts\s*=\s*res\.data;\s*\}\)\s*\}/,
    bMethods
  );
}
if (!bTsContent.includes('state_id: stateIdVal')) {
  bTsContent = bTsContent.replace(
    'const val = this.beliverform.value;\n      const payload = {',
    `const val = this.beliverform.value;
      const stateIdVal = Number(val.state_id) || 1;
      const payload = {
        state_id: stateIdVal,
        state: stateIdVal === 2 ? 'Telangana' : 'Andhra Pradesh',`
  );
}
fs.writeFileSync(bTs, bTsContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('[OK] Updated believerregister.component.ts');

// Believer Register HTML
const bHtml = path.join(__dirname, '../src/app/jesus/believerregister/believerregister.component.html');
let bHtmlContent = fs.readFileSync(bHtml, 'utf8').replace(/\r\n/g, '\n');
if (!bHtmlContent.includes('formControlName="state_id"')) {
  bHtmlContent = bHtmlContent.replace('Residential Address in AP', 'Residential Address');
  const bDistrictTarget = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select Districts<span`;
  const bStateInsert = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">రాష్ట్రం / State <span
                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                                    <select class="form-control" formControlName="state_id"
                                                        (change)="onStateChange($event);"
                                                        style="height:37px;width: 273px;">
                                                        <option value="1">ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)</option>
                                                        <option value="2">తెలంగాణ (Telangana - TG)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select Districts<span`;
  bHtmlContent = bHtmlContent.replace(bDistrictTarget, bStateInsert);
  fs.writeFileSync(bHtml, bHtmlContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('[OK] Updated believerregister.component.html');
}

// 2. Pastor Register TS
const pTs = path.join(__dirname, '../src/app/jesus/pastorregister/pastorregister.component.ts');
let pTsContent = fs.readFileSync(pTs, 'utf8').replace(/\r\n/g, '\n');
if (!pTsContent.includes('states: any = [];')) {
  pTsContent = pTsContent.replace('  districts: any;', '  states: any = [];\n  districts: any;');
}
if (!pTsContent.includes("state_id: ['1'")) {
  pTsContent = pTsContent.replace(
    "district_id: ['', [Validators.required]],",
    "state_id: ['1', [Validators.required]],\n      district_id: ['', [Validators.required]],"
  );
}
if (!pTsContent.includes('this.getstates();')) {
  pTsContent = pTsContent.replace(
    'this.getdistric();',
    'this.getstates();\n    this.getdistric(1);'
  );
}
if (!pTsContent.includes('onStateChange(event: any)')) {
  const pMethods = `getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res?.data || [
        { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
        { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
      ];
    });
  }

  onStateChange(event: any) {
    const stateId = event?.target?.value || event || '1';
    this.pastorform.patchValue({
      district_id: '',
      constituency_id: '',
      mandal_id: '',
      panchayat_id: ''
    });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.getdistric(stateId);
  }

  getdistric(stateId?: any) {
    this.showSpinner = true;
    const sid = stateId || this.pastorform.get('state_id')?.value || 1;
    this.service.getdistrict(sid).subscribe(`;
  pTsContent = pTsContent.replace(/getdistric\(\)\s*\{\s*this\.showSpinner\s*=\s*true;\s*this\.service\.getdistrict\(\)\.subscribe\(/, pMethods);
}
if (!pTsContent.includes('state_id: stateIdVal')) {
  pTsContent = pTsContent.replace(
    'const formVal = this.pastorform.value;\n      const payload = {',
    `const formVal = this.pastorform.value;
      const stateIdVal = Number(formVal.state_id) || 1;
      const payload = {
        state_id: stateIdVal,
        state: stateIdVal === 2 ? 'Telangana' : 'Andhra Pradesh',`
  );
}
fs.writeFileSync(pTs, pTsContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('[OK] Updated pastorregister.component.ts');

// Pastor Register HTML
const pHtml = path.join(__dirname, '../src/app/jesus/pastorregister/pastorregister.component.html');
let pHtmlContent = fs.readFileSync(pHtml, 'utf8').replace(/\r\n/g, '\n');
if (!pHtmlContent.includes('formControlName="state_id"')) {
  const pDistrictTarget = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">జిల్లా ఎంచుకోండి<span`;
  const pStateInsert = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">రాష్ట్రం / State <span
                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                                    <select class="form-control" formControlName="state_id"
                                                        (change)="onStateChange($event);"
                                                        style="height:37px;width: 273px;">
                                                        <option value="1">ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)</option>
                                                        <option value="2">తెలంగాణ (Telangana - TG)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">జిల్లా ఎంచుకోండి<span`;
  pHtmlContent = pHtmlContent.replace(pDistrictTarget, pStateInsert);
  fs.writeFileSync(pHtml, pHtmlContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('[OK] Updated pastorregister.component.html');
}

// 3. Church Register TS
const cTs = path.join(__dirname, '../src/app/jesus/churchregister/churchregister.component.ts');
let cTsContent = fs.readFileSync(cTs, 'utf8').replace(/\r\n/g, '\n');
if (!cTsContent.includes('states: any = [];')) {
  cTsContent = cTsContent.replace('  districts: any;', '  states: any = [];\n  districts: any;');
}
if (!cTsContent.includes("state_id: ['1'")) {
  cTsContent = cTsContent.replace(
    "total_members: ['', [Validators.required]],",
    "total_members: ['', [Validators.required]],\n      state_id: ['1', [Validators.required]],"
  );
}
if (!cTsContent.includes('this.getstates();')) {
  cTsContent = cTsContent.replace(
    'this.getdistric();',
    'this.getstates();\n    this.getdistric(1);'
  );
}
if (!cTsContent.includes('onStateChange(event: any)')) {
  const cMethods = `getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res?.data || [
        { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
        { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
      ];
    });
  }

  onStateChange(event: any) {
    const stateId = event?.target?.value || event || '1';
    this.churchregsiterform.patchValue({
      district_id: '',
      constituency_id: '',
      mandal_id: '',
      village_id: ''
    });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.getdistric(stateId);
  }

  getdistric(stateId?: any) {
    this.showSpinner = true;
    const sid = stateId || this.churchregsiterform.get('state_id')?.value || 1;
    this.service.getdistrict(sid).subscribe(`;
  cTsContent = cTsContent.replace(/getdistric\(\)\s*\{\s*this\.showSpinner\s*=\s*true;\s*this\.service\.getdistrict\(\)\.subscribe\(/, cMethods);
}
if (!cTsContent.includes('state_id: stateIdVal')) {
  cTsContent = cTsContent.replace(
    'this.service.postchurchregister(this.churchregsiterform.value).subscribe(',
    `const stateIdVal = Number(this.churchregsiterform.value?.state_id) || 1;
      const payload = {
        ...this.churchregsiterform.value,
        state_id: stateIdVal,
        state: stateIdVal === 2 ? 'Telangana' : 'Andhra Pradesh'
      };
      this.service.postchurchregister(payload).subscribe(`
  );
}
fs.writeFileSync(cTs, cTsContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('[OK] Updated churchregister.component.ts');

// Church Register HTML
const cHtml = path.join(__dirname, '../src/app/jesus/churchregister/churchregister.component.html');
let cHtmlContent = fs.readFileSync(cHtml, 'utf8').replace(/\r\n/g, '\n');
if (!cHtmlContent.includes('formControlName="state_id"')) {
  const cDistrictTarget = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select District <span`;
  const cStateInsert = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">రాష్ట్రం / State <span
                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                                    <select class="form-control" formControlName="state_id"
                                                        (change)="onStateChange($event);"
                                                        style="height:37px;width: 273px;">
                                                        <option value="1">ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)</option>
                                                        <option value="2">తెలంగాణ (Telangana - TG)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select District <span`;
  cHtmlContent = cHtmlContent.replace(cDistrictTarget, cStateInsert);
  fs.writeFileSync(cHtml, cHtmlContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('[OK] Updated churchregister.component.html');
}

// 4. Ministry Register TS
const mTs = path.join(__dirname, '../src/app/jesus/ministryregister/ministryregister.component.ts');
let mTsContent = fs.readFileSync(mTs, 'utf8').replace(/\r\n/g, '\n');
if (!mTsContent.includes('states: any = [];')) {
  mTsContent = mTsContent.replace('  districts: any;', '  states: any = [];\n  districts: any;');
}
if (!mTsContent.includes("state_id: ['1'")) {
  mTsContent = mTsContent.replace(
    "number_ofmembers: ['', [Validators.required]],",
    "number_ofmembers: ['', [Validators.required]],\n      state_id: ['1', [Validators.required]],"
  );
}
if (!mTsContent.includes('this.getstates();')) {
  mTsContent = mTsContent.replace(
    'this.getdistric();',
    'this.getstates();\n    this.getdistric(1);'
  );
}
if (!mTsContent.includes('onStateChange(event: any)')) {
  const mMethods = `getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res?.data || [
        { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
        { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
      ];
    });
  }

  onStateChange(event: any) {
    const stateId = event?.target?.value || event || '1';
    this.ministryform.patchValue({
      district_id: '',
      constituency_id: '',
      mandal_id: '',
      panchayat_id: ''
    });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.getdistric(stateId);
  }

  getdistric(stateId?: any) {
    const sid = stateId || this.ministryform.get('state_id')?.value || 1;
    this.service.getdistrict(sid).subscribe(`;
  mTsContent = mTsContent.replace(/getdistric\(\)\s*\{\s*this\.service\.getdistrict\(\)\.subscribe\(/, mMethods);
}
if (!mTsContent.includes('state_id: stateIdVal')) {
  mTsContent = mTsContent.replace(
    'this.service.postministry(this.ministryform.value).subscribe(',
    `const stateIdVal = Number(this.ministryform.value?.state_id) || 1;
      const payload = {
        ...this.ministryform.value,
        state_id: stateIdVal,
        state: stateIdVal === 2 ? 'Telangana' : 'Andhra Pradesh'
      };
      this.service.postministry(payload).subscribe(`
  );
}
fs.writeFileSync(mTs, mTsContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('[OK] Updated ministryregister.component.ts');

// Ministry Register HTML
const mHtml = path.join(__dirname, '../src/app/jesus/ministryregister/ministryregister.component.html');
let mHtmlContent = fs.readFileSync(mHtml, 'utf8').replace(/\r\n/g, '\n');
if (!mHtmlContent.includes('formControlName="state_id"')) {
  const mDistrictTarget = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select Districts <span`;
  const mStateInsert = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">రాష్ట్రం / State <span
                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                                    <select class="form-control" formControlName="state_id"
                                                        (change)="onStateChange($event);"
                                                        style="height:37px;width: 273px;">
                                                        <option value="1">ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)</option>
                                                        <option value="2">తెలంగాణ (Telangana - TG)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select Districts <span`;
  mHtmlContent = mHtmlContent.replace(mDistrictTarget, mStateInsert);
  fs.writeFileSync(mHtml, mHtmlContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('[OK] Updated ministryregister.component.html');
}

// 5. Organisation Register TS
const oTs = path.join(__dirname, '../src/app/jesus/organisationregister/organisationregister.component.ts');
let oTsContent = fs.readFileSync(oTs, 'utf8').replace(/\r\n/g, '\n');
if (!oTsContent.includes('states: any = [];')) {
  oTsContent = oTsContent.replace('  districts: any;', '  states: any = [];\n  districts: any;');
}
if (!oTsContent.includes("state_id: ['1'")) {
  oTsContent = oTsContent.replace(
    "districts: ['', [Validators.required]],",
    "state_id: ['1', [Validators.required]],\n      districts: ['', [Validators.required]],"
  );
}
if (!oTsContent.includes('this.getstates();')) {
  oTsContent = oTsContent.replace(
    'this.getdistric();',
    'this.getstates();\n    this.getdistric(1);'
  );
}
if (!oTsContent.includes('onStateChange(event: any)')) {
  const oMethods = `getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res?.data || [
        { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
        { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
      ];
    });
  }

  onStateChange(event: any) {
    const stateId = event?.target?.value || event || '1';
    this.independentorgainsationform.patchValue({
      districts: '',
      constituencyname: '',
      mandals: '',
      panchayati: ''
    });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.getdistric(stateId);
  }

  getdistric(stateId?: any) {
    this.showSpinner = true;
    const sid = stateId || this.independentorgainsationform.get('state_id')?.value || 1;
    this.service.getdistrict(sid).subscribe(`;
  oTsContent = oTsContent.replace(/getdistric\(\)\s*\{\s*this\.showSpinner\s*=\s*true;\s*this\.service\.getdistrict\(\)\.subscribe\(/, oMethods);
}
if (!oTsContent.includes('state_id: stateIdVal')) {
  oTsContent = oTsContent.replace(
    'this.service.postindepedentorganisation(this.independentorgainsationform.value).subscribe(',
    `const stateIdVal = Number(this.independentorgainsationform.value?.state_id) || 1;
      const payload = {
        ...this.independentorgainsationform.value,
        district_id: this.independentorgainsationform.value?.districts,
        constituency_id: this.independentorgainsationform.value?.constituencyname,
        mandal_id: this.independentorgainsationform.value?.mandals,
        panchayat_id: this.independentorgainsationform.value?.panchayati,
        state_id: stateIdVal,
        state: stateIdVal === 2 ? 'Telangana' : 'Andhra Pradesh'
      };
      this.service.postindepedentorganisation(payload).subscribe(`
  );
}
fs.writeFileSync(oTs, oTsContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('[OK] Updated organisationregister.component.ts');

// Organisation Register HTML
const oHtml = path.join(__dirname, '../src/app/jesus/organisationregister/organisationregister.component.html');
let oHtmlContent = fs.readFileSync(oHtml, 'utf8').replace(/\r\n/g, '\n');
if (!oHtmlContent.includes('formControlName="state_id"')) {
  const oDistrictTarget = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select Districts<span`;
  const oStateInsert = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">రాష్ట్రం / State <span
                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                                    <select class="form-control" formControlName="state_id"
                                                        (change)="onStateChange($event);"
                                                        style="height:37px;width: 273px;">
                                                        <option value="1">ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)</option>
                                                        <option value="2">తెలంగాణ (Telangana - TG)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select Districts<span`;
  oHtmlContent = oHtmlContent.replace(oDistrictTarget, oStateInsert);
  fs.writeFileSync(oHtml, oHtmlContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('[OK] Updated organisationregister.component.html');
}

// 6. Pastor Association Register TS
const paTs = path.join(__dirname, '../src/app/jesus/pastorassociationregister/pastorassociationregister.component.ts');
let paTsContent = fs.readFileSync(paTs, 'utf8').replace(/\r\n/g, '\n');
if (!paTsContent.includes('states: any = [];')) {
  paTsContent = paTsContent.replace('  districts: any;', '  states: any = [];\n  districts: any;');
}
if (!paTsContent.includes("state_id: ['1'")) {
  paTsContent = paTsContent.replace(
    "district_id: ['', [Validators.required]],",
    "state_id: ['1', [Validators.required]],\n      district_id: ['', [Validators.required]],"
  );
}
if (!paTsContent.includes('this.getstates();')) {
  paTsContent = paTsContent.replace(
    'this.getdistric();',
    'this.getstates();\n    this.getdistric(1);'
  );
}
if (!paTsContent.includes('onStateChange(event: any)')) {
  const paMethods = `getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res?.data || [
        { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
        { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
      ];
    });
  }

  onStateChange(event: any) {
    const stateId = event?.target?.value || event || '1';
    this.pastorsassociations.patchValue({
      district_id: '',
      constituency_id: '',
      mandal_id: '',
      panchayat_id: ''
    });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.getdistric(stateId);
  }

  getdistric(stateId?: any) {
    this.showSpinner = true;
    const sid = stateId || this.pastorsassociations.get('state_id')?.value || 1;
    this.service.getdistrict(sid).subscribe(`;
  paTsContent = paTsContent.replace(/getdistric\(\)\s*\{\s*this\.service\.getdistrict\(\)\.subscribe\(/, paMethods);
}
if (!paTsContent.includes('state_id: stateIdVal')) {
  paTsContent = paTsContent.replace(
    'this.service.postpastorassociationss(this.pastorsassociations.value).subscribe(',
    `const stateIdVal = Number(this.pastorsassociations.value?.state_id) || 1;
      const payload = {
        ...this.pastorsassociations.value,
        state_id: stateIdVal,
        state: stateIdVal === 2 ? 'Telangana' : 'Andhra Pradesh'
      };
      this.service.postpastorassociationss(payload).subscribe(`
  );
}
fs.writeFileSync(paTs, paTsContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('[OK] Updated pastorassociationregister.component.ts');

// Pastor Association Register HTML
const paHtml = path.join(__dirname, '../src/app/jesus/pastorassociationregister/pastorassociationregister.component.html');
let paHtmlContent = fs.readFileSync(paHtml, 'utf8').replace(/\r\n/g, '\n');
if (!paHtmlContent.includes('formControlName="state_id"')) {
  paHtmlContent = paHtmlContent.replace(
    'ఆంధ్రప్రదేశ్ రాష్ట్రంలోని రాష్ట్ర, జిల్లా, నియోజకవర్గ',
    'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ రాష్ట్రాలలోని రాష్ట్ర, జిల్లా, నియోజకవర్గ'
  );
  const paDistrictTarget = `<div class="col-md-6 mb-4 pb-2">
                                                    <div class="form-outline">
                                                        <label class="form-label">1) జిల్లా <span`;
  const paStateInsert = `<div class="col-md-6 mb-4 pb-2">
                                                    <div class="form-outline">
                                                        <label class="form-label">1) రాష్ట్రం / State <span
                                                                style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                                        <select class="form-control" formControlName="state_id"
                                                            (change)="onStateChange($event);"
                                                            style="height:37px;width: 273px;">
                                                            <option value="1">ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)</option>
                                                            <option value="2">తెలంగాణ (Telangana - TG)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 mb-4 pb-2">
                                                    <div class="form-outline">
                                                        <label class="form-label">2) జిల్లా <span`;
  paHtmlContent = paHtmlContent.replace(paDistrictTarget, paStateInsert);
  paHtmlContent = paHtmlContent.replace('2) నియోజకవర్గం', '3) నియోజకవర్గం');
  paHtmlContent = paHtmlContent.replace('3) మండలం / మున్సిపాలిటీ', '4) మండలం / మున్సిపాలిటీ');
  paHtmlContent = paHtmlContent.replace('4) పంచాయతీ / వార్డ్ నంబర్', '5) పంచాయతీ / వార్డ్ నంబర్');
  fs.writeFileSync(paHtml, paHtmlContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('[OK] Updated pastorassociationregister.component.html');
}

// 7. Doctor Register
const dTs = path.join(__dirname, '../src/app/jesus/doctorregister/doctorregister.component.ts');
let dTsContent = fs.readFileSync(dTs, 'utf8').replace(/\r\n/g, '\n');
if (!dTsContent.includes("state_id: ['1'")) {
  dTsContent = dTsContent.replace(
    "location: ['Vijayawada & Online Consultation', [Validators.required]],",
    "state_id: ['1', [Validators.required]],\n      state: ['Andhra Pradesh'],\n      location: ['Vijayawada & Online Consultation', [Validators.required]],"
  );
  fs.writeFileSync(dTs, dTsContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('[OK] Updated doctorregister.component.ts');
}

const dHtml = path.join(__dirname, '../src/app/jesus/doctorregister/doctorregister.component.html');
let dHtmlContent = fs.readFileSync(dHtml, 'utf8').replace(/\r\n/g, '\n');
if (!dHtmlContent.includes('formControlName="state_id"')) {
  const dLocationTarget = `<!-- Location / City -->
              <div class="col-md-6">`;
  const dStateInsert = `<!-- State -->
              <div class="col-md-6">
                <label class="form-label fw-bold small text-dark">రాష్ట్రం (State) <span class="text-danger">*</span></label>
                <select class="form-select" formControlName="state_id">
                  <option value="1">ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)</option>
                  <option value="2">తెలంగాణ (Telangana - TG)</option>
                </select>
              </div>

              <!-- Location / City -->
              <div class="col-md-6">`;
  dHtmlContent = dHtmlContent.replace(dLocationTarget, dStateInsert);
  fs.writeFileSync(dHtml, dHtmlContent.replace(/\n/g, '\r\n'), 'utf8');
  console.log('[OK] Updated doctorregister.component.html');
}

console.log('--- All Registration Forms Updated Successfully! ---');
