import os
import re

app_root = r"C:\Users\rajes\StudioProjects\jbac_app"

files_to_update = [
    os.path.join(app_root, "config.xml"),
    os.path.join(app_root, "package.json"),
    os.path.join(app_root, "platforms", "android", "app", "src", "main", "AndroidManifest.xml"),
    os.path.join(app_root, "platforms", "android", "app", "src", "main", "res", "xml", "config.xml"),
]

print("=== BUMPING APP VERSION TO 0.0.39 (versionCode 39) ===")

for fpath in files_to_update:
    if not os.path.exists(fpath):
        print(f"Skipping missing file: {fpath}")
        continue
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace version 0.0.38 with 0.0.39
    new_content = content.replace("0.0.38", "0.0.39")
    
    # Replace versionCode 38 with 39
    new_content = re.sub(r'android-versionCode="38"', 'android-versionCode="39"', new_content)
    new_content = re.sub(r'android:versionCode="38"', 'android:versionCode="39"', new_content)
    
    with open(fpath, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_content)
    print(f"Bumped: {fpath}")

print("=== VERSION BUMP COMPLETE ===")
