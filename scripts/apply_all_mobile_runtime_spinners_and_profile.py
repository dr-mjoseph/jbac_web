import os
import re

APP_ROOT = r'C:\Users\rajes\StudioProjects\jbac_app'
DIRS = [
    os.path.join(APP_ROOT, 'www', 'build'),
    os.path.join(APP_ROOT, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build')
]

TELUGU_WAIT = 'దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...'

def patch_0js(build_dir):
    f_path = os.path.join(build_dir, '0.js')
    if not os.path.exists(f_path):
        return
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update passlogin method
    old_start = 'passlogin = function () {\n        return __awaiter(this, void 0, void 0, function () {\n            var _this = this;'
    new_start = '''passlogin = function () {
        this.isLoggingIn = true;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;'''
    if old_start in content:
        content = content.replace(old_start, new_start)

    # Replace loading content
    content = re.sub(
        r"spinner:\s*'ios',\s*content:\s*('[^']+'|\\\"[^\\\"]+\\\")",
        f"spinner: 'ios',\n                    content: '{TELUGU_WAIT}'",
        content
    )

    # Reset isLoggingIn on validation error / dismiss
    content = content.replace('alert_1.present();\n                    this.loading.dismiss();', 'alert_1.present();\n                    this.isLoggingIn = false;\n                    this.loading.dismiss();')
    content = content.replace('this.loading.dismiss();', 'this.isLoggingIn = false;\n                    this.loading.dismiss();')

    # 2. Update button in template
    btn_regex = r'<button class="sigin-btn" \(click\)="passlogin\(\)"[^>]*>[\s\S]*?<\/button>'
    new_btn = f'''<button class="sigin-btn" (click)="passlogin()" [disabled]="isLoggingIn"><ion-spinner *ngIf="isLoggingIn" name="crescent" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"></ion-spinner><span *ngIf="isLoggingIn">{TELUGU_WAIT}</span><span *ngIf="!isLoggingIn">సబ్మిట్</span></button>'''
    content = re.sub(btn_regex, lambda m: new_btn, content)

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[{build_dir}] 0.js (LoginPage) successfully patched.')

def patch_15js(build_dir):
    f_path = os.path.join(build_dir, '15.js')
    if not os.path.exists(f_path):
        return
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update data object in geteditdtails
    old_data = '''        var data = {
            category_id: this.categoryid,
            usr_id: localStorage.getItem('usr_id')
        };'''
    new_data = '''        var data = {
            category_id: this.categoryid || localStorage.getItem('category_id'),
            usr_id: localStorage.getItem('usr_id'),
            mobile_number: localStorage.getItem('mobile_number')
        };'''
    if old_data in content:
        content = content.replace(old_data, new_data)

    # 2. Add categoryid and cascading dropdown hydration
    old_sub = '''        this.service.geteditdtails(data).subscribe(function (res) {
            _this.details = res.data[0];'''
    new_sub = '''        this.service.geteditdtails(data).subscribe(function (res) {
            if (!res || !res.data || res.data.length === 0) return;
            _this.details = res.data[0];
            if (_this.details.category_id) {
                _this.categoryid = String(_this.details.category_id);
            }
            var distId = _this.details.district_id || _this.details.districts || _this.details.districtname;
            var constId = _this.details.constituency_id || _this.details.constituencyname;
            var mandalId = _this.details.mandal_id || _this.details.mandals;
            if (distId) _this.getconstency(distId);
            if (constId) _this.getmandals(constId);
            if (mandalId) _this.gepanchayati(mandalId);'''
    if old_sub in content:
        content = content.replace(old_sub, new_sub)

    # 3. Add fallbacks to form controls so unfilled fields stay empty and filled fields (e.g. 8 out of 10) show
    content = content.replace('pastorname: _this.details.pastorname,', 'pastorname: _this.details.pastorname || _this.details.name,')
    content = content.replace('phonenumber: _this.details.phonenumber,', 'phonenumber: _this.details.phonenumber || _this.details.mobile_number,')
    content = content.replace('church_name: _this.details.church_name,', 'church_name: _this.details.church_name || _this.details.name,')
    content = content.replace('contactnumber: _this.details.contactnumber,', 'contactnumber: _this.details.contactnumber || _this.details.mobile_number,')
    content = content.replace('fname: _this.details.fname,', 'fname: _this.details.fname || _this.details.name,')
    content = content.replace('studentname: _this.details.studentname,', 'studentname: _this.details.studentname || _this.details.name,')
    content = content.replace('organisation_name: _this.details.organisation_name,', 'organisation_name: _this.details.organisation_name || _this.details.name,')
    content = content.replace('contact_num: _this.details.contact_num,', 'contact_num: _this.details.contact_num || _this.details.mobile_number,')
    content = content.replace('pa_name: _this.details.paname,', 'pa_name: _this.details.paname || _this.details.pa_name || _this.details.name,')
    content = content.replace('ministryname: _this.details.ministryname,', 'ministryname: _this.details.ministryname || _this.details.headname || _this.details.name,')
    content = content.replace('headnmber: _this.details.headnmber,', 'headnmber: _this.details.headnmber || _this.details.mobile_number,')

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[{build_dir}] 15.js (ProfilePage) successfully patched.')

def patch_32js(build_dir):
    f_path = os.path.join(build_dir, '32.js')
    if not os.path.exists(f_path):
        return
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update submit method
    old_submit = 'submit = function () {\n        return __awaiter(this, void 0, void 0, function () {\n            var _this = this;'
    new_submit = '''submit = function () {
        this.isSubmitting = true;
        return __awaiter(this, void 0, void 0, function () {\n            var _this = this;'''
    if old_submit in content:
        content = content.replace(old_submit, new_submit)

    content = re.sub(
        r"spinner:\s*'ios',\s*content:\s*('[^']+'|\\\"[^\\\"]+\\\")",
        f"spinner: 'ios',\n                            content: '{TELUGU_WAIT}'",
        content
    )
    content = content.replace('this.loading.dismiss();', 'this.isSubmitting = false;\n                        this.loading.dismiss();')

    # 2. Update button in template
    btn_regex = r'<button ion-button color="secondary" \(click\)="submit\(\)"[^>]*>[\s\S]*?<\/button>'
    new_btn = f'''<button ion-button color="secondary" (click)="submit()" [disabled]="isSubmitting"><ion-spinner *ngIf="isSubmitting" name="crescent" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"></ion-spinner><b><span *ngIf="isSubmitting">{TELUGU_WAIT}</span><span *ngIf="!isSubmitting">సబ్మిట్</span></b></button>'''
    content = re.sub(btn_regex, lambda m: new_btn, content)

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[{build_dir}] 32.js (EntryFormPage) successfully patched.')

def patch_reg_chunk(build_dir, chunk_file, method_name, orig_btn_pattern, default_label):
    f_path = os.path.join(build_dir, chunk_file)
    if not os.path.exists(f_path):
        return
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add this.showSpinner = true
    method_decl = f'{method_name} = function () {{\n'
    if method_decl in content and 'this.showSpinner = true;' not in content:
        content = content.replace(method_decl, f'{method_name} = function () {{\n        this.showSpinner = true;\n')

    # Add _this.showSpinner = false before alert / reset / dismiss
    if '_this.showSpinner = false;' not in content:
        content = re.sub(r'(\bif\s*\(\s*res\.status\s*==\s*200\s*\)\s*\{)', r'_this.showSpinner = false;\n            \1', content)
        content = re.sub(r'(\bif\s*\(\s*res\.status\s*==\s*451\s*\)\s*\{)', r'_this.showSpinner = false;\n            \1', content)
        content = re.sub(r'(\bfunction\s*\(\s*error\s*\)\s*\{)', r'\1\n            _this.showSpinner = false;', content)

    # Update submit button in template
    new_btn = f'''<button ion-button color="secondary" (click)="{method_name}()" [disabled]="showSpinner" style="letter-spacing: 1px;"><ion-spinner *ngIf="showSpinner" name="crescent" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"></ion-spinner><span *ngIf="showSpinner">{TELUGU_WAIT}</span><span *ngIf="!showSpinner">{default_label}</span></button>'''
    content = re.sub(orig_btn_pattern, lambda m: new_btn, content)

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[{build_dir}] {chunk_file} ({method_name}) successfully patched.')

def patch_52js(build_dir):
    f_path = os.path.join(build_dir, '52.js')
    if not os.path.exists(f_path):
        return
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    old_btn_pattern = r'<button\s+ion-button[^>]*type=\\"submit\\"[^>]*>[\s\S]*?<\/button>'
    new_btn = f'''<button ion-button block color=\\"primary\\" type=\\"submit\\" [disabled]=\\"showSpinner\\" style=\\"border-radius: 8px; font-weight: bold; height: 44px;\\">\\n          <ion-spinner *ngIf=\\"showSpinner\\" name=\\"crescent\\" style=\\"margin-right: 8px;\\"></ion-spinner>\\n          <span *ngIf=\\"showSpinner\\">{TELUGU_WAIT}</span>\\n          <span *ngIf=\\"!showSpinner\\">డాక్టర్ రిజిస్ట్రేషన్ పూర్తి చేయండి (Submit)</span>\\n        </button>'''
    content = re.sub(old_btn_pattern, lambda m: new_btn, content)

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[{build_dir}] 52.js (DoctorRegisterPage) successfully patched.')

def run_all():
    for d in DIRS:
        if not os.path.exists(d):
            print(f'Directory does not exist: {d}')
            continue
        print(f'=== Patching in {d} ===')
        patch_0js(d)
        patch_15js(d)
        patch_32js(d)
        # 37.js Believer
        patch_reg_chunk(d, '37.js', 'postbeliversignup', r'<button ion-button color="secondary" \(click\)="postbeliversignup\(\)"[^>]*>[\s\S]*?<\/button>', 'నమోదు చేయండి')
        # 12.js Student
        patch_reg_chunk(d, '12.js', 'poststudentsignup', r'<button ion-button color="secondary" \(click\)="poststudentsignup\(\)"[^>]*>[\s\S]*?<\/button>', 'నమోదు చేయండి')
        # 16.js Pastor
        patch_reg_chunk(d, '16.js', 'postchurchregister', r'<button ion-button color="secondary" \(click\)="postchurchregister\(\)"[^>]*>[\s\S]*?<\/button>', 'నమోదు చేయండి')
        # 35.js Church
        patch_reg_chunk(d, '35.js', 'postchurchregister', r'<button ion-button color="secondary" \(click\)="postchurchregister\(\)"[^>]*>[\s\S]*?<\/button>', 'నమోదు చేయండి')
        # 18.js Organisation
        patch_reg_chunk(d, '18.js', 'postindepedentorganisation', r'<button ion-button color="secondary" \(click\)="postindepedentorganisation\(\)"[^>]*>[\s\S]*?<\/button>', 'నమోదు చేయండి')
        # 21.js Ministry
        patch_reg_chunk(d, '21.js', 'postministrysignup', r'<button ion-button color="secondary" \(click\)="postministrysignup\(\)"[^>]*>[\s\S]*?<\/button>', 'నమోదు చేయండి')
        # 38.js Association
        patch_reg_chunk(d, '38.js', 'postpastorassociations', r'<button ion-button color="secondary" \(click\)="postpastorassociations\(\)"[^>]*>[\s\S]*?<\/button>', 'నమోదు చేయండి')
        # 52.js Doctor
        patch_52js(d)

if __name__ == '__main__':
    run_all()
