with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('formControlName="district_id"')
print("Index:", idx)
sub = content[idx-100:idx+150]
print(repr(sub.encode('ascii', 'backslashreplace').decode('ascii')))
