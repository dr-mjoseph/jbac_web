import subprocess

cmd = ["git", "-C", r"C:\Users\rajes\StudioProjects\jbac_app", "show", "HEAD:www/build/23.js"]
raw = subprocess.run(cmd, capture_output=True).stdout

start_tpl = raw.find(b"template:")
end_tpl = raw.find(b"/*ion-inline-end:", start_tpl)
tpl_bytes = raw[start_tpl:end_tpl]
print("ORIGINAL 23.js Has raw 0x0A (LF) in template:", b'\n' in tpl_bytes)
print("ORIGINAL 23.js Has raw 0x0D (CR) in template:", b'\r' in tpl_bytes)
print("Length of original tpl:", len(tpl_bytes))
print("First 200 bytes of original tpl:", tpl_bytes[:200])
