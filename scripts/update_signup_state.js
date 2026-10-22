const fs = require('fs');

// 1. Update signup.component.ts
let tsPath = 'src/app/jesus/signup/signup.component.ts';
let ts = fs.readFileSync(tsPath, 'utf8');

// Ensure state_id in all formBuilder groups
const formInits = [
    { target: "this.beliverform = this.formBuilder.group({", check: "this.beliverform = this.formBuilder.group({\n      state_id: ['1', [Validators.required]]," },
    { target: "this.studentform = this.formBuilder.group({", check: "this.studentform = this.formBuilder.group({\n      state_id: ['1', [Validators.required]]," },
    { target: "this.ministryform = this.formBuilder.group({", check: "this.ministryform = this.formBuilder.group({\n      state_id: ['1', [Validators.required]]," },
    { target: "this.pastorform = this.formBuilder.group({", check: "this.pastorform = this.formBuilder.group({\n      state_id: ['1', [Validators.required]]," },
    { target: "this.churchregsiterform = this.formBuilder.group({", check: "this.churchregsiterform = this.formBuilder.group({\n      state_id: ['1', [Validators.required]]," },
    { target: "this.independentorgainsationform = this.formBuilder.group({", check: "this.independentorgainsationform = this.formBuilder.group({\n      state_id: ['1', [Validators.required]]," },
    { target: "this.independentchurchform = this.formBuilder.group({", check: "this.independentchurchform = this.formBuilder.group({\n      state_id: ['1', [Validators.required]]," },
    { target: "this.pastorsassociations = this.formBuilder.group({", check: "this.pastorsassociations = this.formBuilder.group({\n      state_id: ['1', [Validators.required]]," }
];

for (const f of formInits) {
    if (!ts.includes(f.check)) {
        ts = ts.replace(f.target, f.check);
    }
}

// Add state methods if missing
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
      this.service.getdistrict(stateId).subscribe((res: any) => {
        this.districts = res.data;
      });
    }
  }
`;
    ts = ts.replace('getdistric() {', methods + '\n  getdistric() {');
}

// Add this.getstates() in ngOnInit
if (!ts.includes('this.getstates();')) {
    ts = ts.replace('this.getdistric();', 'this.getstates();\n    this.getdistric();');
}

// Update getdistric() to default to 1
ts = ts.replace('this.service.getdistrict().subscribe(res => {', 'this.service.getdistrict(1).subscribe(res => {');

fs.writeFileSync(tsPath, ts, 'utf8');
console.log('Successfully updated signup.component.ts');

// 2. Update signup.component.html
let htmlPath = 'src/app/jesus/signup/signup.component.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace Residential Address in AP
html = html.replace(/<p>&nbsp;&nbsp; Residential Address in AP<\/p>/g, '<p>&nbsp;&nbsp; Residential Address / నివాస చిరునామా</p>');

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

// Insert state dropdown before district sections if not already present
const patterns = [
    // Believer form
    {
        find: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Residential Address / నివాస చిరునామా</p>\n                                        <div class="row">`,
        replace: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Residential Address / నివాస చిరునామా</p>\n                                        <div class="row">\n` + stateBlock
    },
    // Student College Address
    {
        find: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; School / College Address</p>\n                                        <div class="row">`,
        replace: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; School / College Address</p>\n                                        <div class="row">\n` + stateBlock
    },
    // Student Residential Address
    {
        find: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Residential Address</p>\n                                        <div class="row">`,
        replace: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Residential Address</p>\n                                        <div class="row">\n` + stateBlock
    },
    // Ministry Address
    {
        find: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Address</p>\n                                        <div class="row">\n                                            <div class="col-md-6 mb-4 pb-2">\n                                                <div class="form-outline">\n                                                    <label class="form-label">Select Districts <span\n                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span></label>`,
        replace: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Address</p>\n                                        <div class="row">\n` + stateBlock + `                                            <div class="col-md-6 mb-4 pb-2">\n                                                <div class="form-outline">\n                                                    <label class="form-label">Select Districts <span\n                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span></label>`
    },
    // Pastor Address
    {
        find: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Address</p>\n                                        <div class="row">\n                                            <div class="col-md-6 mb-4 pb-2">\n                                                <div class="form-outline">\n                                                    <label class="form-label">Select Districts<span\n                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span>\n                                                    </label>`,
        replace: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Address</p>\n                                        <div class="row">\n` + stateBlock + `                                            <div class="col-md-6 mb-4 pb-2">\n                                                <div class="form-outline">\n                                                    <label class="form-label">Select Districts<span\n                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span>\n                                                    </label>`
    },
    // Church Address
    {
        find: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Address</p>\n                                        <div class="row">\n                                            <div class="col-md-6 mb-4 pb-2">\n                                                <div class="form-outline">\n                                                    <label class="form-label">Select District <span\n                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span>\n                                                    </label>`,
        replace: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Address</p>\n                                        <div class="row">\n` + stateBlock + `                                            <div class="col-md-6 mb-4 pb-2">\n                                                <div class="form-outline">\n                                                    <label class="form-label">Select District <span\n                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span>\n                                                    </label>`
    },
    // Organisation Address
    {
        find: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Address</p>\n                                        <div class="row">\n\n                                            <div class="col-md-6 mb-4 pb-2">\n                                                <div class="form-outline">\n                                                    <label class="form-label">Select Districts<span\n                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span>\n                                                    </label>`,
        replace: `<div class="card shadow-2-strong card-registration" style="border-radius: 15px;">\n                                        <p>&nbsp;&nbsp; Address</p>\n                                        <div class="row">\n` + stateBlock + `                                            <div class="col-md-6 mb-4 pb-2">\n                                                <div class="form-outline">\n                                                    <label class="form-label">Select Districts<span\n                                                            style="color:red; -webkit-text-stroke-width:thick;">*</span>\n                                                    </label>`
    }
];

for (const p of patterns) {
    if (html.includes(p.find)) {
        html = html.replace(p.find, p.replace);
        console.log('Replaced pattern for card in signup html');
    }
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated signup.component.html');
