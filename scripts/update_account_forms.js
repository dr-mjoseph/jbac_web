const fs = require('fs');

console.log('=== Updating Account Submission Forms & Profile Update ===');

// ==========================================
// 1. ADDCHURCHTIMINGS
// ==========================================
{
    const tsFile = 'src/app/jesus/addchurchtimings/addchurchtimings.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['1'")) {
        ts = ts.replace("district_id: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],\n      district_id: ['', [Validators.required]],");
    }
    if (!ts.includes('onStateChange(event: any)')) {
        const methods = `
  states: any = [];
  getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res.data;
    });
  }

  onStateChange(event: any) {
    const stateId = event && event.target ? event.target.value : event;
    this.addingchurchtimimngs.patchValue({ district_id: '', constituency_id: '', mandal_id: '' });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    if (stateId) {
      this.service.getdistrict(stateId).subscribe(res => {
        if (res && res.status == 200) {
          this.districts = res.data;
        }
      });
    }
  }
`;
        ts = ts.replace('getdistric() {', methods + '\n  getdistric() {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    ts = ts.replace('this.service.getdistrict().subscribe(res => {', 'this.service.getdistrict(1).subscribe(res => {');
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/addchurchtimings/addchurchtimings.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateBlock = `                                            <div class="col-md-6 mb-4 pb-2">
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
                                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="district_id"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateBlock + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated addchurchtimings.component.html');
        }
    }
    console.log('Updated Addchurchtimings');
}

// ==========================================
// 2. ADDINSTITUTE
// ==========================================
{
    const tsFile = 'src/app/jesus/addinstitute/addinstitute.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['1'")) {
        ts = ts.replace("district_id: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],\n      district_id: ['', [Validators.required]],");
    }
    if (!ts.includes('onStateChange(event: any)')) {
        const methods = `
  states: any = [];
  getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res.data;
    });
  }

  onStateChange(event: any) {
    const stateId = event && event.target ? event.target.value : event;
    this.addinginsututies.patchValue({ district_id: '', constituency_id: '', mandal_id: '', village_name: '' });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    if (stateId) {
      this.service.getdistrict(stateId).subscribe(res => {
        if (res && res.status == 200) {
          this.districts = res.data;
        }
      });
    }
  }
`;
        ts = ts.replace('getdistric() {', methods + '\n  getdistric() {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    ts = ts.replace('this.service.getdistrict().subscribe(res => {', 'this.service.getdistrict(1).subscribe(res => {');
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/addinstitute/addinstitute.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateBlock = `                                                <div class="col-md-6 mb-4 pb-2">
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
                                                </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="district_id"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateBlock + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated addinstitute.component.html');
        }
    }
    console.log('Updated Addinstitute');
}

// ==========================================
// 3. ADDBUSINESS
// ==========================================
{
    const tsFile = 'src/app/jesus/addbusiness/addbusiness.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['1'")) {
        ts = ts.replace("districtname: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],\n      districtname: ['', [Validators.required]],");
    }
    if (!ts.includes('onStateChange(event: any)')) {
        const methods = `
  states: any = [];
  getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res.data;
    });
  }

  onStateChange(event: any) {
    const stateId = event && event.target ? event.target.value : event;
    this.addingbusiness.patchValue({ districtname: '', constituencyname: '', mandals: '', village_name: '' });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    if (stateId) {
      this.service.getdistrict(stateId).subscribe(res => {
        if (res && res.status == 200) {
          this.districts = res.data;
        }
      });
    }
  }
`;
        ts = ts.replace('getdistric() {', methods + '\n  getdistric() {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    ts = ts.replace('this.service.getdistrict().subscribe(res => {', 'this.service.getdistrict(1).subscribe(res => {');
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/addbusiness/addbusiness.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateBlock = `                                            <div class="col-md-6 mb-4 pb-2">
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
                                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="districtname"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateBlock + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated addbusiness.component.html');
        }
    }
    console.log('Updated Addbusiness');
}

// ==========================================
// 4. ADDMARRIAGES
// ==========================================
{
    const tsFile = 'src/app/jesus/addmarriages/addmarriages.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['1'")) {
        ts = ts.replace("districtname: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],\n      districtname: ['', [Validators.required]],");
    }
    if (!ts.includes('onStateChange(event: any)')) {
        const methods = `
  states: any = [];
  getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res.data;
    });
  }

  onStateChange(event: any) {
    const stateId = event && event.target ? event.target.value : event;
    this.addingmarriages.patchValue({ districtname: '', constituencyname: '', mandals: '', village_name: '' });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    if (stateId) {
      this.service.getdistrict(stateId).subscribe(res => {
        if (res && res.status == 200) {
          this.districts = res.data;
        }
      });
    }
  }
`;
        ts = ts.replace('getdistric() {', methods + '\n  getdistric() {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    ts = ts.replace('this.service.getdistrict().subscribe(res => {', 'this.service.getdistrict(1).subscribe(res => {');
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/addmarriages/addmarriages.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateBlock = `                                            <div class="col-md-6 mb-4 pb-2">
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
                                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="districtname"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateBlock + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated addmarriages.component.html');
        }
    }
    console.log('Updated Addmarriages');
}

// ==========================================
// 5. ADDJOBS
// ==========================================
{
    const tsFile = 'src/app/jesus/addjobs/addjobs.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['1'")) {
        ts = ts.replace("districtname: ['', [Validators.required]],", "state_id: ['1', [Validators.required]],\n      districtname: ['', [Validators.required]],");
    }
    if (!ts.includes('onStateChange(event: any)')) {
        const methods = `
  states: any = [];
  getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res.data;
    });
  }

  onStateChange(event: any) {
    const stateId = event && event.target ? event.target.value : event;
    this.jobsadding.patchValue({ districtname: '', constituencyname: '', mandals: '', village_name: '' });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    if (stateId) {
      this.service.getdistrict(stateId).subscribe(res => {
        if (res && res.status == 200) {
          this.districts = res.data;
        }
      });
    }
  }
`;
        ts = ts.replace('getdistric() {', methods + '\n  getdistric() {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    ts = ts.replace('this.service.getdistrict().subscribe(res => {', 'this.service.getdistrict(1).subscribe(res => {');
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/addjobs/addjobs.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateBlock = `                                            <div class="col-md-6 mb-4 pb-2">
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
                                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="districtname"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateBlock + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated addjobs.component.html');
        }
    }
    console.log('Updated Addjobs');
}

// ==========================================
// 6. UPDATE (Profile Update)
// ==========================================
{
    const tsFile = 'src/app/jesus/update/update.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');

    // Add state_id to forms in constructor
    const formsToUpdate = [
        "this.pastorform = this.formBuilder.group({",
        "this.churchregsiterform = this.formBuilder.group({",
        "this.updateprofileministry = this.formBuilder.group({",
        "this.beliverform = this.formBuilder.group({",
        "this.studentform = this.formBuilder.group({",
        "this.independentorgainsationform = this.formBuilder.group({",
        "this.pastorsassociations = this.formBuilder.group({",
        "this.doctorform = this.formBuilder.group({",
        "this.entryform = this.formBuilder.group({"
    ];

    for (const f of formsToUpdate) {
        if (ts.includes(f) && !ts.includes(f + "\n      state_id: ['1'],")) {
            ts = ts.replace(f, f + "\n      state_id: ['1'],");
        }
    }

    if (!ts.includes('onStateChange(event: any)')) {
        const methods = `
  states: any = [];
  getstates() {
    this.service.getstates().subscribe((res: any) => {
      this.states = res.data;
    });
  }

  onStateChange(event: any) {
    const stateId = event && event.target ? event.target.value : event;
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    this.panchayati = [];
    if (stateId) {
      this.service.getdistrict(stateId).subscribe(res => {
        if (res && res.status == 200) {
          this.districts = res.data;
        }
      });
    }
  }
`;
        ts = ts.replace('getdistric() {', methods + '\n  getdistric() {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    ts = ts.replace('this.service.getdistrict().subscribe(res => {', 'this.service.getdistrict(1).subscribe(res => {');

    // Patch state_id in geteditdtails()
    if (!ts.includes('state_id: this.details.state_id')) {
        ts = ts.replace(
            'district_id: this.details.district_id,',
            'state_id: this.details.state_id ? String(this.details.state_id) : "1",\n        district_id: this.details.district_id,'
        );
    }

    fs.writeFileSync(tsFile, ts, 'utf8');

    // Update update.component.html
    const htmlFile = 'src/app/jesus/update/update.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateBlock = `                                            <div class="col-md-6 mb-4 pb-2">
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
                                            </div>\n`;

    // Insert stateBlock before each district select in update.component.html
    const selectMatches = [
        '<select class="form-control" formControlName="districts"',
        '<select class="form-control" formControlName="district_id"'
    ];

    let searchStart = 0;
    while (true) {
        let foundIdx = -1;
        let matchedTag = '';
        for (const tag of selectMatches) {
            const idx = html.indexOf(tag, searchStart);
            if (idx !== -1 && (foundIdx === -1 || idx < foundIdx)) {
                foundIdx = idx;
                matchedTag = tag;
            }
        }
        if (foundIdx === -1) break;

        const preCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', foundIdx);
        if (preCol !== -1 && !html.substring(Math.max(0, preCol - 400), preCol).includes('formControlName="state_id"')) {
            html = html.substring(0, preCol) + stateBlock + html.substring(preCol);
            searchStart = foundIdx + stateBlock.length + matchedTag.length;
            console.log('Inserted state dropdown in update.component.html at index', preCol);
        } else {
            searchStart = foundIdx + matchedTag.length;
        }
    }
    fs.writeFileSync(htmlFile, html, 'utf8');
    console.log('Updated Update Profile');
}

console.log('=== All Account Submission Forms Updated! ===');
