with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\37.js", "r", encoding="utf-8") as f:
    c = f.read()

idx = c.find('formControlName="state_id"')
print("Index in 37.js:", idx)
if idx > 0:
    sub = c[idx-300:idx+400]
    print(sub.encode('ascii', 'backslashreplace').decode('ascii'))
else:
    print("state_id NOT FOUND in 37.js")
