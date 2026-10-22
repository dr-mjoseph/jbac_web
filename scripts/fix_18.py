with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js", "r", encoding="utf-8") as f:
    c = f.read()

# Replace the literal backslash-n with a real newline
c_fixed = c.replace(r"state_id: ['1'],\n", "state_id: ['1'],\n")
with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js", "w", encoding="utf-8") as f:
    f.write(c_fixed)

print("Replaced in 18.js")
