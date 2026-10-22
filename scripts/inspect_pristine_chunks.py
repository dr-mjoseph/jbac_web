import subprocess
import re

chunks = [
    ("23.js", "JobsPage", "district_id"),
    ("13.js", "SearchorganisationPage", "district_id"),
    ("18.js", "OrganisationPage", "districts"),
    ("16.js", "PastorPage", "district_id"),
    ("35.js", "ChurchPage", "district_id"),
    ("38.js", "AssociationPage", "district_id"),
    ("14.js", "SearchhousePage", "district_id"),
    ("22.js", "MarriagePage", "district_id"),
    ("41.js", "AddjobsPage", "districtname"),
    ("37.js", "BelieverPage", "districts"),
    ("12.js", "StudentPage", "district_id"),
    ("32.js", "EntryFormPage", "district_id")
]

for f, cname, dist in chunks:
    cmd = ["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "show", f"HEAD:www/build/{f}"]
    s = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8').stdout
    m = re.search(r'this\.([a-zA-Z0-9_]+)\s*=\s*this\.(?:formbuilder|formBuilder)\.group', s)
    form_prop = m.group(1) if m else "UNKNOWN"
    
    # Check if dist field exists in form
    has_dist_in_form = (f"{dist}:" in s) or (f"{dist} :" in s)
    # Check if dist field exists in template
    has_dist_in_tpl = f'formControlName="{dist}"' in s
    
    print(f"{f:>5} ({cname:>22}): form='this.{form_prop}', distField='{dist}' (form={has_dist_in_form}, tpl={has_dist_in_tpl})")
