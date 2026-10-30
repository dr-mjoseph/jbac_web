import os

base = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

for comp in ["addbusiness", "addmarriages", "addjobs"]:
    ts_path = os.path.join(base, comp, f"{comp}.component.ts")
    with open(ts_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    print(f"=== {comp} ===")
    for i, l in enumerate(lines):
        if any(k in l for k in ['getconstency', 'getmandals', 'gepanchayati', 'onStateChange']):
            if '(' in l and ')' in l:
                print(f"  Line {i+1}: {l.strip()[:80]}")
