const fs = require('fs');
const path = require('path');

// 1. Update entry.component.ts
const tsPath = path.join(__dirname, '../src/app/jesus/entry/entry.component.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8').replace(/\r\n/g, '\n');

if (!tsContent.includes('states: any = [];')) {
  tsContent = tsContent.replace(
    '  districts: any;',
    '  states: any = [];\n  districts: any;'
  );
}

if (!tsContent.includes("state_id: ['1'")) {
  tsContent = tsContent.replace(
    "name: ['', [Validators.required]],",
    "name: ['', [Validators.required]],\n      state_id: ['1', [Validators.required]],"
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
      this.states = res?.data || [
        { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP' },
        { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG' }
      ];
    });
  }

  onStateChange(event: any) {
    const stateId = event?.target?.value || '1';
    this.entryform.patchValue({
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
    const sid = stateId || this.entryform.get('state_id')?.value || 1;
    this.service.getdistrict(sid).subscribe(`;

  tsContent = tsContent.replace(
    /getdistric\(\)\s*\{\s*this\.showSpinner\s*=\s*true;\s*this\.service\.getdistrict\(\)\.subscribe\(/,
    newMethods
  );
}

// Update payload to include state_id and state
if (!tsContent.includes('state_id: stateIdVal')) {
  tsContent = tsContent.replace(
    'this.service.postregform(this.entryform.value).subscribe(',
    `const stateIdVal = Number(this.entryform.value?.state_id) || 1;
    const stateNameVal = stateIdVal === 2 ? 'Telangana' : 'Andhra Pradesh';
    const payload = {
      ...this.entryform.value,
      state_id: stateIdVal,
      state: stateNameVal
    };
    this.service.postregform(payload).subscribe(`
  );
}

// Update reset
if (!tsContent.includes("state_id: '1',")) {
  tsContent = tsContent.replace(
    "denomation: '',",
    "denomation: '',\n            state_id: '1',"
  );
}

fs.writeFileSync(tsPath, tsContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('entry.component.ts updated successfully!');

// 2. Update entry.component.html
const htmlPath = path.join(__dirname, '../src/app/jesus/entry/entry.component.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8').replace(/\r\n/g, '\n');

if (!htmlContent.includes('formControlName="state_id"')) {
  htmlContent = htmlContent.replace(
    'మీ అడ్రస్<br>ముందు జిల్లా సెలెక్ట్ చేసిన తరువాత\n                                                నియోజకవర్గము తరువాత మండలం, పంచాయితీ సెలెక్ట్ చేయాలి',
    'మీ అడ్రస్<br>ముందు రాష్ట్రం, జిల్లా సెలెక్ట్ చేసిన తరువాత\n                                                నియోజకవర్గము తరువాత మండలం, పంచాయితీ సెలెక్ట్ చేయాలి'
  );

  const districtBlock = `<div class="col-md-6 mb-4 pb-2">
                                                    <div class="form-outline">
                                                        <label class="form-label">1) జిల్లా`;

  const stateAndDistrictBlock = `<div class="col-md-6 mb-4 pb-2">
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
                                                        <label class="form-label">2) జిల్లా`;

  if (htmlContent.includes(districtBlock)) {
    htmlContent = htmlContent.replace(districtBlock, stateAndDistrictBlock);
    htmlContent = htmlContent.replace('2) నియోజకవర్గం', '3) నియోజకవర్గం');
    htmlContent = htmlContent.replace('3) మండలం / మున్సిపాలిటీ', '4) మండలం / మున్సిపాలిటీ');
    htmlContent = htmlContent.replace('4). పంచాయితీ / వార్డ్ నంబర్', '5) పంచాయితీ / వార్డ్ నంబర్');
    console.log('entry.component.html updated with state selector successfully!');
  } else {
    console.error('Could not find district block in entry.component.html');
  }
}

fs.writeFileSync(htmlPath, htmlContent.replace(/\n/g, '\r\n'), 'utf8');
console.log('All entry updates complete!');
