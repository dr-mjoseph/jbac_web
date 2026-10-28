with open('src/app/jesus/addads/addads.component.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

# Add enddate to formBuilder
ts = ts.replace(
    "number: ['', [Validators.required, Validators.minLength(10)]],\n      term: [true, [Validators.required]]",
    "number: ['', [Validators.required, Validators.minLength(10)]],\n      term: [true, [Validators.required]],\n      enddate: ['']"
)

# Add enddate in postadds
ts = ts.replace(
    "number: this.addsadding.value.number,\n        usr_id: sessionStorage.getItem('usr_id'),",
    "number: this.addsadding.value.number,\n        enddate: this.addsadding.value.enddate || null,\n        usr_id: sessionStorage.getItem('usr_id'),"
)

with open('src/app/jesus/addads/addads.component.ts', 'w', encoding='utf-8') as f:
    f.write(ts)
print("Updated addads.component.ts")

with open('src/app/jesus/addads/addads.component.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add End Date field after the type and title row
enddate_html = """                                    <div class="row" *ngIf="addsadding.get('type')?.value === 'Meetings'">
                                        <div class="col-md-6 mb-4">
                                            <div class="form-outline">
                                                <label class="form-label">మీటింగ్ ముగింపు తేదీ / Meeting End Date<span
                                                        style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                                <input type="date" formControlName="enddate" class="form-control" />
                                            </div>
                                        </div>
                                    </div>"""

target_pos = html.find('<!-- <div *ngIf="submitted && r[\'title\'].errors"')
if target_pos != -1:
    div_end = html.find('</div>\n                                    </div>\n                                    <br>', target_pos - 100)
    # Let's insert before <div class="row"> with image upload
    img_row = '<div class="row">\n\n                                        <div class="col-md-6 mb-4">\n                                            <label for="formFile"'
    if img_row in html:
        html = html.replace(img_row, enddate_html + '\n                                    <br>\n                                    ' + img_row)
        with open('src/app/jesus/addads/addads.component.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Updated addads.component.html")
    else:
        print("img_row not found in html")
else:
    print("target_pos not found in html")

