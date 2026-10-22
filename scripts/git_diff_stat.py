import subprocess

res = subprocess.run(["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "diff", "--stat", "www/build"], capture_output=True, text=True)
print(res.stdout)
