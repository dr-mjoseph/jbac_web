import subprocess

chunks = ["18.js", "16.js", "35.js", "38.js", "37.js", "12.js", "41.js", "32.js"]
for f in chunks:
    cmd = ["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "show", f"HEAD:www/build/{f}"]
    s = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8').stdout
    idx = s.find(".prototype.getdistric")
    if idx > 0:
        print(f"=== {f} getdistric ===")
        print(s[idx:idx+250])
    else:
        print(f"=== {f} getdistric NOT FOUND ===")
