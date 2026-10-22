import os

loc = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
for f in ["18.js", "32.js"]:
    with open(os.path.join(loc, f), "r", encoding="utf-8") as file:
        content = file.read()
    idx = content.find("onStateChange")
    print(f"=== Full onStateChange in {f} ===")
    print(content[idx:idx+900])
