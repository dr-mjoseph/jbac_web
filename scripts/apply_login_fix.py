with open('src/app/jesus/login/login.component.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if 'Quick Demo Login' in line or 'fillDemoUser' in line:
        continue
    # Check if this line is part of the demo login container
    if 'rgba(35, 126, 141, 0.08)' in line:
        skip = True
        continue
    if skip and '</div>' in line:
        # Check if closing the container
        skip = False
        continue
    new_lines.append(line)

# Let's inspect lines around line 100-130
with open('src/app/jesus/login/login.component.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Regex to remove the entire row containing Quick Demo Login
cleaned = re.sub(r'\r?\n\s*<div class="row mb-3">\s*<div class="col-md-3 mb-2"></div>\s*<div class="col-md-8 mb-2">.*?Quick Demo Login.*?</div>\s*</div>\s*<div class="col-md-1 mb-2"></div>\s*</div>', '', text, flags=re.DOTALL)

if cleaned != text:
    with open('src/app/jesus/login/login.component.html', 'w', encoding='utf-8') as f:
        f.write(cleaned)
    print("SUCCESS: Quick demo login removed!")
else:
    print("Regex did not match, trying alternative")
    # Find start and end indices
    start_idx = text.find('Quick Demo Login')
    if start_idx != -1:
        row_start = text.rfind('<div class="row mb-3">', 0, start_idx)
        row_end = text.find('</div>', text.find('fillDemoUser(\'8\')', start_idx))
        row_end = text.find('</div>', row_end + 1)
        row_end = text.find('</div>', row_end + 1)
        row_end = text.find('</div>', row_end + 1)
        print("Slices:", row_start, row_end)
        cleaned = text[:row_start] + text[row_end + 6:]
        with open('src/app/jesus/login/login.component.html', 'w', encoding='utf-8') as f:
            f.write(cleaned)
        print("SUCCESS via index slice")

