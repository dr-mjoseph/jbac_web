import subprocess
import re

chunks = ["18.js", "16.js", "35.js", "38.js", "37.js", "12.js", "41.js"]

for f in chunks:
    cmd = ["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "show", f"HEAD:www/build/{f}"]
    s = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8').stdout
    m = re.search(r'prototype\.getdistric\s*=\s*function\s*\(\)\s*\{([^}]+)\}', s)
    body = m.group(1).strip() if m else "NOT FOUND"
    print(f"{f}: getdistric -> {body}")
