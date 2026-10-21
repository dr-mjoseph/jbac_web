import re

p = r'C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\src\main\AndroidManifest.xml'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'android:versionCode="[0-9]+"', 'android:versionCode="34"', c)
c = re.sub(r'android:versionName="[0-9.]+"', 'android:versionName="0.0.34"', c)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated AndroidManifest.xml to versionCode 34, versionName 0.0.34')
