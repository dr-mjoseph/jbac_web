import os
import re

APP_ROOT = r'C:\Users\rajes\StudioProjects\jbac_app'

mobile_pages = [
    ('pastor', 'postchurchregister()', 'రిజిస్టర్'),
    ('student', 'poststudentsignup()', 'నమోదు'),
    ('ministry', 'postministrysignup()', 'నమోదు'),
    ('church', 'postchurchregister()', 'నమోదు'),
    ('organisation', 'postindepedentorganisation()', 'నమోదు'),
    ('association', 'postpastorsassociations()', 'సబ్మిట్'),
    ('doctorregister', 'submitRegistration()', 'డాక్టర్ రిజిస్ట్రేషన్ పూర్తి చేయండి'),
]

for folder, method, btn_text in mobile_pages:
    ts_file = os.path.join(APP_ROOT, 'src', 'pages', folder, f'{folder}.ts')
    html_file = os.path.join(APP_ROOT, 'src', 'pages', folder, f'{folder}.html')

    if os.path.exists(ts_file):
        with open(ts_file, 'r', encoding='utf-8') as f:
            ts_code = f.read()

        # Add showSpinner if not present
        if 'showSpinner' not in ts_code:
            ts_code = re.sub(
                r'export\s+class\s+\w+\s*\{',
                r'\g<0>\n  showSpinner: boolean = false;',
                ts_code
            )

        # Set showSpinner = true in submit method
        clean_method_name = method.replace('()', '')
        ts_code = re.sub(
            rf'{clean_method_name}\s*\([^)]*\)\s*\{{',
            rf'{clean_method_name}() {{\n    this.showSpinner = true;',
            ts_code
        )
        ts_code = re.sub(r'(\bif\s*\(\s*res\.status\s*==\s*200\s*\)\s*\{)', r'this.showSpinner = false;\n          \1', ts_code)
        ts_code = re.sub(r'(\bif\s*\(\s*res\.status\s*==\s*451\s*\)\s*\{)', r'this.showSpinner = false;\n          \1', ts_code)
        ts_code = re.sub(r'(\berror\s*=>\s*\{)', r'error => {\n          this.showSpinner = false;', ts_code)

        with open(ts_file, 'w', encoding='utf-8') as f:
            f.write(ts_code)
        print(f"Updated {ts_file}")

    if os.path.exists(html_file):
        with open(html_file, 'r', encoding='utf-8') as f:
            html_code = f.read()

        pattern = re.compile(
            rf'<button\s+ion-button[^>]*\(click\)="{re.escape(method)}"[^>]*>[\s\S]*?</button>',
            re.IGNORECASE
        )
        replacement = f'''<button ion-button color="secondary" (click)="{method}" [disabled]="showSpinner" style="letter-spacing: 1px;">
            <ion-spinner *ngIf="showSpinner" name="crescent" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"></ion-spinner>
            {{{{ showSpinner ? 'దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...' : '{btn_text}' }}}}
          </button>'''
        new_html = pattern.sub(replacement, html_code)
        if new_html != html_code:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(new_html)
            print(f"Updated {html_file}")

print("All other mobile registration pages updated!")
