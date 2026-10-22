import os
import shutil
import hashlib

src_loc = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
dst_loc = r"C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\src\main\assets\www\build"

files = ["main.js", "23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js"]

all_match = True
for f in files:
    src = os.path.join(src_loc, f)
    dst = os.path.join(dst_loc, f)
    shutil.copyfile(src, dst)
    
    with open(src, "rb") as f1, open(dst, "rb") as f2:
        h1 = hashlib.sha256(f1.read()).hexdigest()
        h2 = hashlib.sha256(f2.read()).hexdigest()
    
    if h1 == h2:
        print(f"[SYNC OK] {f:>10}: SHA256 matches ({h1[:10]}...)")
    else:
        print(f"[SYNC FAIL] {f:>10}: HASH MISMATCH!")
        all_match = False

if all_match:
    print("\n>>> ALL 13 ASSET FILES SYNCHRONIZED AND VERIFIED 100%! <<<")
