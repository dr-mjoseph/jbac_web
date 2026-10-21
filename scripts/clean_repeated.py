import re

with open('src/app/jesus/update/update.component.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'(\s*\|\|\s*localStorage\.getItem\(\'usr_id\'\))+', " || localStorage.getItem('usr_id')", text)
text = re.sub(r'(\s*\|\|\s*localStorage\.getItem\(\'mobile_number\'\))+', " || localStorage.getItem('mobile_number')", text)

with open('src/app/jesus/update/update.component.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Cleaned successfully!")
