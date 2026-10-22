const fs = require('fs');

console.log('=== Updating Services Search & Filter Pages ===');

// ==========================================
// 1. INSTITUTE
// ==========================================
{
    const tsFile = 'src/app/jesus/institute/institute.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['']")) {
        ts = ts.replace("district_id: [''],", "state_id: [''],\n      district_id: [''],");
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
    this.searchdist = '';
    this.searchconts = '';
    this.searchmand = '';
    this.serachMeetingform.patchValue({ state_id: stateId, district_id: '', constenncy_id: '', mandal_id: '', panchayati_id: '' });
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
      this.service.Searchinstitute({ state_id: stateId }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.institutedata = res.data.map((item: any) => ({ ...item, showMore: false }));
        }
      });
    } else {
      this.getdistric();
      this.getinstitutes();
    }
  }
`;
        ts = ts.replace('onDistrictChange(event: any) {', methods + '\n  onDistrictChange(event: any) {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/institute/institute.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateDropdownHtml = `                            <div class="col-md-2 mb-4 pb-2">
                                <div class="form-outline">
                                    <label class="form-label">రాష్ట్రం / State </label>
                                    <select class="form-control" formControlName="state_id"
                                        (change)="onStateChange($event);" style="height:37px;width: 273px;">
                                        <option value="">అన్నీ (All States)</option>
                                        <option value="1">ఆంధ్రప్రదేశ్ (AP)</option>
                                        <option value="2">తెలంగాణ (TG)</option>
                                    </select>
                                </div>
                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="district_id"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-2 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateDropdownHtml + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated institute.component.html');
        }
    }
    console.log('Updated Institute');
}

// ==========================================
// 2. MARRIAGES
// ==========================================
{
    const tsFile = 'src/app/jesus/marriages/marriages.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['']")) {
        ts = ts.replace("district_id: [''],", "state_id: [''],\n      district_id: [''],");
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
    this.searchdist = '';
    this.searchconts = '';
    this.searchmand = '';
    this.serachMeetingform.patchValue({ state_id: stateId, district_id: '', constenncy_id: '', mandal_id: '', panchayati_id: '' });
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
    } else {
      this.getdistric();
    }
    this.search();
  }
`;
        ts = ts.replace('onDistrictChange(event: any) {', methods + '\n  onDistrictChange(event: any) {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/marriages/marriages.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateDropdownHtml = `                            <div class="col-md-2 mb-3">
                                <div class="form-outline">
                                    <label class="form-label" style="font-weight: 600; font-size: 13px;">రాష్ట్రం / State</label>
                                    <select class="form-control" formControlName="state_id" (change)="onStateChange($event);"
                                        style="height:38px; width: 100%;">
                                        <option value="">All States</option>
                                        <option value="1">ఆంధ్రప్రదేశ్ (AP)</option>
                                        <option value="2">తెలంగాణ (TG)</option>
                                    </select>
                                </div>
                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="district_id"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-2 mb-3">', colIdx);
            html = html.substring(0, preCol) + stateDropdownHtml + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated marriages.component.html');
        }
    }
    console.log('Updated Marriages');
}

// ==========================================
// 3. JOBS
// ==========================================
{
    const tsFile = 'src/app/jesus/jobs/jobs.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['']")) {
        ts = ts.replace("district_id: [''],", "state_id: [''],\n      district_id: [''],");
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
    this.searchdist = '';
    this.searchconts = '';
    this.searchchurchingform.patchValue({ state_id: stateId, district_id: '', constenncy_id: '', mandal_id: '', panchayati_id: '' });
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
      this.service.searchjobswise({ state_id: stateId }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.jobs = res.data;
        }
      });
    } else {
      this.getdistric();
      this.getjobs();
    }
  }
`;
        ts = ts.replace('onDistrictChange(event: any) {', methods + '\n  onDistrictChange(event: any) {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/jobs/jobs.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateDropdownHtml = `                            <div class="col-md-2 mb-4 pb-2">
                                <div class="form-outline">
                                    <label class="form-label">రాష్ట్రం / State </label>
                                    <select class="form-control" formControlName="state_id"
                                        (change)="onStateChange($event);" style="height:37px;width: 273px;">
                                        <option value="">అన్నీ (All States)</option>
                                        <option value="1">ఆంధ్రప్రదేశ్ (AP)</option>
                                        <option value="2">తెలంగాణ (TG)</option>
                                    </select>
                                </div>
                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="district_id"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-2 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateDropdownHtml + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated jobs.component.html');
        }
    }
    console.log('Updated Jobs');
}

// ==========================================
// 4. BUSINESS
// ==========================================
{
    const tsFile = 'src/app/jesus/business/business.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['']")) {
        ts = ts.replace("district_id: ['', [Validators.required]],", "state_id: [''],\n      district_id: ['', [Validators.required]],");
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
    this.searchdist = '';
    this.searchconts = '';
    this.serachMeetingform.patchValue({ state_id: stateId, district_id: '', constenncy_id: '', mandal_id: '', panchayati_id: '' });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    if (stateId) {
      this.service.getdistrict(stateId).subscribe(res => {
        if (res && res.status == 200) {
          this.districts = res.data;
        }
      });
      this.service.searchingbusiness({ state_id: stateId }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.searchevents = res.data;
        }
      });
    } else {
      this.getdistric();
      this.searechevents();
    }
  }
`;
        ts = ts.replace('onDistrictChange(event: any) {', methods + '\n  onDistrictChange(event: any) {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/business/business.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateDropdownHtml = `                            <div class="col-md-2 mb-4 pb-2">
                                <div class="form-outline">
                                    <label class="form-label">రాష్ట్రం / State </label>
                                    <select class="form-control" formControlName="state_id"
                                        (change)="onStateChange($event);" style="height:37px;width: 273px;">
                                        <option value="">అన్నీ (All States)</option>
                                        <option value="1">ఆంధ్రప్రదేశ్ (AP)</option>
                                        <option value="2">తెలంగాణ (TG)</option>
                                    </select>
                                </div>
                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="district_id"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-2 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateDropdownHtml + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated business.component.html');
        }
    }
    console.log('Updated Business');
}

// ==========================================
// 5. ORGANIZATION
// ==========================================
{
    const tsFile = 'src/app/jesus/organization/organization.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['']")) {
        ts = ts.replace("district_id: [''],", "state_id: [''],\n      district_id: [''],");
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
    this.searchdist = '';
    this.searchconts = '';
    this.searchmand = '';
    this.serachMeetingform.patchValue({ state_id: stateId, district_id: '', constenncy_id: '', mandal_id: '', panchayati_id: '' });
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
    } else {
      this.getdistric();
    }
    this.search();
  }
`;
        ts = ts.replace('onDistrictChange(event: any) {', methods + '\n  onDistrictChange(event: any) {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/organization/organization.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateDropdownHtml = `                            <div class="col-md-2 mb-4 pb-2">
                                <div class="form-outline">
                                    <label class="form-label">రాష్ట్రం / State </label>
                                    <select class="form-control" formControlName="state_id"
                                        (change)="onStateChange($event);" style="height:37px;width: 273px;">
                                        <option value="">అన్నీ (All States)</option>
                                        <option value="1">ఆంధ్రప్రదేశ్ (AP)</option>
                                        <option value="2">తెలంగాణ (TG)</option>
                                    </select>
                                </div>
                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="district_id"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-2 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateDropdownHtml + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated organization.component.html');
        }
    }
    console.log('Updated Organization');
}

// ==========================================
// 6. CHURCH-TIMINGS
// ==========================================
{
    const tsFile = 'src/app/jesus/church-timings/church-timings.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['']")) {
        ts = ts.replace("district_id: ['', [Validators.required]],", "state_id: [''],\n      district_id: ['', [Validators.required]],");
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
    this.searchdist = '';
    this.searchconts = '';
    this.searchchurchingform.patchValue({ state_id: stateId, district_id: '', constenncy_id: '', mandal_id: '', panchayati_id: '' });
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
      this.service.searchingchurchdata({ state_id: stateId }).subscribe((res: any) => {
        if (res && res.status == 200 && Array.isArray(res.data)) {
          this.church = res.data;
        }
      });
    } else {
      this.getdistric();
      this.churchtimings();
    }
  }
`;
        ts = ts.replace('getconstency(event: any) {', methods + '\n  getconstency(event: any) {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/church-timings/church-timings.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateDropdownHtml = `                            <div class="col-md-2 mb-4 pb-2">
                                <div class="form-outline">
                                    <label class="form-label">రాష్ట్రం / State </label>
                                    <select class="form-control" formControlName="state_id"
                                        (change)="onStateChange($event);" style="height:37px;width: 273px;">
                                        <option value="">అన్నీ (All States)</option>
                                        <option value="1">ఆంధ్రప్రదేశ్ (AP)</option>
                                        <option value="2">తెలంగాణ (TG)</option>
                                    </select>
                                </div>
                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="district_id"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-2 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateDropdownHtml + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated church-timings.component.html');
        }
    }
    console.log('Updated Church Timings');
}

// ==========================================
// 7. CHURCH-PASTOR-SEARCH
// ==========================================
{
    const tsFile = 'src/app/jesus/church-pastor-search/church-pastor-search.component.ts';
    let ts = fs.readFileSync(tsFile, 'utf8');
    if (!ts.includes("state_id: ['']")) {
        ts = ts.replace("district_id: ['', [Validators.required]],", "state_id: [''],\n      district_id: ['', [Validators.required]],");
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
    this.search.patchValue({ state_id: stateId, district_id: '', constituency_id: '', mandal_id: '' });
    this.districts = [];
    this.constituency = [];
    this.mandals = [];
    if (stateId) {
      this.service.getdistrict(stateId).subscribe(res => {
        if (res && res.status == 200) {
          this.districts = res.data;
        }
      });
    } else {
      this.getdistric();
    }
  }
`;
        ts = ts.replace('getdistric() {', methods + '\n  getdistric() {');
    }
    if (!ts.includes('this.getstates();')) {
        ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
    }
    fs.writeFileSync(tsFile, ts, 'utf8');

    const htmlFile = 'src/app/jesus/church-pastor-search/church-pastor-search.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateDropdownHtml = `                            <div class="col-md-2 mb-4 pb-2">
                                <div class="form-outline">
                                    <label class="form-label">రాష్ట్రం / State </label>
                                    <select class="form-control" formControlName="state_id"
                                        (change)="onStateChange($event);" style="height:37px;width: 273px;">
                                        <option value="">అన్నీ (All States)</option>
                                        <option value="1">ఆంధ్రప్రదేశ్ (AP)</option>
                                        <option value="2">తెలంగాణ (TG)</option>
                                    </select>
                                </div>
                            </div>\n`;
    if (!html.includes('formControlName="state_id"')) {
        const target = '<select class="form-control" formControlName="district_id"';
        const colIdx = html.indexOf(target);
        if (colIdx !== -1) {
            const preCol = html.lastIndexOf('<div class="col-md-2 mb-4 pb-2">', colIdx);
            html = html.substring(0, preCol) + stateDropdownHtml + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated church-pastor-search.component.html');
        }
    }
    console.log('Updated Church Pastor Search');
}

// ==========================================
// 8. WISH
// ==========================================
{
    const tsFile = 'src/app/jesus/wish/wish.component.ts';
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
    this.wishform.patchValue({ district_id: '', constituency_id: '', mandal_id: '', village_id: '' });
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

    const htmlFile = 'src/app/jesus/wish/wish.component.html';
    let html = fs.readFileSync(htmlFile, 'utf8');
    const stateDropdownHtml = `                            <div class="col-md-6 mb-4 pb-2">
                                <div class="form-outline">
                                    <label class="form-label">రాష్ట్రం / State <span
                                            style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                    <select class="form-control" formControlName="state_id"
                                        (change)="onStateChange($event);" style="height:37px;width: 273px;">
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
            html = html.substring(0, preCol) + stateDropdownHtml + html.substring(preCol);
            fs.writeFileSync(htmlFile, html, 'utf8');
            console.log('Updated wish.component.html');
        }
    }
    console.log('Updated Wish');
}

console.log('=== All 8 Services Pages Processed Successfully! ===');
