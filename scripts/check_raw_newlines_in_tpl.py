with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\37.js", "rb") as f:
    raw = f.read()

idx = raw.find(b'formControlName="state_id"')
print("Snippet around state_id (raw bytes):")
print(raw[idx-100:idx+150])

# Check if there is an unescaped ASCII 10 (0x0A) or ASCII 13 (0x0D) inside template
# The template starts at:
start_tpl = raw.find(b"template:")
end_tpl = raw.find(b"/*ion-inline-end:", start_tpl)
tpl_bytes = raw[start_tpl:end_tpl]
print("Has raw 0x0A (LF) in template:", b'\n' in tpl_bytes)
print("Has raw 0x0D (CR) in template:", b'\r' in tpl_bytes)
