import os
import subprocess
import glob

node_exe = r"C:\Users\rajes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
build_dir = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"

js_files = glob.glob(os.path.join(build_dir, "*.js"))

errors = 0
for f in sorted(js_files, key=lambda x: int(os.path.basename(x).split(".")[0]) if os.path.basename(x).split(".")[0].isdigit() else 999):
    fname = os.path.basename(f)
    res = subprocess.run([node_exe, "-c", f], stdout=subprocess.PIPE, stderr=subprocess.PIPE, encoding="utf-8", errors="replace")
    if res.returncode != 0:
        errors += 1
        first_line_err = res.stderr.strip().split("\n")[-1]
        print(f"[FAIL] {fname}: {first_line_err}")
    else:
        print(f"[PASS] {fname}")

print(f"\nTotal JS files checked: {len(js_files)}, Errors: {errors}")
