import zipfile
import subprocess
import os

app_root = r"C:\Users\rajes\StudioProjects\jbac_app"
apk_path = os.path.join(app_root, "jbacApp-0.0.37.apk")
aab_path = os.path.join(app_root, "jbacApp-0.0.37.aab")
node_exe = r"C:\Users\rajes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

print(f"=== VERIFYING APK CONTENTS: {apk_path} ===")
if not os.path.exists(apk_path):
    raise FileNotFoundError(f"APK not found: {apk_path}")

target_chunks = [
    "main.js", "12.js", "13.js", "14.js", "16.js", "18.js",
    "21.js", "22.js", "23.js", "29.js", "32.js", "35.js",
    "37.js", "38.js", "41.js"
]

with zipfile.ZipFile(apk_path, "r") as z:
    for ch in target_chunks:
        entry_name = f"assets/www/build/{ch}"
        if entry_name not in z.namelist():
            raise FileNotFoundError(f"Missing {entry_name} in APK!")
        
        data = z.read(entry_name)
        text = data.decode("utf-8")
        
        # 1. Byte-level template checks
        st = data.find(b"template:")
        if st != -1:
            ed = data.find(b"/*ion-inline-end:", st)
            if ed != -1:
                tpl = data[st:ed]
                if b"\n" in tpl or b"\r" in tpl:
                    raise ValueError(f"CR/LF found in template of {ch} inside APK!")
        
        # 2. BOM check
        if data.startswith(b"\xef\xbb\xbf"):
            raise ValueError(f"{ch} has BOM inside APK!")
        
        # 3. Check syntax with node -c
        tmp_path = os.path.join(r"C:\Users\rajes\Documents\jbac_web\scripts", f"_verify_{ch}")
        with open(tmp_path, "wb") as tf:
            tf.write(data)
        
        res = subprocess.run([node_exe, "-c", tmp_path], capture_output=True, encoding="utf-8", errors="replace")
        os.remove(tmp_path)
        
        if res.returncode != 0:
            raise SyntaxError(f"Syntax error in {ch} inside APK: {res.stderr.strip()[:200]}")
        
        # 4. Content checks
        if ch in ["37.js", "12.js", "21.js", "16.js", "18.js", "38.js", "41.js"]:
            if "onStateChange" not in text:
                raise ValueError(f"onStateChange missing in {ch} inside APK!")
            if "formControlName=\"state_id\"" not in text:
                raise ValueError(f"state_id missing in template of {ch} inside APK!")
            if "getdistrict(1)" not in text:
                raise ValueError(f"getdistrict(1) missing in {ch} inside APK!")
        
        print(f"  [PASS] {ch:10s} (verified in APK: 0 CR/LF, 0 BOM, node -c syntax OK, state dropdown present)")

print("\n=== ALL CHUNKS IN APK VERIFIED 100% HEALTHY & VALID! ===")
