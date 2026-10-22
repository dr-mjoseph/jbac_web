const fs = require('fs');
const path = require('path');

const appRoot = 'c:/Users/rajes/StudioProjects/jbac_app';

// 1. Update service.ts in mobile app
const servicePath = path.join(appRoot, 'src/providers/service/service.ts');
let serviceContent = fs.readFileSync(servicePath, 'utf8').replace(/\r\n/g, '\n');

if (!serviceContent.includes('getstates()')) {
  const target = `  getdistrict() {\n    return this.http.post(this.testApi + 'getdistricts', []);\n  }`;
  const replacement = `  getstates() {
    return this.http.post(this.testApi + 'getstates', {});
  }

  getdistrict(stateId?: any) {
    const payload = (stateId !== undefined && stateId !== null && stateId !== '' && stateId !== 'all') ? { state_id: stateId } : {};
    return this.http.post(this.testApi + 'getdistricts', payload);
  }`;

  if (serviceContent.includes(target)) {
    serviceContent = serviceContent.replace(target, replacement);
    console.log('1. Updated service.ts with getstates and getdistrict(stateId)');
  } else {
    // If target formatting differed slightly, replace getdistrict definition
    serviceContent = serviceContent.replace(
      /getdistrict\(\)\s*\{\s*return this\.http\.post\(this\.testApi \+ 'getdistricts',\s*\[\]\);\s*\}/,
      replacement
    );
    console.log('1. Replaced getdistrict with regex in service.ts');
  }
  fs.writeFileSync(servicePath, serviceContent.replace(/\n/g, '\r\n'), 'utf8');
}

// 2. Update entry-form.ts in mobile app
const entryTsPath = path.join(appRoot, 'src/pages/entry-form/entry-form.ts');
let entryTs = fs.readFileSync(entryTsPath, 'utf8').replace(/\r\n/g, '\n');

if (!entryTs.includes('states: any =')) {
  entryTs = entryTs.replace(
    '  districts: any;',
    `  states: any = [
    { id: 1, state_name: 'ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)' },
    { id: 2, state_name: 'తెలంగాణ (Telangana - TG)' }
  ];
  districts: any;`
  );

  entryTs = entryTs.replace(
    "district_id: ['', Validators.required],",
    "state_id: ['1', Validators.required],\n      district_id: ['', Validators.required],"
  );

  entryTs = entryTs.replace(
    '    this.getdistric();',
    '    this.getstates();\n    this.getdistric(1);'
  );

  const newMethods = `  getstates() {
    this.service.getstates().subscribe((res: any) => {
      if (res && res.data) {
        this.states = res.data;
      }
    });
  }

  onStateChange(event: any) {
    this.form.patchValue({
      district_id: '',
      constituency_id: '',
      mandal_id: '',
      village_id: ''
    });
    this.constituency = [];
    this.mandals = [];
    this.getvillages = [];
    this.getdistric(event);
  }

  getdistric(stateId?: any) {
    const sid = stateId || this.form.get('state_id')?.value || 1;
    this.service.getdistrict(sid).subscribe((res: any) => {
      this.districts = res.data;
    });
  }`;

  entryTs = entryTs.replace(
    /getdistric\(\)\s*\{\s*this\.service\.getdistrict\(\)\.subscribe\(\(res:\s*any\)\s*=>\s*\{\s*this\.districts\s*=\s*res\.data;\s*\}\)\s*\}/,
    newMethods
  );

  fs.writeFileSync(entryTsPath, entryTs.replace(/\n/g, '\r\n'), 'utf8');
  console.log('2. Updated entry-form.ts with states and onStateChange');
}

// 3. Update entry-form.html in mobile app
const entryHtmlPath = path.join(appRoot, 'src/pages/entry-form/entry-form.html');
let entryHtml = fs.readFileSync(entryHtmlPath, 'utf8').replace(/\r\n/g, '\n');

if (!entryHtml.includes('formControlName="state_id"')) {
  const target = `<ion-col col-12>
        <h4 Style="color:whitesmoke;text-align: center;font-weight: 600;">మీ అడ్రస్</h4>
        <ion-item>
          <ion-label stacked>జిల్లా</ion-label>`;

  const replacement = `<ion-col col-12>
        <h4 Style="color:whitesmoke;text-align: center;font-weight: 600;">మీ అడ్రస్</h4>
        <ion-item>
          <ion-label stacked>రాష్ట్రం / State</ion-label>
          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
            <ion-option *ngFor="let s of states" [value]="s.id">{{s.state_name}}</ion-option>
          </ion-select>
        </ion-item>
      </ion-col>

      <ion-col col-12>
        <ion-item>
          <ion-label stacked>జిల్లా</ion-label>`;

  if (entryHtml.includes(target)) {
    entryHtml = entryHtml.replace(target, replacement);
    fs.writeFileSync(entryHtmlPath, entryHtml.replace(/\n/g, '\r\n'), 'utf8');
    console.log('3. Updated entry-form.html with state select');
  } else {
    console.error('Could not find address target in entry-form.html');
  }
}

// 4. Update student.ts in mobile app
const studentTsPath = path.join(appRoot, 'src/pages/student/student.ts');
let studentTs = fs.readFileSync(studentTsPath, 'utf8').replace(/\r\n/g, '\n');

if (!studentTs.includes('states: any =')) {
  studentTs = studentTs.replace(
    '  districts: any;',
    `  states: any = [
    { id: 1, state_name: 'ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)' },
    { id: 2, state_name: 'తెలంగాణ (Telangana - TG)' }
  ];
  districts: any;`
  );

  studentTs = studentTs.replace(
    "district_id: ['', [Validators.required]],",
    "state_id: ['1'],\n      district_id: ['', [Validators.required]],"
  );

  studentTs = studentTs.replace(
    "resdistricts: ['', [Validators.required]],",
    "res_state_id: ['1'],\n      resdistricts: ['', [Validators.required]],"
  );

  // Add methods
  const methods = `  getstates() {
    this.service.getstates().subscribe((res: any) => {
      if (res && res.data) {
        this.states = res.data;
      }
    });
  }

  onStateChange(event: any) {
    this.studentform.patchValue({
      district_id: '',
      constituency_id: '',
      mandal_id: '',
      village_id: ''
    });
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    this.getdistric(event);
  }

  onResStateChange(event: any) {
    this.studentform.patchValue({
      resdistricts: '',
      resconstituencyname: '',
      resmandals: '',
      respanchayati: ''
    });
    this.constituency1 = [];
    this.mandals1 = [];
    this.panchayati1 = [];
    this.getdistric(event);
  }

  getdistric(stateId?: any) {
    const sid = stateId || this.studentform.get('state_id')?.value || 1;
    this.service.getdistrict(sid).subscribe((res: any) => {
      this.districts = res.data;
    });
  }`;

  if (studentTs.includes('getdistric() {')) {
    studentTs = studentTs.replace(/getdistric\(\)\s*\{[^}]+\}/, methods);
  } else {
    studentTs = studentTs.replace('ngOnInit() {', `${methods}\n\n  ngOnInit() {`);
  }

  fs.writeFileSync(studentTsPath, studentTs.replace(/\n/g, '\r\n'), 'utf8');
  console.log('4. Updated student.ts with state methods');
}

// 5. Update student.html in mobile app
const studentHtmlPath = path.join(appRoot, 'src/pages/student/student.html');
let studentHtml = fs.readFileSync(studentHtmlPath, 'utf8').replace(/\r\n/g, '\n');

if (!studentHtml.includes('formControlName="state_id"')) {
  // Add School/College state select
  const schoolTarget = `<ion-select formControlName="district_id" (ionChange)="getconstency($event);">`;
  const schoolReplacement = `<ion-item>
            <ion-label stacked>రాష్ట్రం / State (కళాశాల/పాఠశాల)</ion-label>
            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
              <ion-option *ngFor="let s of states" [value]="s.id">{{s.state_name}}</ion-option>
            </ion-select>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-12>
          <ion-item>
            <ion-label stacked>జిల్లా ని ఎంచుకోండి<span style="color:red">*</span></ion-label>
            <ion-select formControlName="district_id" (ionChange)="getconstency($event);">`;

  // Check if we can insert before district_id row
  if (studentHtml.includes(schoolTarget)) {
    studentHtml = studentHtml.replace(
      `<ion-item>\n            <ion-label stacked>జిల్లా ని ఎంచుకోండి<span style="color:red">*</span></ion-label>\n            <ion-select formControlName="district_id"`,
      schoolReplacement
    );
    console.log('5a. Added school state selector in student.html');
  }

  // Add Residential state select
  const resTarget = `<ion-select formControlName="resdistricts" (ionChange)="getconstency1($event)">`;
  const resReplacement = `<ion-item>
            <ion-label stacked>రాష్ట్రం / State (నివాసం)</ion-label>
            <ion-select formControlName="res_state_id" (ionChange)="onResStateChange($event)">
              <ion-option *ngFor="let s of states" [value]="s.id">{{s.state_name}}</ion-option>
            </ion-select>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-12>
          <ion-item>
            <ion-label stacked>జిల్లా ని ఎంచుకోండి<span style="color:red">*</span></ion-label>
            <ion-select formControlName="resdistricts" (ionChange)="getconstency1($event)">`;

  if (studentHtml.includes(resTarget)) {
    studentHtml = studentHtml.replace(
      `<ion-item>\n            <ion-label stacked>జిల్లా ని ఎంచుకోండి<span style="color:red">*</span></ion-label>\n            <ion-select formControlName="resdistricts"`,
      resReplacement
    );
    console.log('5b. Added residential state selector in student.html');
  }

  fs.writeFileSync(studentHtmlPath, studentHtml.replace(/\n/g, '\r\n'), 'utf8');
}

console.log('All mobile app updates applied successfully!');
