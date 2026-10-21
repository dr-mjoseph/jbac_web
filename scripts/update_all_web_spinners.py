import os
import re

def update_signup_component_ts():
    path = 'src/app/jesus/signup/signup.component.ts'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # In postbeliversignup
    content = re.sub(
        r'postbeliversignup\(\)\s*\{',
        r'postbeliversignup() {\n    this.showSpinner = true;',
        content
    )
    # Ensure invalid / mismatch resets spinner
    content = content.replace("Swal.fire('please fill the details');", "this.showSpinner = false;\n      Swal.fire('please fill the details');")
    content = content.replace('Swal.fire("Passwords are Unmatched")', 'this.showSpinner = false;\n      Swal.fire("Passwords are Unmatched")')
    content = content.replace('Swal.fire("Passwords are Unmatched");', 'this.showSpinner = false;\n      Swal.fire("Passwords are Unmatched");')

    # In postministrysignup
    content = re.sub(
        r'postministrysignup\(\)\s*\{',
        r'postministrysignup() {\n    this.showSpinner = true;',
        content
    )

    # In postindepedentorganisation
    content = re.sub(
        r'postindepedentorganisation\(\)\s*\{',
        r'postindepedentorganisation() {\n    this.showSpinner = true;',
        content
    )

    # In postchurchregister
    content = re.sub(
        r'postchurchregister\(\)\s*\{',
        r'postchurchregister() {\n    this.showSpinner = true;',
        content
    )

    # In postpastorassociations
    content = re.sub(
        r'postpastorassociations\(\)\s*\{',
        r'postpastorassociations() {\n    this.showSpinner = true;',
        content
    )

    # In postpastorsignup
    content = re.sub(
        r'postpastorsignup\(\)\s*\{',
        r'postpastorsignup() {\n    this.showSpinner = true;',
        content
    )

    # In poststudentsignup
    content = re.sub(
        r'poststudentsignup\(\)\s*\{',
        r'poststudentsignup() {\n    this.showSpinner = true;',
        content
    )

    # Make sure all response callbacks turn off showSpinner
    content = re.sub(r'(\bif\s*\(\s*res\.status\s*==\s*200\s*\)\s*\{)', r'this.showSpinner = false;\n          \1', content)
    content = re.sub(r'(\bif\s*\(\s*res\.status\s*==\s*451\s*\)\s*\{)', r'this.showSpinner = false;\n          \1', content)
    content = re.sub(r'(\berror\s*=>\s*\{)', r'error => {\n          this.showSpinner = false;', content)

    # Deduplicate any duplicate this.showSpinner = false;
    content = re.sub(r'(this\.showSpinner = false;\s*)+', 'this.showSpinner = false;\n          ', content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated signup.component.ts successfully!")

def update_signup_component_html():
    path = 'src/app/jesus/signup/signup.component.html'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    methods = [
        'postbeliversignup()',
        'poststudentsignup()',
        'postministrysignup()',
        'postpastorsignup()',
        'postchurchregister()',
        'postindepedentorganisation()',
        'postpastorassociations()'
    ]

    for m in methods:
        pattern = re.compile(
            rf'<button\s+type="submit"\s+\(click\)="{re.escape(m)}"[^>]*>[\s\S]*?</button>',
            re.IGNORECASE
        )
        replacement = f'''<button type="submit" (click)="{m}" [disabled]="showSpinner" class="default-btn user-all-btn">
                                            <span *ngIf="showSpinner"><i class="fa fa-spinner fa-spin me-1"></i> దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...</span>
                                            <span *ngIf="!showSpinner">Register</span>
                                        </button>'''
        content = pattern.sub(replacement, content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated signup.component.html successfully!")

def update_standalone_register_pages():
    pages = [
        ('src/app/jesus/studentregister/studentregister.component.html', 'poststudentsignup()', 'Register'),
        ('src/app/jesus/pastorregister/pastorregister.component.html', 'postpastorsignup()', 'Register'),
        ('src/app/jesus/pastorassociationregister/pastorassociationregister.component.html', 'postpastorassociations()', 'Register'),
        ('src/app/jesus/organisationregister/organisationregister.component.html', 'postindepedentorganisation()', 'Register'),
        ('src/app/jesus/ministryregister/ministryregister.component.html', 'postministrysignup()', 'Register'),
        ('src/app/jesus/churchregister/churchregister.component.html', 'postchurchregister()', 'Register'),
        ('src/app/jesus/believerregister/believerregister.component.html', 'postbeliversignup()', 'Register'),
    ]

    for fpath, method, default_txt in pages:
        if not os.path.exists(fpath):
            continue
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        pattern = re.compile(
            rf'<button\s+type="submit"\s+\(click\)="{re.escape(method)}"[^>]*>[\s\S]*?</button>',
            re.IGNORECASE
        )
        replacement = f'''<button type="submit" (click)="{method}" [disabled]="showSpinner" class="default-btn user-all-btn">
                                            <span *ngIf="showSpinner"><i class="fa fa-spinner fa-spin me-1"></i> దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...</span>
                                            <span *ngIf="!showSpinner">{default_txt}</span>
                                        </button>'''
        new_content = pattern.sub(replacement, content)
        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {fpath} successfully!")

    # Doctor register
    doc_path = 'src/app/jesus/doctorregister/doctorregister.component.html'
    if os.path.exists(doc_path):
        with open(doc_path, 'r', encoding='utf-8') as f:
            dcontent = f.read()
        old_doc_btn = """              <button
                type="submit"
                class="btn btn-primary btn-lg px-5 py-3 fw-bold shadow rounded-pill"
                [disabled]="showSpinner"
              >
                <span *ngIf="showSpinner" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i *ngIf="!showSpinner" class="fa fa-user-plus me-2"></i>
                డాక్టర్ రిజిస్ట్రేషన్ పూర్తి చేయండి (Submit Registration)
              </button>"""
        new_doc_btn = """              <button
                type="submit"
                class="btn btn-primary btn-lg px-5 py-3 fw-bold shadow rounded-pill"
                [disabled]="showSpinner"
              >
                <span *ngIf="showSpinner"><i class="fa fa-spinner fa-spin me-2"></i>దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...</span>
                <span *ngIf="!showSpinner"><i class="fa fa-user-plus me-2"></i>డాక్టర్ రిజిస్ట్రేషన్ పూర్తి చేయండి (Submit Registration)</span>
              </button>"""
        if old_doc_btn in dcontent:
            dcontent = dcontent.replace(old_doc_btn, new_doc_btn)
            with open(doc_path, 'w', encoding='utf-8') as f:
                f.write(dcontent)
            print("Updated doctorregister.component.html successfully!")

if __name__ == '__main__':
    update_signup_component_ts()
    update_signup_component_html()
    update_standalone_register_pages()
