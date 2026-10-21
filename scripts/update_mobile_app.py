import os
import re

APP_ROOT = r'C:\Users\rajes\StudioProjects\jbac_app'

def update_profile_ts():
    file_path = os.path.join(APP_ROOT, 'src', 'pages', 'profile', 'profile.ts')
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update geteditdtails data payload
    old_data = """  geteditdtails() {
    var data = {
      category_id: this.categoryid,
      usr_id: localStorage.getItem('usr_id')
    }
    this.service.geteditdtails(data).subscribe((res: any) => {"""

    new_data = """  geteditdtails() {
    var data = {
      category_id: this.categoryid || localStorage.getItem('category_id'),
      usr_id: localStorage.getItem('usr_id'),
      mobile_number: localStorage.getItem('mobile_number')
    }
    this.service.geteditdtails(data).subscribe((res: any) => {
      if (!res || !res.data || res.data.length === 0) return;
      this.details = res.data[0];
      if (this.details.category_id) {
        this.categoryid = String(this.details.category_id);
      }"""

    if old_data in content:
        content = content.replace(old_data, new_data)
    else:
        # regex replace
        content = re.sub(
            r'geteditdtails\(\)\s*\{\s*var\s+data\s*=\s*\{[^}]*usr_id:\s*localStorage\.getItem\(\'usr_id\'\)[^}]*\}\s*this\.service\.geteditdtails\(data\)\.subscribe\(\(res:\s*any\)\s*=>\s*\{(\s*this\.details\s*=\s*res\.data\[0\];)?',
            '''geteditdtails() {
    var data = {
      category_id: this.categoryid || localStorage.getItem('category_id'),
      usr_id: localStorage.getItem('usr_id'),
      mobile_number: localStorage.getItem('mobile_number')
    }
    this.service.geteditdtails(data).subscribe((res: any) => {
      if (!res || !res.data || res.data.length === 0) return;
      this.details = res.data[0];
      if (this.details.category_id) {
        this.categoryid = String(this.details.category_id);
      }''',
            content
        )

    # 2. Update form patch fallbacks so 8 out of 10 fields (or whatever user entered) pre-populate
    content = content.replace('pastorname: this.details.pastorname,', 'pastorname: this.details.pastorname || this.details.name,')
    content = content.replace('phonenumber: this.details.phonenumber,', 'phonenumber: this.details.phonenumber || this.details.mobile_number,')
    content = content.replace('church_name: this.details.church_name,', 'church_name: this.details.church_name || this.details.name,')
    content = content.replace('contactnumber: this.details.contactnumber,', 'contactnumber: this.details.contactnumber || this.details.mobile_number,')
    content = content.replace('studentname: this.details.studentname,', 'studentname: this.details.studentname || this.details.name,')
    content = content.replace('fname: this.details.fname,', 'fname: this.details.fname || this.details.name,')
    content = content.replace('organisation_name: this.details.organisation_name,', 'organisation_name: this.details.organisation_name || this.details.name,')
    content = content.replace('contact_num: this.details.contact_num,', 'contact_num: this.details.contact_num || this.details.mobile_number,')
    content = content.replace('pa_name: this.details.paname,', 'pa_name: this.details.paname || this.details.pa_name || this.details.name,')
    content = content.replace('ministryname: this.details.ministryname,', 'ministryname: this.details.ministryname || this.details.headname || this.details.name,')
    content = content.replace('headnmber: this.details.headnmber,', 'headnmber: this.details.headnmber || this.details.mobile_number,')

    # Pre-populate cascading dropdowns
    old_cascade_end = 'this.ministryform.patchValue({'
    cascade_code = """      // Pre-populate cascading location dropdowns
      const distId = this.details.district_id || this.details.districts || this.details.districtname;
      const constId = this.details.constituency_id || this.details.constituencyname;
      const mandalId = this.details.mandal_id || this.details.mandals;
      if (distId) this.getconstency(distId);
      if (constId) this.getmandals(constId);
      if (mandalId) this.gepanchayati(mandalId);

      this.ministryform.patchValue({"""
    if old_cascade_end in content and 'const distId =' not in content:
        content = content.replace(old_cascade_end, cascade_code)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated mobile profile.ts successfully!")

def update_login():
    ts_path = os.path.join(APP_ROOT, 'src', 'pages', 'login', 'login.ts')
    html_path = os.path.join(APP_ROOT, 'src', 'pages', 'login', 'login.html')

    with open(ts_path, 'r', encoding='utf-8') as f:
        ts_content = f.read()

    # Add isLoggingIn property if not present
    if 'isLoggingIn: boolean = false;' not in ts_content:
        ts_content = ts_content.replace('loading: any;', 'loading: any;\n  isLoggingIn: boolean = false;')

    # Update passlogin method
    ts_content = ts_content.replace("content: 'ప్రాసెస్ అవుతుంది దయచేసి ఆగండి'", "content: 'దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...'")
    ts_content = re.sub(
        r'async\s+passlogin\(\)\s*\{',
        'async passlogin() {\n    this.isLoggingIn = true;',
        ts_content
    )
    # Reset isLoggingIn on dismiss
    ts_content = re.sub(r'this\.loading\.dismiss\(\);', 'this.loading.dismiss();\n      this.isLoggingIn = false;', ts_content)

    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print("Updated mobile login.ts successfully!")

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    old_btn = '<button class="sigin-btn" (click)="passlogin()">సబ్మిట్</button>'
    new_btn = '''<button class="sigin-btn" (click)="passlogin()" [disabled]="isLoggingIn">
          <ion-spinner *ngIf="isLoggingIn" name="crescent" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"></ion-spinner>
          {{ isLoggingIn ? 'దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...' : 'సబ్మిట్' }}
        </button>'''
    if old_btn in html_content:
        html_content = html_content.replace(old_btn, new_btn)
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print("Updated mobile login.html successfully!")

def update_entry_form():
    ts_path = os.path.join(APP_ROOT, 'src', 'pages', 'entry-form', 'entry-form.ts')
    html_path = os.path.join(APP_ROOT, 'src', 'pages', 'entry-form', 'entry-form.html')

    with open(ts_path, 'r', encoding='utf-8') as f:
        ts_content = f.read()

    if 'isSubmitting: boolean = false;' not in ts_content:
        ts_content = ts_content.replace('loading: any', 'loading: any;\n  isSubmitting: boolean = false;')

    ts_content = ts_content.replace("content: 'ప్రాసెస్ అవుతుంది దయచేసి లాగండి'", "content: 'దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...'")
    ts_content = ts_content.replace("content: 'ప్రాసెస్ అవుతుంది దయచేసి ఆగండి'", "content: 'దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...'")

    ts_content = re.sub(
        r'async\s+submit\(\)\s*\{',
        'async submit() {\n    this.isSubmitting = true;',
        ts_content
    )
    ts_content = re.sub(r'this\.loading\.dismiss\(\);', 'this.loading.dismiss();\n      this.isSubmitting = false;', ts_content)

    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print("Updated mobile entry-form.ts successfully!")

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    old_btn = '<button ion-button color="secondary" (click)="submit()"><b>సబ్మిట్</b></button>'
    new_btn = '''<button ion-button color="secondary" (click)="submit()" [disabled]="isSubmitting">
          <ion-spinner *ngIf="isSubmitting" name="crescent" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"></ion-spinner>
          <b>{{ isSubmitting ? 'దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...' : 'సబ్మిట్' }}</b>
        </button>'''
    if old_btn in html_content:
        html_content = html_content.replace(old_btn, new_btn)
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print("Updated mobile entry-form.html successfully!")

def update_believer():
    ts_path = os.path.join(APP_ROOT, 'src', 'pages', 'believer', 'believer.ts')
    html_path = os.path.join(APP_ROOT, 'src', 'pages', 'believer', 'believer.html')

    with open(ts_path, 'r', encoding='utf-8') as f:
        ts_content = f.read()

    ts_content = re.sub(
        r'postbeliversignup\(\)\s*\{',
        'postbeliversignup() {\n    this.showSpinner = true;',
        ts_content
    )
    ts_content = re.sub(r'(\bif\s*\(\s*res\.status\s*==\s*200\s*\)\s*\{)', 'this.showSpinner = false;\n          \\1', ts_content)
    ts_content = re.sub(r'(\bif\s*\(\s*res\.status\s*==\s*451\s*\)\s*\{)', 'this.showSpinner = false;\n          \\1', ts_content)
    ts_content = re.sub(r'(\berror\s*=>\s*\{)', 'error => {\n          this.showSpinner = false;', ts_content)
    ts_content = ts_content.replace("setTimeout(() => { confirm.dismiss(); }, 2000);", "this.showSpinner = false;\n      setTimeout(() => { confirm.dismiss(); }, 2000);")

    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print("Updated mobile believer.ts successfully!")

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    old_btn = '<button ion-button color="secondary" (click)="postbeliversignup()" style="letter-spacing: 1px;">నమోదు\n            చేయండి</button>'
    new_btn = '''<button ion-button color="secondary" (click)="postbeliversignup()" [disabled]="showSpinner" style="letter-spacing: 1px;">
            <ion-spinner *ngIf="showSpinner" name="crescent" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"></ion-spinner>
            {{ showSpinner ? 'దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...' : 'నమోదు చేయండి' }}
          </button>'''
    if old_btn in html_content:
        html_content = html_content.replace(old_btn, new_btn)
    else:
        html_content = re.sub(
            r'<button\s+ion-button[^>]*\(click\)="postbeliversignup\(\)"[^>]*>[\s\S]*?</button>',
            new_btn,
            html_content
        )
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("Updated mobile believer.html successfully!")

def bump_version_to_34():
    config_path = os.path.join(APP_ROOT, 'config.xml')
    pkg_path = os.path.join(APP_ROOT, 'package.json')

    with open(config_path, 'r', encoding='utf-8') as f:
        c_content = f.read()

    # widget version="0.0.33" android-versionCode="33"
    c_content = re.sub(
        r'version="[0-9.]+"\s+android-versionCode="[0-9]+"',
        'version="0.0.34" android-versionCode="34"',
        c_content
    )
    with open(config_path, 'w', encoding='utf-8') as f:
        f.write(c_content)
    print("Bumped version in config.xml to 0.0.34 (versionCode 34)!")

    with open(pkg_path, 'r', encoding='utf-8') as f:
        p_content = f.read()
    p_content = re.sub(r'"version":\s*"[^"]+"', '"version": "0.0.34"', p_content)
    with open(pkg_path, 'w', encoding='utf-8') as f:
        f.write(p_content)
    print("Bumped version in package.json to 0.0.34!")

if __name__ == '__main__':
    update_profile_ts()
    update_login()
    update_entry_form()
    update_believer()
    bump_version_to_34()
