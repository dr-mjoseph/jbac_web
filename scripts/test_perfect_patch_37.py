import subprocess
import os

# 1. Reset 37.js from git
subprocess.run(["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "checkout", "HEAD", "--", "www/build/37.js"], check=True)

p37 = r"C:\Users\rajes\StudioProjects\jbac_app\www\build\37.js"
with open(p37, "r", encoding="utf-8") as f:
    c = f.read()

rashtram = "\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C02"  # రాష్ట్రం
ap = "\u0C06\u0C02\u0C27\u0C4D\u0C30\u0C2A\u0C4D\u0C30\u0C26\u0C47\u0C36\u0C4D"  # ఆంధ్రప్రదేశ్
tg = "\u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23"          # తెలంగాణ

# 1. Template: Note that ALL linebreaks in the single-quoted template MUST be literal '\\n', NEVER raw '\n'!
idx = c.find('formControlName="districts"')
idx_col = c.rfind('<ion-col', 0, idx)

# Notice: we use raw string with r'\n' or '\\n', so NO raw newline bytes exist in template snippet!
state_snippet = (
    r'<ion-col col-12 col-md-6>\n\n'
    r'          <ion-item>\n\n'
    r'            <ion-label stacked>' + rashtram + r' / State <span style="color:red; ">*</span></ion-label>\n\n'
    r'            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">\n\n'
    r'              <ion-option value="1">' + ap + r' (AP)</ion-option>\n\n'
    r'              <ion-option value="2">' + tg + r' (TG)</ion-option>\n\n'
    r'            </ion-select>\n\n'
    r'          </ion-item>\n\n'
    r'        </ion-col>\n\n        '
)
c = c[:idx_col] + state_snippet + c[idx_col:]

# 2. FormBuilder: IN JS CODE, WE USE REAL NEWLINES (\n = 0x0A), NOT '\\n'!
idx_form = c.find("districts: [")
form_insert = "state_id: ['1'],\n            "
c = c[:idx_form] + form_insert + c[idx_form:]

# 3. Prototype: IN JS CODE, WE USE REAL NEWLINES!
idx_proto = c.find("BelieverPage.prototype.ionViewDidLoad = function")
proto_insert = """    BelieverPage.prototype.onStateChange = function (event) {
        var stateId = (event && event.target) ? event.target.value : event;
        var patchObj = { state_id: stateId, districts: '' };
        if (this.form) { this.form.patchValue(patchObj); }
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
    };
"""
c = c[:idx_proto] + proto_insert + c[idx_proto:]

# 4. In BelieverPage.prototype.getdistric: call getdistrict(1)
c = c.replace("this.service.getdistrict().subscribe", "this.service.getdistrict(1).subscribe")

with open(p37, "w", encoding="utf-8") as f:
    f.write(c)

# Verification
with open(p37, "rb") as f:
    raw = f.read()

start_tpl = raw.find(b"template:")
end_tpl = raw.find(b"/*ion-inline-end:", start_tpl)
tpl_bytes = raw[start_tpl:end_tpl]

has_lf = b'\n' in tpl_bytes
has_cr = b'\r' in tpl_bytes
has_bom = raw.startswith(b'\xef\xbb\xbf')
has_slash_n_in_form = b"state_id: ['1'],\\n" in raw

print("Verification for 37.js:")
print(f"  Template has raw LF : {has_lf} (Expected: False)")
print(f"  Template has raw CR : {has_cr} (Expected: False)")
print(f"  File has BOM        : {has_bom} (Expected: False)")
print(f"  Form has literal \\n : {has_slash_n_in_form} (Expected: False)")
