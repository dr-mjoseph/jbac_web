import os

base = r"c:\Users\rajes\Documents\jbac_web\src\app\jesus"

for s_comp in ["institute", "marriages", "jobs", "business", "organization"]:
    ts_path = os.path.join(base, s_comp, f"{s_comp}.component.ts")
    with open(ts_path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Check onDistrictChange
    has_const_reset = "constenncy_id: ''" in c
    has_mand_reset = "mandal_id: ''" in c
    has_panch_reset = "panchayati_id: ''" in c
    print(f"{s_comp}: const_reset={has_const_reset}, mand_reset={has_mand_reset}, panch_reset={has_panch_reset}")
