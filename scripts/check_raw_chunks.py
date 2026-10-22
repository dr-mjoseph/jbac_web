import os

loc = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
chunks = ["23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js"]

for chunk in chunks:
    path = os.path.join(loc, chunk)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if "\n" appears outside quotes
    # Specifically near state_id
    if r"state_id: ['" in content:
        idx = content.find(r"state_id: ['")
        sub = content[idx:idx+80]
        print(f"{chunk}: {repr(sub)}")
