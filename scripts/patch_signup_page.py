import sys

with open('src/app/jesus/signup/signup.component.html', 'r', encoding='utf-8') as f:
    text = f.read()

anchor = '''            <div class="col-12 col-sm-2">
                <br>
                <button type="button" class="btn btn-primary" routerLink="/doctorregister" style="background-color: #00548F; border-color: #00548F; font-weight: bold;">
                    <i class="fa fa-user-md me-1"></i> DOCTOR REGISTER
                </button>
            </div>'''

new_btns = '''            <div class="col-12 col-sm-2">
                <br>
                <button type="button" class="btn btn-primary" routerLink="/doctorregister" style="background-color: #00548F; border-color: #00548F; font-weight: bold;">
                    <i class="fa fa-user-md me-1"></i> DOCTOR REGISTER
                </button>
            </div>
            <div class="col-12 col-sm-2">
                <br>
                <button type="button" class="btn btn-primary" routerLink="/entrepreneurregister" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border: none; font-weight: bold; color: #fff;">
                    🚀 ENTREPRENEUR
                </button>
            </div>
            <div class="col-12 col-sm-2">
                <br>
                <button type="button" class="btn btn-success" routerLink="/investorregister" style="background: linear-gradient(135deg, #059669, #10b981); border: none; font-weight: bold; color: #fff;">
                    💰 INVESTOR
                </button>
            </div>'''

if anchor in text and '/entrepreneurregister' not in text:
    text = text.replace(anchor, new_btns)
    with open('src/app/jesus/signup/signup.component.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully patched signup.component.html!")
