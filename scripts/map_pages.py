import os, glob, re

build_dir = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
js_files = glob.glob(os.path.join(build_dir, "*.js"))

page_map = {}
for p in js_files:
    fname = os.path.basename(p)
    if fname in ("main.js", "vendor.js", "polyfills.js", "sw-toolbox.js"):
        continue
    with open(p, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        matches = re.findall(r"(\w+Page)\.prototype", content)
        if not matches:
            matches = re.findall(r"class\s+(\w+Page)", content)
        if not matches:
            matches = re.findall(r"function\s+(\w+Page)", content)
        if matches:
            page_map[fname] = list(set(matches))

for k in sorted(page_map.keys(), key=lambda x: int(x.split(".")[0]) if x.split(".")[0].isdigit() else 999):
    print(f"{k:10s} -> {page_map[k]}")
