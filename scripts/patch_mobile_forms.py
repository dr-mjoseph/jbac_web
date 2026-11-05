import sys

# 1. Patch forms.html
html_path = r'C:\Users\rajes\StudioProjects\jbac_app\src\pages\forms\forms.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html_text = f.read()

if 'gotopage(9)' not in html_text:
    anchor_html = '</ion-content>'
    new_cards = """  <ion-card class="hesd" tappable (click)="gotopage(9)" style="border-left: 5px solid #6366f1; background: linear-gradient(135deg, #e0e7ff, #ffffff);">
    <ion-card-header style="color: #4338ca; font-weight: bold;">
      🚀 ఎంటర్‌ప్రెన్యూర్ రిజిస్టర్ (Entrepreneur Register)
    </ion-card-header>
  </ion-card>
  <ion-card class="hesd" tappable (click)="gotopage(10)" style="border-left: 5px solid #10b981; background: linear-gradient(135deg, #d1fae5, #ffffff);">
    <ion-card-header style="color: #047857; font-weight: bold;">
      💰 ఇన్వెస్టర్ రిజిస్టర్ (Investor Register)
    </ion-card-header>
  </ion-card>
</ion-content>"""
    html_text = html_text.replace(anchor_html, new_cards)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_text)
    print("Successfully patched mobile forms.html!")

# 2. Patch forms.ts
ts_path = r'C:\Users\rajes\StudioProjects\jbac_app\src\pages\forms\forms.ts'
with open(ts_path, 'r', encoding='utf-8') as f:
    ts_text = f.read()

if 'EntrepreneurPage' not in ts_text:
    anchor_ts = "this.navCtrl.push('DoctorregisterPage');\n    }"
    new_cases = """this.navCtrl.push('DoctorregisterPage');
    } else if (id == 9) {
      this.navCtrl.push('EntrepreneurPage');
    } else if (id == 10) {
      this.navCtrl.push('InvestorPage');
    }"""
    ts_text = ts_text.replace(anchor_ts, new_cases)
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(ts_text)
    print("Successfully patched mobile forms.ts!")

