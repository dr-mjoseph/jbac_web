import glob
import re

for f in glob.glob('src/app/jesus/**/*.html', recursive=True):
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    matches = re.findall(r'<select[^>]*formControlName=["\']state_id["\'][^>]*>([\s\S]*?)</select>', c)
    for m in matches:
        if 'value=""' not in m and "value=''" not in m:
            print(f'Missing empty option in: {f}')

