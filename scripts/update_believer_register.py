import re

# 1. Update believerregister.component.ts
with open('src/app/jesus/believerregister/believerregister.component.ts', 'r', encoding='utf-8') as f:
    ts_code = f.read()

# Add getleaderlevels() in ngOnInit and define method
if 'this.getleaderlevels();' not in ts_code:
    ts_code = ts_code.replace(
        'this.getwing();',
        'this.getwing();\n    this.getleaderlevels();'
    )

if 'leaderlevel: any' not in ts_code:
    ts_code = ts_code.replace(
        'getwing() {',
        '''leaderlevel: any = [];
  getleaderlevels() {
    this.service.getleaderlevel().subscribe((res: any) => {
      this.leaderlevel = res && res.data ? res.data : [];
    }, error => {
      this.leaderlevel = [];
    });
  }
  getwing() {'''
    )

with open('src/app/jesus/believerregister/believerregister.component.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("Updated believerregister.component.ts successfully")

# 2. Update believerregister.component.html
with open('src/app/jesus/believerregister/believerregister.component.html', 'r', encoding='utf-8') as f:
    html_code = f.read()

old_html_block = """                                        <div class="col-md-6 mb-4 pb-2" *ngIf="wingtype">
                                            <div class="form-outline">
                                                <label class="form-label">వింగ్  లీడర్ కేటగిరి</label>
                                                <select class="form-control" formControlName="wingtype"
                                                    style="height:37px;width: 273px;">
                                                    <option value="" selected disabled>Select Wing Leadership
                                                    </option>
                                                    <option value="{{item.id}}" *ngFor="let item of wings">
                                                        {{item.position}}
                                                    </option>
                                                </select>

                                            </div>
                                        </div>

                                        <div class="col-md-6 mb-4 pb-2" *ngIf="wingtypes">
                                            <div class="form-outline">
                                                <label class="form-label">వింగ్  లీడర్ కేటగిరి
                                                </label>
                                                <select class="form-control" formControlName="wingtypes"
                                                    style="height:37px;width: 273px;">
                                                    <option value="">Select Wing Leadership</option>
                                                    <option value="Driver">Driver</option>
                                                    <option value="Socialmedia">Social media</option>
                                                    <option value="Papermedia">Paper media</option>
                                                    <option value="MeadiaReporters">Meadia Reporters</option>
                                                </select>

                                            </div>
                                        </div>"""

new_html_block = """                                        <div class="col-md-6 mb-4 pb-2" *ngIf="wingtypes">
                                            <div class="form-outline">
                                                <label class="form-label">వింగ్ లీడర్ కేటగిరి</label>
                                                <select class="form-control" formControlName="wingtypes"
                                                    style="height:37px;width: 273px;">
                                                    <option value="" selected disabled>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>
                                                    <option value="{{item.id}}" *ngFor="let item of wings">
                                                        {{item.position}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="col-md-6 mb-4" *ngIf="wingtype">
                                            <div class="form-outline">
                                                <label class="form-label" for="pattern_name">మీరు చేయగలిగిన వింగ్ లీడర్ షిప్ లెవెల్ ఎంచుకోండి<span
                                                        style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                                <select class="form-control" formControlName="wingtype"
                                                    style="height:37px;width: 273px;" (change)="onsubward($event)">
                                                    <option value="" selected disabled>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</option>
                                                    <option *ngFor="let i of leaderlevel" value="{{i.id}}">
                                                        {{i.level}}</option>
                                                </select>
                                            </div>
                                        </div>"""

if old_html_block in html_code:
    html_code = html_code.replace(old_html_block, new_html_block)
    with open('src/app/jesus/believerregister/believerregister.component.html', 'w', encoding='utf-8') as f:
        f.write(html_code)
    print("Updated believerregister.component.html successfully")
else:
    print("Warning: old_html_block not found in believerregister.component.html")

