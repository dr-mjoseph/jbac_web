import re
import json

app_root = r"c:\Users\rajes\StudioProjects\jbac_app"

# 1. Update config.xml
config_xml_path = f"{app_root}\\config.xml"
with open(config_xml_path, "r", encoding="utf-8") as f:
    c = f.read()
c = re.sub(r'android-versionCode="\d+"', 'android-versionCode="29"', c)
c = re.sub(r'version="0\.0\.\d+"', 'version="0.0.29"', c)
c = re.sub(r'<preference name="android-targetSdkVersion" value="\d+" />', '<preference name="android-targetSdkVersion" value="36" />', c)
with open(config_xml_path, "w", encoding="utf-8") as f:
    f.write(c)
print("Updated config.xml to version 0.0.29 (code 29) and targetSdkVersion 36.")

# 2. Update platforms/android/app/src/main/res/xml/config.xml
res_config_path = f"{app_root}\\platforms\\android\\app\\src\\main\\res\\xml\\config.xml"
with open(res_config_path, "r", encoding="utf-8") as f:
    rc = f.read()
rc = re.sub(r'android-versionCode="\d+"', 'android-versionCode="29"', rc)
rc = re.sub(r'version="0\.0\.\d+"', 'version="0.0.29"', rc)
rc = re.sub(r'<preference name="android-targetSdkVersion" value="\d+" />', '<preference name="android-targetSdkVersion" value="36" />', rc)
with open(res_config_path, "w", encoding="utf-8") as f:
    f.write(rc)
print("Updated res/xml/config.xml to targetSdkVersion 36.")

# 3. Update AndroidManifest.xml
manifest_path = f"{app_root}\\platforms\\android\\app\\src\\main\\AndroidManifest.xml"
with open(manifest_path, "r", encoding="utf-8") as f:
    m = f.read()
m = re.sub(r'android:versionCode="\d+"', 'android:versionCode="29"', m)
m = re.sub(r'android:versionName="[^"]+"', 'android:versionName="0.0.29"', m)
with open(manifest_path, "w", encoding="utf-8") as f:
    f.write(m)
print("Updated AndroidManifest.xml to version 29 (0.0.29).")

# 4. Update app/build.gradle to explicitly enforce targetSdkVersion 36
build_gradle_path = f"{app_root}\\platforms\\android\\app\\build.gradle"
with open(build_gradle_path, "r", encoding="utf-8") as f:
    bg = f.read()

# Replace targetSdkVersion cordovaConfig.SDK_VERSION with targetSdkVersion 36
bg = re.sub(r'targetSdkVersion\s+cordovaConfig\.SDK_VERSION', 'targetSdkVersion 36', bg)
with open(build_gradle_path, "w", encoding="utf-8") as f:
    f.write(bg)
print("Updated app/build.gradle to enforce targetSdkVersion 36.")
