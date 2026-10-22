with open(r"C:\Users\rajes\StudioProjects\jbac_app\www\build\main.js", "r", encoding="utf-8") as f:
    main = f.read()

import re
matches = re.findall(r'[\'"]\.\./pages/([^/]+)/[^\'"]+module[\'"]\s*:\s*\[\s*(\d+)\s*,\s*(\d+)', main)
for page, mod_id, chunk_id in sorted(matches):
    print(f"{page:25} -> Chunk {chunk_id:>2}.js (Module {mod_id})")
