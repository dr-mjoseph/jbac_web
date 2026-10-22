with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\main.js", "r", encoding="utf-8") as f:
    main = f.read()

import re
# Find chunk mapping object
# e.g. "./pages/believer/believer.module": [ 37, ... ] or similar
m = re.findall(r'[\'"][^\'"]*pages/[^\'"]*module[\'"]\s*:\s*\[\s*(\d+)', main)
print("Found async context entries:", len(m))

m2 = re.findall(r'(\d+)\s*:\s*[\'"]pages/[^\'"]*[\'"]', main)
print("Found reverse entries:", len(m2))

# Search for believer.module
idx = main.find("believer.module")
if idx > 0:
    print("Around believer.module:")
    print(main[idx-50:idx+150])
