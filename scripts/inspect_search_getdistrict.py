import subprocess

chunks = ["23.js", "13.js", "14.js", "22.js"]
for f in chunks:
    cmd = ["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "show", f"HEAD:www/build/{f}"]
    s = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8').stdout
    idx = s.find("getdistrict")
    if idx > 0:
        print(f"=== {f} getdistrict ===")
        print(s[idx-50:idx+250])
    else:
        print(f"=== {f} getdistrict NOT FOUND ===")
