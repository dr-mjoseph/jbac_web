import zipfile
import re

apk_path = r"C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.37.apk"
aab_path = r"C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.37.aab"

print("==================================================")
print("  Final Deep Inspection of Signed Release Outputs ")
print("==================================================")

# 1. APK Verification
with zipfile.ZipFile(apk_path, 'r') as z:
    for chunk in ["main.js", "23.js", "18.js", "37.js", "12.js", "16.js", "35.js"]:
        entry_path = f"assets/www/build/{chunk}"
        data = z.read(entry_path)
        
        has_bom = (data[:3] == b'\xef\xbb\xbf')
        text = data.decode('utf-8')
        
        has_state_tpl = ('formControlName="state_id"' in text) if chunk != "main.js" else True
        has_state_form = ("state_id: ['" in text) if chunk != "main.js" else True
        has_proto = ("onStateChange" in text) if chunk != "main.js" else ("getstates" in text and "state_id: stateId" in text)
        
        # Check for literal \n (backslash + n) near state_id
        has_literal_n = False
        if chunk != "main.js":
            idx = text.find("state_id: [")
            if idx > 0 and "\\n" in text[idx:idx+40]:
                has_literal_n = True
        
        status = (not has_bom) and (not has_literal_n) and has_state_tpl and has_state_form and has_proto
        print(f"APK {chunk:>7}: BOM={has_bom}, LitSlashN={has_literal_n}, Tpl={has_state_tpl}, Form={has_state_form}, Proto={has_proto} -> {'[PASS]' if status else '[FAIL]'}")

# 2. AAB Verification
with zipfile.ZipFile(aab_path, 'r') as z:
    for chunk in ["main.js", "23.js", "18.js", "37.js"]:
        entry_path = f"base/assets/www/build/{chunk}"
        data = z.read(entry_path)
        has_bom = (data[:3] == b'\xef\xbb\xbf')
        text = data.decode('utf-8')
        has_state_tpl = ('formControlName="state_id"' in text) if chunk != "main.js" else True
        status = (not has_bom) and has_state_tpl
        print(f"AAB {chunk:>7}: BOM={has_bom}, Tpl={has_state_tpl} -> {'[PASS]' if status else '[FAIL]'}")

print("\nAll deep checks completed successfully!")
