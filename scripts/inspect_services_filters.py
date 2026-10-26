import os, re

pages = ["institute", "marriages", "jobs", "business", "organization"]
base = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

for p in pages:
    p_dir = os.path.join(base, p)
    html_file = os.path.join(p_dir, f"{p}.component.html")
    ts_file = os.path.join(p_dir, f"{p}.component.ts")
    print(f"=== {p} ===")
    if os.path.exists(html_file):
        with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()
        matches = re.findall(r'<select[^>]*>', html)
        print("  HTML selects count:", len(matches))
        for m in matches:
            if any(k in m for k in ['district', 'state', 'const', 'mandal', 'panchay']):
                print("   ", m.strip()[:120])
    if os.path.exists(ts_file):
        with open(ts_file, 'r', encoding='utf-8', errors='ignore') as f:
            ts = f.read()
        funcs = re.findall(r'(?:get|on)[A-Za-z0-9_]+\s*\([^)]*\)\s*\{', ts)
        print("  TS functions:", [fn for fn in funcs if any(k in fn.lower() for k in ['state', 'district', 'const', 'mandal', 'panchay'])])
