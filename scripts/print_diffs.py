import subprocess

for f in ["www/build/16.js", "www/build/37.js", "www/build/23.js"]:
    res = subprocess.run(["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "diff", f], capture_output=True)
    text = res.stdout.decode('utf-8', errors='replace')
    print(f"=== DIFF {f} ===")
    print(text[:3000].encode('ascii', 'backslashreplace').decode('ascii'))
