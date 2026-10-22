const fs = require('fs');
const path = require('path');

// 1. Update studentregister.component.ts
const tsPath = path.join(__dirname, '../src/app/jesus/studentregister/studentregister.component.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8').replace(/\r\n/g, '\n');

if (!tsContent.includes('states: any = [')) {
  tsContent = tsContent.replace(
    '  districts: any;',
    `  states: any = [
    { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
    { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
  ];
  districts: any;`
  );
}

if (!tsContent.includes("state_id: ['1']")) {
  tsContent = tsContent.replace(
    "district_id: [''],",
    "state_id: ['1'],\n      district_id: [''],"
  );
}

if (!tsContent.includes("res_state_id: ['1']")) {
  tsContent = tsContent.replace(
    "resdistricts: ['', [Validators.required]],",
    "res_state_id: ['1'],\n      resdistricts: ['', [Validators.required]],"
  );
}

if (!tsContent.includes('this.getstates();')) {
  tsContent = tsContent.replace(
    '    this.getdistric();',
    '    this.getstates();\n    this.getdistric(1);'
  );
}

if (!tsContent.includes('onStateChange(event: any)')) {
  const newMethods = `getstates() {
    this.service.getstates().subscribe((res: any) => {
      if (res && res.data) {
        this.states = res.data;
      }
    });
  }

  onStateChange(event: any) {
    const stateId = event?.target?.value || '1';
    this.studentform.patchValue({
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

  onResStateChange(event: any) {
    const stateId = event?.target?.value || '1';
    this.studentform.patchValue({
      resdistricts: '',
      resconstituencyname: '',
      resmandals: '',
      respanchayati: ''
    });
    this.constituency1 = [];
    this.mandals1 = [];
    this.panchayati1 = [];
    this.getdistric(stateId);
  }

  getdistric(stateId?: any) {
    this.showSpinner = true;
    const sid = stateId || this.studentform.get('state_id')?.value || 1;
    this.service.getdistrict(sid).subscribe(`;

  tsContent = tsContent.replace(
    /getdistric\(\)\s*\{\s*this\.showSpinner\s*=\s*true;\s*this\.service\.getdistrict\(\)\.subscribe\(/,
    newMethods
  );
}

// Update payload in poststudentsignup
if (!tsContent.includes('state_id: stateIdVal')) {
  tsContent = tsContent.replace(
    '    const payload = {',
    `    const stateIdVal = Number(this.studentform.value?.state_id) || 1;
    const stateNameVal = stateIdVal === 2 ? 'Telangana' : 'Andhra Pradesh';
    const payload = {
      state_id: stateIdVal,
      state: stateNameVal,`
  );
}

fs.writeFileSync(tsPath, tsContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('studentregister.component.ts updated successfully!');

// 2. Update studentregister.component.html
const htmlPath = path.join(__dirname, '../src/app/jesus/studentregister/studentregister.component.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8').replace(/\r\n/g, '\n');

// College/School Address State
if (!htmlContent.includes('formControlName="state_id"')) {
  const schoolDistrictBlock = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select District<span
                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span>
                                                    </label>
                                                    <select class="form-control" formControlName="district_id"`;

  const schoolStateAndDistrictBlock = `<div class="col-md-6 mb-4 pb-2">
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
                                                    <label class="form-label">Select District<span
                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span>
                                                    </label>
                                                    <select class="form-control" formControlName="district_id"`;

  if (htmlContent.includes(schoolDistrictBlock)) {
    htmlContent = htmlContent.replace(schoolDistrictBlock, schoolStateAndDistrictBlock);
    console.log('Added school state dropdown in studentregister.component.html');
  } else {
    console.error('Could not find school district block in studentregister.component.html');
  }
}

// Residential Address State
if (!htmlContent.includes('formControlName="res_state_id"')) {
  const resDistrictBlock = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select District<span
                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span>
                                                    </label>
                                                    <select class="form-control" formControlName="resdistricts"`;

  const resStateAndDistrictBlock = `<div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">రాష్ట్రం / State <span
                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                                    <select class="form-control" formControlName="res_state_id"
                                                        (change)="onResStateChange($event);"
                                                        style="height:37px;width: 273px;">
                                                        <option value="1">ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)</option>
                                                        <option value="2">తెలంగాణ (Telangana - TG)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-4 pb-2">
                                                <div class="form-outline">
                                                    <label class="form-label">Select District<span
                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span>
                                                    </label>
                                                    <select class="form-control" formControlName="resdistricts"`;

  if (htmlContent.includes(resDistrictBlock)) {
    htmlContent = htmlContent.replace(resDistrictBlock, resStateAndDistrictBlock);
    console.log('Added residential state dropdown in studentregister.component.html');
  } else {
    console.error('Could not find residential district block in studentregister.component.html');
  }
}

fs.writeFileSync(htmlPath, htmlContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('All studentregister updates complete!');
