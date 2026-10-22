import subprocess
import difflib

res = subprocess.run(["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "show", "HEAD:www/build/23.js"], capture_output=True)
orig = res.stdout.decode('utf-8', errors='replace')
with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js", "r", encoding="utf-8") as f:
    curr = f.read()

# Find the template string in both
idx1 = orig.find("template:/*ion-inline-start:")
idx2 = curr.find("template:/*ion-inline-start:")

t_orig = orig[idx1:idx1+15000]
t_curr = curr[idx2:idx2+15000]

print("Original template length:", len(t_orig))
print("Current template length:", len(t_curr))

diff = difflib.unified_diff(t_orig.splitlines(), t_curr.splitlines(), lineterm='')
for line in list(diff)[:30]:
    print(line.encode('ascii', 'backslashreplace').decode('ascii'))
