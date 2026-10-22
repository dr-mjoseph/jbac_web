import os
import re

app_root = r"C:\Users\rajes\StudioProjects\jbac_app"
loc = os.path.join(app_root, "www", "build")

rashtram = "\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C02"  # రాష్ట్రం
anni = "\u0C05\u0C28\u0C4D\u0C28\u0C40"              # అన్నీ
ap = "\u0C06\u0C02\u0C27\u0C4D\u0C30\u0C2A\u0C4D\u0C30\u0C26\u0C47\u0C36\u0C4D"  # ఆంధ్రప్రదేశ్
tg = "\u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23"          # తెలంగాణ

# 1. Patch main.js
main_path = os.path.join(loc, "main.js")
with open(main_path, "r", encoding="utf-8") as f:
    main_c = f.read()

main_target = """ServiceProvider.prototype.getdistrict = function () {
        return this.http.post(this.testApi + 'getdistricts', []);
    };"""

main_replacement = """ServiceProvider.prototype.getstates = function () {
        return this.http.post(this.testApi + 'getstates', {});
    };
    ServiceProvider.prototype.getdistrict = function (stateId) {
        var payload = (stateId !== undefined && stateId !== null && stateId !== '' && stateId !== 'all') ? { state_id: stateId } : {};
        return this.http.post(this.testApi + 'getdistricts', payload);
    };"""

if "state_id: stateId" not in main_c:
    if main_target in main_c:
        main_c = main_c.replace(main_target, main_replacement)
    else:
        main_c = re.sub(r'ServiceProvider\.prototype\.getdistrict\s*=\s*function\s*\(\)\s*\{[\s\S]*?getdistricts[\s\S]*?\};', main_replacement, main_c)
    with open(main_path, "w", encoding="utf-8") as f:
        f.write(main_c)
    print("[OK] main.js patched")
else:
    print("[ALREADY] main.js")

# 2. Helper to patch chunk
def patch_chunk_file(file_name, class_name, dist_field, is_search, col_tag):
    path = os.path.join(loc, file_name)
    with open(path, "r", encoding="utf-8") as f:
        c = f.read()
    
    # 1. Template
    if 'formControlName="state_id"' not in c:
        search_target = f'formControlName="{dist_field}"'
        idx_select = c.find(search_target)
        if idx_select > 0:
            idx_col = c.rfind('<ion-col', 0, idx_select)
            idx_item = c.rfind('<ion-item', 0, idx_select)
            
            insert_pos = idx_item if col_tag is None else idx_col
            
            if is_search:
                options = (
                    r'\n\n              <ion-option value="">' + anni + r' (All States)</ion-option>'
                    r'\n\n              <ion-option value="1">' + ap + r' (AP)</ion-option>'
                    r'\n\n              <ion-option value="2">' + tg + r' (TG)</ion-option>'
                )
                req_star = ''
            else:
                options = (
                    r'\n\n              <ion-option value="1">' + ap + r' (AP)</ion-option>'
                    r'\n\n              <ion-option value="2">' + tg + r' (TG)</ion-option>'
                )
                req_star = r' <span style="color:red; ">*</span>'
            
            if col_tag is None:
                state_snippet = (
                    r'<ion-item>\n\n'
                    r'          <ion-label stacked>' + rashtram + r' / State' + req_star + r'</ion-label>\n\n'
                    r'          <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">' + options +
                    r'\n\n          </ion-select>\n\n'
                    r'        </ion-item>\n\n        '
                )
            else:
                state_snippet = (
                    f'<{col_tag}>\n\n'
                    r'          <ion-item>\n\n'
                    r'            <ion-label stacked>' + rashtram + r' / State' + req_star + r'</ion-label>\n\n'
                    r'            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">' + options +
                    r'\n\n            </ion-select>\n\n'
                    r'          </ion-item>\n\n'
                    r'        </ion-col>\n\n        '
                )
            
            c = c[:insert_pos] + state_snippet + c[insert_pos:]
            print(f"  [Tpl OK] {file_name}")
        else:
            print(f"  [Tpl MISS] {file_name}: {dist_field} not found")
            
    # 2. FormBuilder
    if "state_id: [" not in c:
        m = re.search(rf'({dist_field}\s*:\s*\[)', c)
        if m:
            idx_form = m.start()
            default_val = "['']" if is_search else "['1']"
            form_inject = f"state_id: {default_val},\n            "
            c = c[:idx_form] + form_inject + c[idx_form:]
            print(f"  [Form OK] {file_name}")
        else:
            # Try searching for alternative field like jobtile in 23.js
            if file_name == "23.js":
                idx_job = c.find("jobtile: [")
                if idx_job > 0:
                    form_inject = "state_id: [''],\n            "
                    c = c[:idx_job] + form_inject + c[idx_job:]
                    print(f"  [Form OK] {file_name} (via jobtile)")
            elif file_name == "13.js":
                idx_den = c.find("denomation_id: [")
                if idx_den > 0:
                    form_inject = "state_id: [''],\n            "
                    c = c[:idx_den] + form_inject + c[idx_den:]
                    print(f"  [Form OK] {file_name} (via denomation_id)")
            else:
                print(f"  [Form MISS] {file_name}: {dist_field} form not found")
    
    # 3. Prototype method onStateChange
    if f"{class_name}.prototype.onStateChange" not in c:
        proto_search = f"{class_name}.prototype."
        idx_proto = c.find(proto_search)
        if idx_proto > 0:
            proto_method = f"""    {class_name}.prototype.onStateChange = function (event) {{
        var stateId = (event && event.target) ? event.target.value : event;
        if (this.searchdist !== undefined) this.searchdist = '';
        if (this.searchconts !== undefined) this.searchconts = '';
        var patchObj = {{ state_id: stateId }};
        patchObj['{dist_field}'] = '';
        var f = this.form || this.serachMeetingform || this.jobsadding || this.studentform || this.searchdenomation;
        if (f) {{ f.patchValue(patchObj); }}
        this.districts = [];
        this.constituency = [];
        this.mandals = [];
        this.panchayati = [];
        var _this = this;
        this.service.getdistrict(stateId).subscribe(function (res) {{
            if (res && res.status == 200) {{
                _this.districts = res.data;
            }}
        }}, function (error) {{
            console.log(error);
        }});
        if (this.getjobs) {{
            if (stateId && this.service.searchjobswise) {{
                this.service.searchjobswise({{ state_id: stateId }}).subscribe(function (res) {{
                    if (res && res.status == 200 && Array.isArray(res.data)) {{
                        _this.jobs = res.data;
                    }}
                }});
            }} else {{
                this.getjobs();
            }}
        }}
        if (this.defaultdata) {{
            if (stateId && this.service.getorganizations) {{
                this.service.getorganizations({{ state_id: stateId }}).subscribe(function (res) {{
                    if (res && res.status == 200 && Array.isArray(res.data)) {{
                        _this.marriagedata = res.data.map(function (item) {{ return Object.assign({{}}, item, {{ showMore: false }}); }});
                    }}
                }});
            }} else {{
                this.defaultdata();
            }}
        }}
    }};
"""
            c = c[:idx_proto] + proto_method + c[idx_proto:]
            print(f"  [Proto OK] {file_name}")
        else:
            print(f"  [Proto MISS] {file_name}")
            
    # 4. In registration pages, ensure initial getdistric calls this.service.getdistrict(1)
    if not is_search and "this.service.getdistrict().subscribe" in c:
        c = c.replace("this.service.getdistrict().subscribe", "this.service.getdistrict(1).subscribe")
        print(f"  [Init Dist OK] {file_name} -> getdistrict(1)")

    with open(path, "w", encoding="utf-8") as f:
        f.write(c)

chunks_to_patch = [
    ("23.js", "JobsPage", "district_id", True, "ion-col col-12 col-md-3"),
    ("13.js", "SearchorganisationPage", "district_id", True, "ion-col col-12"),
    ("14.js", "SearchhousePage", "district_id", True, "ion-col col-12"),
    ("22.js", "MarriagePage", "district_id", True, "ion-col col-12"),
    ("18.js", "OrganisationPage", "districts", False, "ion-col col-12"),
    ("16.js", "PastorPage", "district_id", False, "ion-col col-12"),
    ("35.js", "ChurchPage", "district_id", False, None),
    ("38.js", "AssociationPage", "district_id", False, "ion-col col-12"),
    ("41.js", "AddjobsPage", "districtname", False, "ion-col col-12"),
    ("37.js", "BelieverPage", "districts", False, "ion-col col-12 col-md-6"),
    ("12.js", "StudentPage", "district_id", False, "ion-col col-12"),
    ("32.js", "EntryFormPage", "district_id", False, None)
]

print("\n--- Patching all 12 Chunks ---")
for f, cname, dist, is_s, col in chunks_to_patch:
    print(f"Patching {f} ({cname})...")
    patch_chunk_file(f, cname, dist, is_s, col)

print("\nAll patches applied to www/build!")
