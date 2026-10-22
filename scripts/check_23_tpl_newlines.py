with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js", "rb") as f:
    raw = f.read()

start_tpl = raw.find(b"template:")
end_tpl = raw.find(b"/*ion-inline-end:", start_tpl)
tpl_bytes = raw[start_tpl:end_tpl]
print("23.js Has raw 0x0A (LF) in template:", b'\n' in tpl_bytes)
print("23.js Has raw 0x0D (CR) in template:", b'\r' in tpl_bytes)
