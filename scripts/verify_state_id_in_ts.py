import glob
import re

for html_file in glob.glob('src/app/jesus/**/*.html', recursive=True):
    ts_file = html_file.replace('.html', '.ts')
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()
    if 'state_id' in html and 'formControlName' in html:
        try:
            with open(ts_file, 'r', encoding='utf-8') as f:
                ts = f.read()
            if 'state_id' not in ts:
                print(f'MISSING state_id in {ts_file}')
            else:
                print(f'OK: {ts_file}')
        except Exception as e:
            print(f'Error reading {ts_file}: {e}')

