import sys

# 1. Update package.json
pkg_path = r'C:\Users\rajes\StudioProjects\jbac_app\package.json'
with open(pkg_path, 'r', encoding='utf-8') as f:
    pkg = f.read()
pkg = pkg.replace('"version": "0.0.47"', '"version": "0.0.48"')
with open(pkg_path, 'w', encoding='utf-8') as f:
    f.write(pkg)
print("1. Updated package.json")

# 2. Update config.xml
cfg_path = r'C:\Users\rajes\StudioProjects\jbac_app\config.xml'
with open(cfg_path, 'r', encoding='utf-8') as f:
    cfg = f.read()
cfg = cfg.replace('android-versionCode="47"', 'android-versionCode="48"')
cfg = cfg.replace('version="0.0.47"', 'version="0.0.48"')
with open(cfg_path, 'w', encoding='utf-8') as f:
    f.write(cfg)
print("2. Updated config.xml")

# 3. Update platforms/android/app/build.gradle
bg_path = r'C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\build.gradle'
with open(bg_path, 'r', encoding='utf-8') as f:
    bg = f.read()
bg = bg.replace('versionName "0.0.47"', 'versionName "0.0.48"')
with open(bg_path, 'w', encoding='utf-8') as f:
    f.write(bg)
print("3. Updated platforms/android/app/build.gradle")

# 4. Update platforms/android/app/src/main/AndroidManifest.xml
mf_path = r'C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\src\main\AndroidManifest.xml'
with open(mf_path, 'r', encoding='utf-8') as f:
    mf = f.read()
mf = mf.replace('android:versionCode="47" android:versionName="0.0.47"', 'android:versionCode="48" android:versionName="0.0.48"')
with open(mf_path, 'w', encoding='utf-8') as f:
    f.write(mf)
print("4. Updated AndroidManifest.xml")

print("All version updates to 0.0.48 (versionCode 48) completed successfully!")

