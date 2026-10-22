import os

loc = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
chunks = ["23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js"]

all_pass = True
for f in chunks:
    path = os.path.join(loc, f)
    with open(path, "r", encoding="utf-8") as file:
        c = file.read()
    
    has_tpl_state = 'formControlName="state_id"' in c
    has_form_state = ("state_id: ['" in c) or ("state_id: [" in c)
    has_proto = ".prototype.onStateChange = function" in c
    has_telugu = "\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C02" in c # రాష్ట్రం
    
    status = has_tpl_state and has_form_state and has_proto and has_telugu
    if not status:
        all_pass = False
        print(f"[FAIL] {f}: Tpl={has_tpl_state}, Form={has_form_state}, Proto={has_proto}, Telugu={has_telugu}")
    else:
        print(f"[PASS] {f}: Tpl={has_tpl_state}, Form={has_form_state}, Proto={has_proto}, Telugu={has_telugu}")

if all_pass:
    print("\n>>> ALL 12 CHUNKS HAVE VALID TPL, FORM, PROTO, AND TELUGU TEXT! <<<")
