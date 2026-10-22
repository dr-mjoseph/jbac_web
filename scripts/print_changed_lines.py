import subprocess

res = subprocess.run(["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "diff", "-U1", "www/build/23.js"], capture_output=True)
text = res.stdout.decode('utf-8', errors='replace')
lines = text.splitlines()
for l in lines:
    if l.startswith("+") or l.startswith("-"):
        print(l[:100].encode('ascii', 'backslashreplace').decode('ascii'))
