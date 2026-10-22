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

const target = 'College/School Address</p>';
const idx = html.indexOf(target);
if (idx !== -1) {
    const rowIdx = html.indexOf('<div class="row">', idx);
    const colIdx = html.indexOf('<div class="col-md-6 mb-4 pb-2">', rowIdx);
    if (!html.substring(rowIdx, colIdx + 50).includes('formControlName="state_id"')) {
        html = html.substring(0, colIdx) + stateBlock + html.substring(colIdx);
        fs.writeFileSync(htmlPath, html, 'utf8');
        console.log('Successfully inserted state dropdown for student college address');
    } else {
        console.log('Already has state dropdown for student college address');
    }
}
