import os
import re

loc = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
chunks = ["23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js"]

all_clean = True
for f in chunks:
    path = os.path.join(loc, f)
    with open(path, "r", encoding="utf-8") as file:
        c = file.read()
    
    # Check if there is literal backslash followed by n near state_id
    idx = c.find("state_id: [")
    if idx < 0:
        print(f"[FAIL] {f}: state_id: [ NOT FOUND")
        all_clean = False
        continue
    
    sub = c[idx:idx+40]
    # Check if raw string contains literal \n (backslash + n)
    if "\\n" in sub:
        print(f"[FAIL] {f}: literal \\n found in JS code: {repr(sub)}")
        all_clean = False
    else:
        print(f"[PASS] {f}: clean JS code: {repr(sub[:25])}")

if all_clean:
    print("\n>>> ALL 12 CHUNKS HAVE CLEAN JAVASCRIPT FOR STATE_ID! <<<")
