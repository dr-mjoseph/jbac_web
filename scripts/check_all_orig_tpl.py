import subprocess

chunks = ["23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js"]
for f in chunks:
    cmd = ["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "show", f"HEAD:www/build/{f}"]
    raw = subprocess.run(cmd, capture_output=True).stdout
    start_tpl = raw.find(b"template:")
    end_tpl = raw.find(b"/*ion-inline-end:", start_tpl)
    tpl_bytes = raw[start_tpl:end_tpl]
    has_lf = b'\n' in tpl_bytes
    has_cr = b'\r' in tpl_bytes
    print(f"{f:>5}: Original template has raw LF={has_lf}, CR={has_cr}")
