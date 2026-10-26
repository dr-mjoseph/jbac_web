import os, re

target_components = [
    "pastorregister",
    "pastorassociationregister",
    "addbusiness",
    "addmarriages",
    "addjobs"
]

base_dir = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

for comp in target_components:
    ts_file = os.path.join(base_dir, comp, f"{comp}.component.ts")
    print(f"=== {comp} ===")
    if os.path.exists(ts_file):
        with open(ts_file, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        for idx, line in enumerate(lines):
            if any(k in line for k in ["post", "submit", "state_id", "state", "service."]) and not ("//" in line and line.strip().startswith("//")):
                if any(submit_word in line.lower() for submit_word in ["post", "state_id", "state:"]):
                    print(f"  {idx+1}: {line.strip()[:100]}")
