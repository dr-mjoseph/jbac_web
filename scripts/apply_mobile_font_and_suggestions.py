import os

mobile_dir = r'C:\Users\rajes\StudioProjects\jbac_app'

# 1. Update entrepreneur.html
ent_html_path = os.path.join(mobile_dir, 'src', 'pages', 'entrepreneur', 'entrepreneur.html')
with open(ent_html_path, 'r', encoding='utf-8') as f:
    ent_html = f.read()

ent_html = ent_html.replace('placeholder="రాష్ట్రాన్ని ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
ent_html = ent_html.replace('placeholder="జిల్లాను ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
ent_html = ent_html.replace('placeholder="నియోజకవర్గాన్ని ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
ent_html = ent_html.replace('placeholder="మండలాన్ని ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
ent_html = ent_html.replace('placeholder="పంచాయతీని ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
ent_html = ent_html.replace('placeholder="వ్యాపార రంగాన్ని ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
ent_html = ent_html.replace('placeholder="డినామినేషన్ ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')

with open(ent_html_path, 'w', encoding='utf-8') as f:
    f.write(ent_html)
print("Updated mobile entrepreneur.html")

# 2. Update investor.html
inv_html_path = os.path.join(mobile_dir, 'src', 'pages', 'investor', 'investor.html')
with open(inv_html_path, 'r', encoding='utf-8') as f:
    inv_html = f.read()

inv_html = inv_html.replace('placeholder="రాష్ట్రాన్ని ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
inv_html = inv_html.replace('placeholder="జిల్లాను ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
inv_html = inv_html.replace('placeholder="నియోజకవర్గాన్ని ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
inv_html = inv_html.replace('placeholder="మండలాన్ని ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
inv_html = inv_html.replace('placeholder="పంచాయతీని ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
inv_html = inv_html.replace('placeholder="ఆసక్తిగల రంగాన్ని ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')
inv_html = inv_html.replace('placeholder="డినామినేషన్ ఎంచుకోండి"', 'placeholder="ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"')

with open(inv_html_path, 'w', encoding='utf-8') as f:
    f.write(inv_html)
print("Updated mobile investor.html")

# 3. Update entrepreneur.scss
ent_scss_path = os.path.join(mobile_dir, 'src', 'pages', 'entrepreneur', 'entrepreneur.scss')
with open(ent_scss_path, 'r', encoding='utf-8') as f:
    ent_scss = f.read()

if "font-family: 'Ramabhadra'" not in ent_scss:
    ent_scss = "page-entrepreneur {\n  font-family: 'Ramabhadra', sans-serif !important;\n  * {\n    font-family: 'Ramabhadra', sans-serif !important;\n  }\n}\n\n" + ent_scss
    with open(ent_scss_path, 'w', encoding='utf-8') as f:
        f.write(ent_scss)
    print("Updated mobile entrepreneur.scss with Ramabhadra")

# 4. Update investor.scss
inv_scss_path = os.path.join(mobile_dir, 'src', 'pages', 'investor', 'investor.scss')
with open(inv_scss_path, 'r', encoding='utf-8') as f:
    inv_scss = f.read()

if "font-family: 'Ramabhadra'" not in inv_scss:
    inv_scss = "page-investor {\n  font-family: 'Ramabhadra', sans-serif !important;\n  * {\n    font-family: 'Ramabhadra', sans-serif !important;\n  }\n}\n\n" + inv_scss
    with open(inv_scss_path, 'w', encoding='utf-8') as f:
        f.write(inv_scss)
    print("Updated mobile investor.scss with Ramabhadra")

