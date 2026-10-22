import os

loc = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
chunks = ["23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js"]

for chunk in chunks:
    path = os.path.join(loc, chunk)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    idx = content.find("onStateChange")
    if idx > 0:
        # Find start of line or statement
        start = content.rfind("\n", 0, idx)
        if start < 0: start = max(0, idx - 50)
        end = content.find("};", idx) + 2
        method = content[start:end]
        print(f"=== {chunk} onStateChange ===")
        print(method)
    else:
        print(f"=== {chunk}: onStateChange NOT FOUND ===")
