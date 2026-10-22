import os
import subprocess

p23 = r"C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js"
with open(p23, "r", encoding="utf-8") as f:
    c = f.read()

rashtram = "\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C02"
anni = "\u0C05\u0C28\u0C4D\u0C28\u0C40"
ap = "\u0C06\u0C02\u0C27\u0C4D\u0C30\u0C2A\u0C4D\u0C30\u0C26\u0C47\u0C36\u0C4D"
tg = "\u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23"

# 1. Template
idx = c.find('formControlName="district_id"')
idxCol = c.rfind('<ion-col', 0, idx)
options_html = (
    r'\n\n              <ion-option value="">' + anni + r' (All States)</ion-option>'
    r'\n\n              <ion-option value="1">' + ap + r' (AP)</ion-option>'
    r'\n\n              <ion-option value="2">' + tg + r' (TG)</ion-option>'
)
state_col = (
    r'<ion-col col-12 col-md-3>\n\n'
    r'          <ion-item>\n\n'
    r'            <ion-label stacked>' + rashtram + r' / State</ion-label>\n\n'
    r'            <ion-select formControlName="state_id" interface="popover" style="width: 273px;" (ionChange)="onStateChange($event)">'
    + options_html +
    r'\n\n            </ion-select>\n\n'
    r'          </ion-item>\n\n'
    r'        </ion-col>\n\n        '
)
c = c[:idxCol] + state_col + c[idxCol:]

# 2. FormBuilder (with REAL newline, NO backslash-n)
idxForm = c.find("jobtile: [")
form_insert = "state_id: [''],\n            "
c = c[:idxForm] + form_insert + c[idxForm:]

# 3. Prototype (with REAL newlines)
idxProto = c.find("JobsPage.prototype.gotohome = function")
proto_insert = """    JobsPage.prototype.onStateChange = function (event) {
        var stateId = event;
        this.searchdist = '';
        this.searchconts = '';
        this.form.patchValue({
            state_id: stateId,
            district_id: '',
            constenncy_id: '',
            mandal_id: '',
            panchayati_id: ''
        });
        this.districts = [];
        this.constituency = [];
        this.mandals = [];
        this.panchayati = [];
        var _this = this;
        this.service.getdistrict(stateId).subscribe(function (res) {
            if (res && res.status == 200) {
                _this.districts = res.data;
            }
        }, function (error) {
            console.log(error);
        });
        if (stateId) {
            this.service.searchjobswise({ state_id: stateId }).subscribe(function (res) {
                if (res && res.status == 200 && Array.isArray(res.data)) {
                    _this.jobs = res.data;
                }
            });
        } else {
            this.getjobs();
        }
    };
"""
c = c[:idxProto] + proto_insert + c[idxProto:]

# Write without BOM
with open(p23, "w", encoding="utf-8") as f:
    f.write(c)

print("Patched 23.js successfully!")
