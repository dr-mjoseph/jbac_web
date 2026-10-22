import os
import subprocess
import re
import shutil
import hashlib

app_root = r"C:\Users\rajes\StudioProjects\jbac_app"
build_dir = os.path.join(app_root, "www", "build")
android_assets_build = os.path.join(app_root, "platforms", "android", "app", "src", "main", "assets", "www", "build")
node_exe = r"C:\Users\rajes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

rashtram = "\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C02"  # రాష్ట్రం
anni = "\u0C05\u0C28\u0C4D\u0C28\u0C40"              # అన్నీ
ap = "\u0C06\u0C02\u0C27\u0C4D\u0C30\u0C2A\u0C4D\u0C30\u0C26\u0C47\u0C36\u0C4D"  # ఆంధ్రప్రదేశ్
tg = "\u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23"          # తెలంగాణ

files_to_reset = [
    "main.js", "12.js", "13.js", "14.js", "16.js", "18.js",
    "21.js", "22.js", "23.js", "29.js", "32.js", "35.js",
    "37.js", "38.js", "41.js"
]

print("=== STEP 1: Resetting build files to git HEAD ===")
for f in files_to_reset:
    rel_path = f"www/build/{f}"
    subprocess.run(["git", "-C", app_root, "checkout", "HEAD", "--", rel_path], check=True)
print("All files cleanly reset to git HEAD.\n")

print("=== STEP 2: Patching main.js ===")
main_path = os.path.join(build_dir, "main.js")
with open(main_path, "r", encoding="utf-8-sig") as f:
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

if main_target in main_c:
    main_c = main_c.replace(main_target, main_replacement)
else:
    main_c = re.sub(r'ServiceProvider\.prototype\.getdistrict\s*=\s*function\s*\(\)\s*\{[\s\S]*?getdistricts[\s\S]*?\};', main_replacement, main_c)

with open(main_path, "w", encoding="utf-8") as f:
    f.write(main_c)
print("[OK] main.js patched.\n")

print("=== STEP 3: Patching 29.js (FormsPage) ===")
p29 = os.path.join(build_dir, "29.js")
with open(p29, "r", encoding="utf-8-sig") as f:
    c29 = f.read()

# Ensure card 1 has tappable
target_card1 = '<ion-card  class="hesd" (click)="gotopage(1)">'
repl_card1 = '<ion-card class="hesd" tappable (click)="gotopage(1)">'
if target_card1 in c29:
    c29 = c29.replace(target_card1, repl_card1)
    with open(p29, "w", encoding="utf-8") as f:
        f.write(c29)
    print("[OK] 29.js card 1 tappable added.")
else:
    print("[NOTE] 29.js card 1 target not matched or already has tappable.")

print("\n=== STEP 4: Patching All 13 Functional Chunks ===")

def patch_chunk(file_name, class_name, dist_field, is_search, col_tag, form_anchor=None):
    path = os.path.join(build_dir, file_name)
    with open(path, "r", encoding="utf-8-sig") as f:
        c = f.read()
    
    # 1. Template Snippet - MUST USE RAW r'\n' SO NO 0x0A/0x0D BYTES ENTER THE STRING LITERAL!
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
        # Note: raw r'\n' used throughout - NO RAW NEWLINE BYTES
        state_snippet = (
            r'<' + col_tag + r'>\n\n'
            r'          <ion-item>\n\n'
            r'            <ion-label stacked>' + rashtram + r' / State' + req_star + r'</ion-label>\n\n'
            r'            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">' + options +
            r'\n\n            </ion-select>\n\n'
            r'          </ion-item>\n\n'
            r'        </ion-col>\n\n        '
        )
    
    # Locate insertion position in template
    idx_field = c.find(f'formControlName="{dist_field}"')
    if idx_field == -1:
        raise ValueError(f"Template field '{dist_field}' not found in {file_name}")
    
    if col_tag is None:
        insert_pos = c.rfind('<ion-item', 0, idx_field)
    else:
        insert_pos = c.rfind('<ion-col', 0, idx_field)
    
    if insert_pos == -1:
        raise ValueError(f"Could not find insertion tag before '{dist_field}' in {file_name}")
    
    c = c[:insert_pos] + state_snippet + c[insert_pos:]
    
    # 2. FormBuilder Injection - REAL NEWLINE (\n = 0x0A) FOR EXECUTABLE JAVASCRIPT!
    anchor = form_anchor if form_anchor else f"{dist_field}: ["
    idx_form = c.find(anchor)
    if idx_form == -1:
        raise ValueError(f"FormBuilder anchor '{anchor}' not found in {file_name}")
    
    default_val = "['']" if is_search else "['1']"
    form_inject = f"state_id: {default_val},\n            "
    c = c[:idx_form] + form_inject + c[idx_form:]
    
    # 3. Prototype Method Injection - REAL NEWLINES FOR EXECUTABLE JAVASCRIPT!
    idx_proto = c.find(f"{class_name}.prototype.ionViewDidLoad = function")
    if idx_proto == -1:
        idx_proto = c.find(f"{class_name}.prototype.gotohome = function")
    if idx_proto == -1:
        # Fallback to any prototype method
        idx_proto = c.find(f"{class_name}.prototype.")
    if idx_proto == -1:
        raise ValueError(f"Could not find prototype method anchor for {class_name} in {file_name}")
    
    proto_method = f"""    {class_name}.prototype.onStateChange = function (event) {{
        var stateId = (event && event.target) ? event.target.value : event;
        if (this.searchdist !== undefined) this.searchdist = '';
        if (this.searchconts !== undefined) this.searchconts = '';
        var patchObj = {{ state_id: stateId }};
        patchObj['{dist_field}'] = '';
        var f = this.form || this.serachMeetingform || this.jobsadding || this.studentform || this.searchdenomation || this.ministryform;
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
    
    # 4. In registration pages, ensure initial getdistric calls this.service.getdistrict(1)
    if not is_search and "this.service.getdistrict().subscribe" in c:
        c = c.replace("this.service.getdistrict().subscribe", "this.service.getdistrict(1).subscribe")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(c)
    
    print(f"[OK] Patched {file_name} ({class_name})")

chunks_spec = [
    # Search pages
    ("23.js", "JobsPage", "district_id", True, "ion-col col-12 col-md-3", "jobtile: ["),
    ("13.js", "SearchorganisationPage", "district_id", True, "ion-col col-12", "denomation_id: ["),
    ("14.js", "SearchhousePage", "district_id", True, "ion-col col-12", "district_id: ["),
    ("22.js", "MarriagePage", "district_id", True, "ion-col col-12", "district_id: ["),
    
    # Registration pages
    ("37.js", "BelieverPage", "districts", False, "ion-col col-12 col-md-6", "districts: ["),
    ("12.js", "StudentPage", "district_id", False, "ion-col col-12", "district_id: ["),
    ("21.js", "MinistryPage", "district_id", False, "ion-col col-12", "district_id: ["),
    ("16.js", "PastorPage", "district_id", False, "ion-col col-12", "district_id: ["),
    ("35.js", "ChurchPage", "district_id", False, None, "district_id: ["),
    ("18.js", "OrganisationPage", "districts", False, "ion-col col-12", "districts: ["),
    ("38.js", "AssociationPage", "district_id", False, "ion-col col-12", "district_id: ["),
    ("41.js", "AddjobsPage", "districtname", False, "ion-col col-12", "districtname: ["),
    ("32.js", "EntryFormPage", "district_id", False, None, "district_id: ["),
]

for item in chunks_spec:
    patch_chunk(*item)

print("\n=== STEP 5: Verifying Node.js syntax on all patched chunks ===")
all_patched_files = files_to_reset

syntax_failures = []
for f in all_patched_files:
    p = os.path.join(build_dir, f)
    res = subprocess.run([node_exe, "-c", p], stdout=subprocess.PIPE, stderr=subprocess.PIPE, encoding="utf-8", errors="replace")
    if res.returncode != 0:
        syntax_failures.append((f, res.stderr.strip()))
        print(f"[FAIL] {f}: {res.stderr.strip()[:200]}")
    else:
        print(f"[PASS] {f} parsed cleanly by Node.js")

if syntax_failures:
    raise RuntimeError(f"Syntax validation failed on {len(syntax_failures)} files!")

print("\n=== STEP 6: Verifying byte-level integrity (Zero raw LF/CR in template, Zero BOM) ===")
for f in all_patched_files:
    p = os.path.join(build_dir, f)
    with open(p, "rb") as bf:
        raw = bf.read()
    if raw.startswith(b"\xef\xbb\xbf"):
        raise ValueError(f"{f} has UTF-8 BOM!")
    st = raw.find(b"template:")
    if st != -1:
        ed = raw.find(b"/*ion-inline-end:", st)
        if ed != -1:
            tpl = raw[st:ed]
            if b"\n" in tpl or b"\r" in tpl:
                raise ValueError(f"{f} has raw CR/LF inside template string literal!")
print("Byte-level checks PASSED: Zero raw CR/LF in templates, Zero BOMs.\n")

print("=== STEP 7: Copying all patched files to Android assets ===")
for f in all_patched_files:
    src_f = os.path.join(build_dir, f)
    dst_f = os.path.join(android_assets_build, f)
    shutil.copy2(src_f, dst_f)

# Verify SHA256 matches
for f in all_patched_files:
    src_f = os.path.join(build_dir, f)
    dst_f = os.path.join(android_assets_build, f)
    with open(src_f, "rb") as s, open(dst_f, "rb") as d:
        h1 = hashlib.sha256(s.read()).hexdigest()
        h2 = hashlib.sha256(d.read()).hexdigest()
    if h1 != h2:
        raise ValueError(f"Hash mismatch for {f} between www/build and android assets!")
print("All files synchronized to Android assets with identical SHA256 hashes.\n")
print("=== SUCCESS: MASTER PATCH APPLIED AND VERIFIED! ===")
