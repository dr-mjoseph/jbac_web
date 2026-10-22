const fs = require('fs');

const htmlPath = 'src/app/jesus/signup/signup.component.html';
let html = fs.readFileSync(htmlPath, 'utf8');

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

// Target each district dropdown in each form by checking if its preceding sibling is already state_id
// 1. Believer form (h['districts'])
if (html.includes("h['districts'].errors") && !html.includes("h['districts'].errors }") === false) {
    const bTarget = `<select class="form-control" formControlName="districts"`;
    // Find the enclosing col-md-6 before it
    const bCol = html.indexOf(bTarget);
    if (bCol !== -1) {
        const precedingCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', bCol);
        if (precedingCol !== -1 && !html.substring(precedingCol - 300, precedingCol).includes('formControlName="state_id"')) {
            html = html.substring(0, precedingCol) + stateBlock + html.substring(precedingCol);
            console.log('Added state dropdown to Believer form');
        }
    }
}

// 2. Student College (e['district_id'])
const scTarget = `<select class="form-control" formControlName="district_id"\n                                                        (change)="getconstency($event);"\n                                                        style="height:37px;width: 273px;"\n                                                        [ngClass]="{'is-invalid': submitted && e['district_id'].errors }">`;
const scIndex = html.indexOf(scTarget);
if (scIndex !== -1) {
    const precedingCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', scIndex);
    if (precedingCol !== -1 && !html.substring(precedingCol - 300, precedingCol).includes('formControlName="state_id"')) {
        html = html.substring(0, precedingCol) + stateBlock + html.substring(precedingCol);
        console.log('Added state dropdown to Student College section');
    }
}

// 3. Student Residence (e['resdistricts'])
const srTarget = `<select class="form-control" formControlName="resdistricts"`;
const srIndex = html.indexOf(srTarget);
if (srIndex !== -1) {
    const precedingCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', srIndex);
    if (precedingCol !== -1 && !html.substring(precedingCol - 300, precedingCol).includes('formControlName="state_id"')) {
        html = html.substring(0, precedingCol) + stateBlock + html.substring(precedingCol);
        console.log('Added state dropdown to Student Residence section');
    }
}

// 4. Ministry form (r['district_id'])
const mTarget = `submitted && r['district_id'].errors`;
const mIndex = html.indexOf(mTarget);
if (mIndex !== -1) {
    const precedingCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', mIndex);
    if (precedingCol !== -1 && !html.substring(precedingCol - 300, precedingCol).includes('formControlName="state_id"')) {
        html = html.substring(0, precedingCol) + stateBlock + html.substring(precedingCol);
        console.log('Added state dropdown to Ministry form');
    }
}

// 5. Pastor form (o['district_id'])
const pTarget = `submitted && o['district_id'].errors`;
const pIndex = html.indexOf(pTarget);
if (pIndex !== -1) {
    const precedingCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', pIndex);
    if (precedingCol !== -1 && !html.substring(precedingCol - 300, precedingCol).includes('formControlName="state_id"')) {
        html = html.substring(0, precedingCol) + stateBlock + html.substring(precedingCol);
        console.log('Added state dropdown to Pastor form');
    }
}

// 6. Church form (k['district_id'])
const cTarget = `submitted && k['district_id'].errors`;
const cIndex = html.indexOf(cTarget);
if (cIndex !== -1) {
    const precedingCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', cIndex);
    if (precedingCol !== -1 && !html.substring(precedingCol - 300, precedingCol).includes('formControlName="state_id"')) {
        html = html.substring(0, precedingCol) + stateBlock + html.substring(precedingCol);
        console.log('Added state dropdown to Church form');
    }
}

// 7. Organisation form (i['districts'])
const oTarget = `submitted && i['districts'].errors`;
const oIndex = html.indexOf(oTarget);
if (oIndex !== -1) {
    const precedingCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', oIndex);
    if (precedingCol !== -1 && !html.substring(precedingCol - 300, precedingCol).includes('formControlName="state_id"')) {
        html = html.substring(0, precedingCol) + stateBlock + html.substring(precedingCol);
        console.log('Added state dropdown to Organisation form');
    }
}

// 8. Pastor Association form (g['district_id'])
const paTarget = `submitted && g['district_id'].errors`;
const paIndex = html.indexOf(paTarget);
if (paIndex !== -1) {
    const precedingCol = html.lastIndexOf('<div class="col-md-6 mb-4 pb-2">', paIndex);
    if (precedingCol !== -1 && !html.substring(precedingCol - 300, precedingCol).includes('formControlName="state_id"')) {
        html = html.substring(0, precedingCol) + stateBlock + html.substring(precedingCol);
        console.log('Added state dropdown to Pastor Association form');
    }
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Finished processing signup.component.html');
