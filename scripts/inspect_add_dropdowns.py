import os, re

components = ["addinstitute", "addbusiness", "addmarriages", "addjobs"]
base = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

for comp in components:
    html_path = os.path.join(base, comp, f"{comp}.component.html")
    print(f"=== {comp} ===")
    if os.path.exists(html_path):
        with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        for idx, line in enumerate(lines):
            if any(k in line for k in ['formControlName="state', 'formControlName="district', 'formControlName="const', 'formControlName="mandal', 'formControlName="village']):
                print(f"  Line {idx+1}: {line.strip()[:100]}")
