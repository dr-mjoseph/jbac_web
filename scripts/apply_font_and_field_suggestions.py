import os
import re

# 1. Update entrepreneurregister.component.html
ent_html_path = 'src/app/jesus/entrepreneurregister/entrepreneurregister.component.html'
with open(ent_html_path, 'r', encoding='utf-8') as f:
    ent_html = f.read()

# Replace state placeholders with 'ఇక్కడ క్లిక్ చేసి ఎంచుకోండి'
ent_html = ent_html.replace(
    '<option value="">-- రాష్ట్రాన్ని ఎంచుకోండి / Select State --</option>',
    '<option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>'
)

ent_html = ent_html.replace(
    "-- జిల్లాను ఎంచుకోండి / Select District --",
    "ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"
)
ent_html = ent_html.replace(
    "-- నియోజకవర్గం ఎంచుకోండి / Select Constituency --",
    "ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"
)
ent_html = ent_html.replace(
    "-- మండలం ఎంచుకోండి / Select Mandal --",
    "ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"
)
ent_html = ent_html.replace(
    "-- పంచాయతీ ఎంచుకోండి / Select Panchayat --",
    "ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"
)
ent_html = ent_html.replace(
    '<option value="">-- వ్యాపార రంగాన్ని ఎంచుకోండి / Select Business Type --</option>',
    '<option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>'
)
ent_html = ent_html.replace(
    '<option value="">-- డినామినేషన్ ఎంచుకోండి / Select Denomination --</option>',
    '<option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>'
)

with open(ent_html_path, 'w', encoding='utf-8') as f:
    f.write(ent_html)
print("Updated entrepreneurregister.component.html")

# 2. Update investorregister.component.html
inv_html_path = 'src/app/jesus/investorregister/investorregister.component.html'
with open(inv_html_path, 'r', encoding='utf-8') as f:
    inv_html = f.read()

inv_html = inv_html.replace(
    '<option value="">-- రాష్ట్రాన్ని ఎంచుకోండి / Select State --</option>',
    '<option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>'
)
inv_html = inv_html.replace(
    "-- జిల్లాను ఎంచుకోండి / Select District --",
    "ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"
)
inv_html = inv_html.replace(
    "-- నియోజకవర్గం ఎంచుకోండి / Select Constituency --",
    "ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"
)
inv_html = inv_html.replace(
    "-- మండలం ఎంచుకోండి / Select Mandal --",
    "ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"
)
inv_html = inv_html.replace(
    "-- పంచాయతీ ఎంచుకోండి / Select Panchayat --",
    "ఇక్కడ క్లిక్ చేసి ఎంచుకోండి"
)
inv_html = inv_html.replace(
    '<option value="">-- ఆసక్తిగల వ్యాపార రంగాన్ని ఎంచుకోండి / Select Interested Sector --</option>',
    '<option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>'
)
inv_html = inv_html.replace(
    '<option value="">-- డినామినేషన్ ఎంచుకోండి / Select Denomination --</option>',
    '<option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>'
)

with open(inv_html_path, 'w', encoding='utf-8') as f:
    f.write(inv_html)
print("Updated investorregister.component.html")

# 3. Update entrepreneurregister.component.css
ent_css_path = 'src/app/jesus/entrepreneurregister/entrepreneurregister.component.css'
ent_css = """@import url('https://fonts.googleapis.com/css2?family=Ramabhadra&display=swap');

:host,
.entrepreneur-reg-container,
.entrepreneur-reg-container * {
  font-family: 'Ramabhadra', sans-serif !important;
}

.entrepreneur-reg-container {
  min-height: 80vh;
}

.hero-card {
  background: linear-gradient(135deg, #1e293b 0%, #312e81 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.section-title {
  border-left: 4px solid #6366f1;
  padding-left: 14px;
}

.form-control, .form-select {
  border-radius: 8px;
  border-color: #cbd5e1;
  font-family: 'Ramabhadra', sans-serif !important;
}

.form-control:focus, .form-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: none;
  border-radius: 10px;
  font-family: 'Ramabhadra', sans-serif !important;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
  transform: translateY(-1px);
}
"""
with open(ent_css_path, 'w', encoding='utf-8') as f:
    f.write(ent_css)
print("Updated entrepreneurregister.component.css with Ramabhadra font")

# 4. Update investorregister.component.css
inv_css_path = 'src/app/jesus/investorregister/investorregister.component.css'
inv_css = """@import url('https://fonts.googleapis.com/css2?family=Ramabhadra&display=swap');

:host,
.investor-reg-container,
.investor-reg-container * {
  font-family: 'Ramabhadra', sans-serif !important;
}

.investor-reg-container {
  min-height: 80vh;
}

.hero-card {
  background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.section-title {
  border-left: 4px solid #10b981;
  padding-left: 14px;
}

.form-control, .form-select {
  border-radius: 8px;
  border-color: #cbd5e1;
  font-family: 'Ramabhadra', sans-serif !important;
}

.form-control:focus, .form-select:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 0.25rem rgba(16, 185, 129, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border: none;
  border-radius: 10px;
  font-family: 'Ramabhadra', sans-serif !important;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #047857 0%, #059669 100%);
  transform: translateY(-1px);
}
"""
with open(inv_css_path, 'w', encoding='utf-8') as f:
    f.write(inv_css)
print("Updated investorregister.component.css with Ramabhadra font")

# 5. Update src/styles.css
styles_path = 'src/styles.css'
with open(styles_path, 'r', encoding='utf-8') as f:
    styles = f.read()

if '.entrepreneur-reg-container' not in styles:
    font_block = """
/* Ramabhadra Font Enforcement for Entrepreneur & Investor Registration */
.entrepreneur-reg-container,
.entrepreneur-reg-container *,
.investor-reg-container,
.investor-reg-container * {
  font-family: 'Ramabhadra', 'Segoe UI', Roboto, sans-serif !important;
}
"""
    styles += font_block
    with open(styles_path, 'w', encoding='utf-8') as f:
        f.write(styles)
    print("Updated src/styles.css")

# 6. Update pastorregister, studentregister, churchregister state placeholders
for form_file in [
    'src/app/jesus/studentregister/studentregister.component.html',
    'src/app/jesus/churchregister/churchregister.component.html',
    'src/app/jesus/doctorregister/doctorregister.component.html',
    'src/app/jesus/organisationregister/organisationregister.component.html',
    'src/app/jesus/ministryregister/ministryregister.component.html'
]:
    if os.path.exists(form_file):
        with open(form_file, 'r', encoding='utf-8') as f:
            c = f.read()
        target = '<option value="1">ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)</option>'
        replacement = '<option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>\n                                                        <option value="1">ఆంధ్రప్రదేశ్ (Andhra Pradesh - AP)</option>'
        if target in c and '<option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>' not in c:
            c = c.replace(target, replacement)
            with open(form_file, 'w', encoding='utf-8') as f:
                f.write(c)
            print(f"Added state placeholder to {form_file}")

