with open('src/app/jesus/addads/addads.component.html', 'r', encoding='utf-8') as f:
    html = f.read()

enddate_field = """                                    </div>
                                    <div class="row" *ngIf="addsadding.get('type')?.value === 'Meetings'">
                                        <div class="col-md-6 mb-4">
                                            <div class="form-outline">
                                                <label class="form-label">మీటింగ్ ముగింపు తేదీ / Meeting End Date<span
                                                        style="color:red; -webkit-text-stroke-width:thick;">*</span></label>
                                                <input type="date" formControlName="enddate" class="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <br>
                                    <div class="row">"""

old_block = """                                    </div>
                                    <br>
                                    <div class="row">"""

if old_block in html:
    html = html.replace(old_block, enddate_field, 1)
    with open('src/app/jesus/addads/addads.component.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Patched addads.component.html successfully")
else:
    old_crlf = old_block.replace('\n', '\r\n')
    if old_crlf in html:
        html = html.replace(old_crlf, enddate_field.replace('\n', '\r\n'), 1)
        with open('src/app/jesus/addads/addads.component.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Patched addads.component.html CRLF successfully")
    else:
        print("Could not find old_block")

