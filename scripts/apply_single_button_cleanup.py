import os

# 1. Update jbac_web leaders.component.html
web_html_path = os.path.join("src", "app", "jesus", "leaders", "leaders.component.html")
with open(web_html_path, 'r', encoding='utf-8') as f:
    web_content = f.read()

# Replace the button block and badge
old_web_block = """    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-lg-4 col-md-4 mb-3" style="text-align: center;">
                <button type="button" class="btn btn-lg w-100" [style.background-color]="formshow == 1 ? '#00548F' : '#f0f4f8'" [style.color]="formshow == 1 ? '#fff' : '#00548F'" style="font-weight: 600; border: 2px solid #00548F; padding: 12px 24px; border-radius: 8px;" (click)="make(1)">
                    👥 Believers Requests (విశ్వాసులు)
                </button>
            </div>
            <div class="col-lg-4 col-md-4 mb-3" style="text-align: center;">
                <button type="button" class="btn btn-lg w-100" [style.background-color]="formshow == 3 ? '#8b0000' : '#fcf0f0'" [style.color]="formshow == 3 ? '#fff' : '#8b0000'" style="font-weight: 600; border: 2px solid #8b0000; padding: 12px 24px; border-radius: 8px;" (click)="make(3)">
                    ✝️ Pastors Requests (పాస్టర్లు)
                </button>
            </div>
            <div class="col-lg-4 col-md-4 mb-3" style="text-align: center;">
                <button type="button" class="btn btn-lg w-100" [style.background-color]="formshow == 2 ? '#1e7e34' : '#f0fdf4'" [style.color]="formshow == 2 ? '#fff' : '#1e7e34'" style="font-weight: 600; border: 2px solid #1e7e34; padding: 12px 24px; border-radius: 8px;" (click)="make(2)">
                    🎓 Students Requests (విద్యార్థులు)
                </button>
            </div>
        </div>
    </div>

    <!-- Active User Type Filter Indicator -->
    <div class="container mb-3" style="text-align: center;">
        <span class="badge" style="font-size: 0.92rem; padding: 8px 18px; border-radius: 20px; font-weight: 600;"
            [ngStyle]="{
                'background-color': formshow == 1 ? '#e0f2fe' : (formshow == 3 ? '#fee2e2' : '#dcfce7'),
                'color': formshow == 1 ? '#0369a1' : (formshow == 3 ? '#991b1b' : '#166534'),
                'border': '1px solid ' + (formshow == 1 ? '#7dd3fc' : (formshow == 3 ? '#fca5a5' : '#86efac'))
            }">
            📌 ఎంచుకున్న యూజర్ రకం (Selected User Type): 
            <b>{{ formshow == 1 ? 'విశ్వాసులు (Believers)' : (formshow == 3 ? 'పాస్టర్లు (Pastors)' : 'విద్యార్థులు (Students)') }}</b>
            — ఇతర యూజర్ కేటగిరీలు తొలగించబడ్డాయి (Other user types isolated)
        </span>
    </div>"""

new_web_block = """    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-6 mb-3" style="text-align: center;" *ngIf="formshow == 1">
                <button type="button" class="btn btn-lg w-100" style="background-color: #00548F; color: #fff; font-weight: 600; border: 2px solid #00548F; padding: 12px 24px; border-radius: 8px; cursor: default;">
                    👥 Believers Requests (విశ్వాసులు)
                </button>
            </div>
            <div class="col-lg-5 col-md-6 mb-3" style="text-align: center;" *ngIf="formshow == 3">
                <button type="button" class="btn btn-lg w-100" style="background-color: #8b0000; color: #fff; font-weight: 600; border: 2px solid #8b0000; padding: 12px 24px; border-radius: 8px; cursor: default;">
                    ✝️ Pastors Requests (పాస్టర్లు)
                </button>
            </div>
            <div class="col-lg-5 col-md-6 mb-3" style="text-align: center;" *ngIf="formshow == 2">
                <button type="button" class="btn btn-lg w-100" style="background-color: #1e7e34; color: #fff; font-weight: 600; border: 2px solid #1e7e34; padding: 12px 24px; border-radius: 8px; cursor: default;">
                    🎓 Students Requests (విద్యార్థులు)
                </button>
            </div>
        </div>
    </div>"""

if old_web_block in web_content:
    web_content = web_content.replace(old_web_block, new_web_block)
    with open(web_html_path, 'w', encoding='utf-8') as f:
        f.write(web_content)
    print(f"[SUCCESS] Updated {web_html_path}")
else:
    print("[ERROR] Could not match old_web_block in leaders.component.html")

# 2. Update jbac_app wingcommand.html
mobile_html_path = r"C:\Users\rajes\StudioProjects\jbac_app\src\pages\wingcommand\wingcommand.html"
with open(mobile_html_path, 'r', encoding='utf-8') as f:
    mobile_content = f.read()

old_mobile_block = """  <!-- Clean User Type Filter Buttons -->
  <ion-row style="padding: 0 5px;">
    <ion-col col-4 text-center (click)="make(1)">
      <button ion-button block [color]="formshow == 1 ? 'primary' : 'light'" style="font-size: 11px; font-weight: 600;">
        👥 విశ్వాసులు
      </button>
    </ion-col>
    <ion-col col-4 text-center (click)="make(3)">
      <button ion-button block [color]="formshow == 3 ? 'danger' : 'light'" style="font-size: 11px; font-weight: 600;">
        ✝️ పాస్టర్లు
      </button>
    </ion-col>
    <ion-col col-4 text-center (click)="make(2)">
      <button ion-button block [color]="formshow == 2 ? 'secondary' : 'light'" style="font-size: 11px; font-weight: 600;">
        🎓 విద్యార్థులు
      </button>
    </ion-col>
  </ion-row>

  <!-- Filter Indicator Badge -->
  <div style="text-align: center; margin: 8px 10px;">
    <span style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-size: 11px; font-weight: 600; background: #ffffff; color: #00548F; box-shadow: 0 1px 3px rgba(0,0,0,0.12);">
      📌 {{ formshow == 1 ? 'విశ్వాసులు (Believers)' : (formshow == 3 ? 'పాస్టర్లు (Pastors)' : 'విద్యార్థులు (Students)') }} రిక్వెస్ట్‌లు మాత్రమే
    </span>
  </div>"""

new_mobile_block = """  <!-- User Specific Request Header Button -->
  <ion-row style="padding: 0 15px;" justify-content-center>
    <ion-col col-12 text-center *ngIf="formshow == 1">
      <button ion-button block color="primary" style="font-size: 13px; font-weight: 600; height: 42px;">
        👥 Believers Requests (విశ్వాసులు)
      </button>
    </ion-col>
    <ion-col col-12 text-center *ngIf="formshow == 3">
      <button ion-button block color="danger" style="font-size: 13px; font-weight: 600; height: 42px;">
        ✝️ Pastors Requests (పాస్టర్లు)
      </button>
    </ion-col>
    <ion-col col-12 text-center *ngIf="formshow == 2">
      <button ion-button block color="secondary" style="font-size: 13px; font-weight: 600; height: 42px;">
        🎓 Students Requests (విద్యార్థులు)
      </button>
    </ion-col>
  </ion-row>"""

if old_mobile_block in mobile_content:
    mobile_content = mobile_content.replace(old_mobile_block, new_mobile_block)
    with open(mobile_html_path, 'w', encoding='utf-8') as f:
        f.write(mobile_content)
    print(f"[SUCCESS] Updated {mobile_html_path}")
else:
    print("[ERROR] Could not match old_mobile_block in wingcommand.html")

