import os

loc = r"C:\Users\rajes\StudioProjects\jbac_app\www\build"
chunks = ["23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js", "main.js"]

all_clean = True
for f in chunks:
    path = os.path.join(loc, f)
    with open(path, "rb") as file:
        header = file.read(20)
    has_bom = (header[:3] == b'\xef\xbb\xbf')
    starts_webpack = header.startswith(b'webpackJsonp')
    if has_bom or not starts_webpack:
        print(f"[FAIL] {f}: has_bom={has_bom}, header={repr(header[:15])}")
        all_clean = False
    else:
        print(f"[PASS] {f}: NO BOM, starts cleanly with {repr(header[:12].decode('ascii'))}")

if all_clean:
    print("\n>>> ALL CHUNKS AND MAIN.JS HAVE ZERO BOM! <<<")
