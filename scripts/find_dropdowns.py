import os, re

forms = [
    # Issue 4:
    "believerregister",
    "addattacks",
    "studentregister",
    "ministryregister",
    "pastorregister",
    "churchregister",
    "organisationregister",
    "pastorassociationregister",
    # Issue 7 (Services view/filter):
    "institute",
    "marriages",
    "jobs",
    "business",
    "organization",
    # Issue 9 (Add Services):
    "addchurchtimings",
    "addinstitute",
    "addbusiness",
    "addmarriages",
    "addjobs"
]

base_dir = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

for form in forms:
    form_dir = os.path.join(base_dir, form)
    html_file = os.path.join(form_dir, f"{form}.component.html")
    ts_file = os.path.join(form_dir, f"{form}.component.ts")
    print(f"=== {form} ===")
    if os.path.exists(html_file):
        with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()
        selects = re.findall(r'<select[^>]*formControlName=["\']([^"\']+)["\'][^>]*>', html)
        if not selects:
            selects = re.findall(r'<select[^>]*name=["\']([^"\']+)["\'][^>]*>', html)
        print(f"  HTML selects: {selects}")
    else:
        print(f"  HTML file NOT found: {html_file}")
    if os.path.exists(ts_file):
        with open(ts_file, 'r', encoding='utf-8', errors='ignore') as f:
            ts = f.read()
        has_state = "state" in ts
        has_district = "district" in ts
        has_const = "const" in ts
        has_mandal = "mandal" in ts
        has_panchayat = "panchay" in ts
        print(f"  TS checks: state={has_state}, district={has_district}, const={has_const}, mandal={has_mandal}, panchayat={has_panchayat}")
