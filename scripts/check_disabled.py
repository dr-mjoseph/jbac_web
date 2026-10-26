import os, re

components = [
    # Issue 4:
    "believerregister",
    "addattacks",
    "studentregister",
    "ministryregister",
    "pastorregister",
    "churchregister",
    "organisationregister",
    "pastorassociationregister",
    # Issue 7:
    "institute",
    "marriages",
    "jobs",
    "business",
    "organization",
    # Issue 9:
    "addchurchtimings",
    "addinstitute",
    "addbusiness",
    "addmarriages",
    "addjobs"
]

base = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

for comp in components:
    html_path = os.path.join(base, comp, f"{comp}.component.html")
    with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    disabled_count = len(re.findall(r'\[disabled\]', html))
    print(f"{comp}: {disabled_count} [disabled] bindings found")
