import re
import urllib.request
import http.cookiejar
import subprocess
import urllib.parse
import os

file_id = '1pBHEk897kQvJmqXXiouCB8STkXWsnAfY'
url = f'https://drive.google.com/uc?export=download&id={file_id}'

cj = http.cookiejar.MozillaCookieJar('cookies.txt')
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

res = opener.open(url)
content = res.read().decode('utf-8', errors='ignore')
cj.save(ignore_discard=True, ignore_expires=True)

action = re.search(r'action="([^"]+)"', content)
inputs = dict(re.findall(r'name="([^"]+)"\s+value="([^"]*)"', content))

if action and inputs:
    target_url = f"{action.group(1)}?{urllib.parse.urlencode(inputs)}"
    print("Target download URL:", target_url)
    cmd = ['curl.exe', '-b', 'cookies.txt', '-L', target_url, '-o', 'home-jbac.zip']
    print("Running:", " ".join(cmd))
    res = subprocess.run(cmd)
    print("Finished with status:", res.returncode)
    if os.path.exists('home-jbac.zip'):
        print("Final size:", os.path.getsize('home-jbac.zip'))
else:
    print("Could not find action/inputs. Content snippet:")
    print(content[:500])
