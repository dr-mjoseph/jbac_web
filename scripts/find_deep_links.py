with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\main.js", "r", encoding="utf-8") as f:
    main = f.read()

import re
# Find lazy loaded routes mapping in main.js
# Typically Ionic deep linker or Webpack chunk mapping
matches = re.findall(r'\{[^{}]*name\s*:\s*[\'"][^\'"]+Page[\'"][^{}]*\}', main)
print("Matches found:", len(matches))
for m in matches[:20]:
    print(m)
