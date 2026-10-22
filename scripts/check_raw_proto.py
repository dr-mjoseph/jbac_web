import os

loc = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
chunks = ["23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js"]

for chunk in chunks:
    path = os.path.join(loc, chunk)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    idx = content.find("onStateChange = function")
    if idx > 0:
        sub = content[idx:idx+150]
        print(f"{chunk} proto: {repr(sub)}")
    else:
        print(f"{chunk} proto: NOT FOUND")
