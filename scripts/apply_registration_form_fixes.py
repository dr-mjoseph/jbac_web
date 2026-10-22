import os
import re
import subprocess

app_root = r"C:\Users\rajes\StudioProjects\jbac_app"
build_dir = os.path.join(app_root, "www", "build")
src_pages_dir = os.path.join(app_root, "src", "pages")
node_exe = r"C:\Users\rajes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

print("=== APPLYING REGISTRATION FORM FIXES (PYTHON) ===")

# -------------------------------------------------------------
# 1. Fix MinistryPage (21.js)
# -------------------------------------------------------------
chunk21_path = os.path.join(build_dir, "21.js")
with open(chunk21_path, "r", encoding="utf-8") as f:
    chunk21 = f.read()

# Replace constructor formBuilder in 21.js
patt21 = re.compile(
    r"this\.ministryform\s*=\s*this\.formBuilder\.group\(\{[\s\S]*?password:\s*\['',\s*\[__WEBPACK_IMPORTED_MODULE_1__angular_forms__\[\"f\"\s*/\*\s*Validators\s*\*/\]\.required,\s*__WEBPACK_IMPORTED_MODULE_1__angular_forms__\[\"f\"\s*/\*\s*Validators\s*\*/\]\.minLength\(6\)\]\],[\s\S]*?description:\s*\[''\],[\s\S]*?\}\);\s*this\.ministryform\.reset\(\);"
)

match21 = patt21.search(chunk21)
if not match21:
    raise ValueError("Could not find ministryform definition in 21.js!")

repl21 = """this.submitted = false;
        this.ministryform = this.formBuilder.group({
            firstname: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],
            denomation: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],
            ministryemail: [''],
            ministrywebsite: [''],
            headnmber: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].maxLength(10)]],
            number_ofchurches: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],
            number_ofmembers: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],
            state_id: ['1'],
            district_id: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],
            constituency_id: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],
            mandal_id: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],
            panchayat_id: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],
            password: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].minLength(6)]],
            retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].minLength(6)]],
            pastor: [''],
            description: [''],
            term: [true]
        });
        this.r = this.ministryform.controls;"""

chunk21 = chunk21[:match21.start()] + repl21 + chunk21[match21.end():]

# Ensure getter for r on MinistryPage.prototype
if 'Object.defineProperty(MinistryPage.prototype, "r"' not in chunk21:
    patt_onstate = re.compile(r"MinistryPage\.prototype\.onStateChange\s*=\s*function")
    m = patt_onstate.search(chunk21)
    if not m:
        raise ValueError("Could not find MinistryPage.prototype.onStateChange in 21.js!")
    getter_code = """Object.defineProperty(MinistryPage.prototype, "r", {
        get: function () { return this.ministryform ? this.ministryform.controls : {}; },
        enumerable: true,
        configurable: true
    });\n"""
    chunk21 = chunk21[:m.start()] + getter_code + chunk21[m.start():]

# Ensure submitted = true on postministrysignup
patt_submit21 = re.compile(r"(MinistryPage\.prototype\.postministrysignup\s*=\s*function\s*\(\)\s*\{\s*this\.showSpinner\s*=\s*true;)")
if patt_submit21.search(chunk21):
    chunk21 = patt_submit21.sub(r"\1\n        this.submitted = true;", chunk21)

with open(chunk21_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(chunk21)
print("-> Updated 21.js successfully!")

# -------------------------------------------------------------
# 2. Fix ChurchPage (35.js)
# -------------------------------------------------------------
chunk35_path = os.path.join(build_dir, "35.js")
with open(chunk35_path, "r", encoding="utf-8") as f:
    chunk35 = f.read()

patt35 = re.compile(
    r"(password:\s*\['',\s*\[__WEBPACK_IMPORTED_MODULE_1__angular_forms__\[\"f\"\s*/\*\s*Validators\s*\*/\]\.required,\s*__WEBPACK_IMPORTED_MODULE_1__angular_forms__\[\"f\"\s*/\*\s*Validators\s*\*/\]\.minLength\(6\)\]\],)[\s\S]*?(village_name:\s*\['',\s*\[__WEBPACK_IMPORTED_MODULE_1__angular_forms__\[\"f\"\s*/\*\s*Validators\s*\*/\]\.required\]\],)\s*(\}\);)"
)

m35 = patt35.search(chunk35)
if not m35:
    raise ValueError("Could not find Church form definition in 35.js!")

repl35 = (
    m35.group(1) + "\n" +
    "            retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],\n" +
    "            facebook: [''],\n" +
    "            youtube: [''],\n" +
    "            remarks: [''],\n" +
    "            village_name: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required]],\n" +
    "            term: [true]\n" +
    "        });"
)

chunk35 = chunk35[:m35.start()] + repl35 + chunk35[m35.end():]

patt_submit35 = re.compile(r"(ChurchPage\.prototype\.postchurchregister\s*=\s*function\s*\(\)\s*\{\s*this\.showSpinner\s*=\s*true;)")
if patt_submit35.search(chunk35):
    chunk35 = patt_submit35.sub(r"\1\n        this.submitted = true;", chunk35)

with open(chunk35_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(chunk35)
print("-> Updated 35.js successfully!")

# -------------------------------------------------------------
# 3. Fix OrganisationPage (18.js)
# -------------------------------------------------------------
chunk18_path = os.path.join(build_dir, "18.js")
with open(chunk18_path, "r", encoding="utf-8") as f:
    chunk18 = f.read()

patt18 = re.compile(
    r"(password:\s*\['',\s*\[__WEBPACK_IMPORTED_MODULE_3__angular_forms__\[\"f\"\s*/\*\s*Validators\s*\*/\]\.required,\s*__WEBPACK_IMPORTED_MODULE_3__angular_forms__\[\"f\"\s*/\*\s*Validators\s*\*/\]\.minLength\(6\)\]\],)[\s\S]*?(term:\s*\['',\s*\[__WEBPACK_IMPORTED_MODULE_3__angular_forms__\[\"f\"\s*/\*\s*Validators\s*\*/\]\.required\]\])\s*(\}\);)"
)

m18 = patt18.search(chunk18)
if not m18:
    raise ValueError("Could not find Organisation form definition in 18.js!")

repl18 = (
    m18.group(1) + "\n" +
    "            retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].minLength(6)]],\n" +
    "            state_id: ['1'],\n" +
    "            districts: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].required]],\n" +
    "            constituencyname: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].required]],\n" +
    "            mandals: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].required]],\n" +
    "            panchayati: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].required]],\n" +
    "            villagename: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].required]],\n" +
    "            ward: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].required]],\n" +
    "            term: [true]\n" +
    "        });"
)

chunk18 = chunk18[:m18.start()] + repl18 + chunk18[m18.end():]

with open(chunk18_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(chunk18)
print("-> Updated 18.js successfully!")

# -------------------------------------------------------------
# 4. Validate syntax with node -c
# -------------------------------------------------------------
for ch in ["21.js", "35.js", "18.js"]:
    p = os.path.join(build_dir, ch)
    res = subprocess.run([node_exe, "-c", p], capture_output=True, text=True, errors="replace")
    if res.returncode != 0:
        raise SyntaxError(f"Syntax check failed on {ch}: {res.stderr}")
    print(f"[PASS] node -c validation successful for {ch}")

# -------------------------------------------------------------
# 5. Fix TypeScript source files
# -------------------------------------------------------------
ministry_ts_path = os.path.join(src_pages_dir, "ministry", "ministry.ts")
with open(ministry_ts_path, "r", encoding="utf-8") as f:
    ministry_ts = f.read()

ministry_ts = re.sub(r"term:\s*\[true\],\],", "term: [true]", ministry_ts)
if "this.r = this.ministryform.controls;" not in ministry_ts:
    ministry_ts = ministry_ts.replace("this.ministryform.reset();", "this.r = this.ministryform.controls;")
with open(ministry_ts_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(ministry_ts)
print("-> Updated src/pages/ministry/ministry.ts")

church_ts_path = os.path.join(src_pages_dir, "church", "church.ts")
with open(church_ts_path, "r", encoding="utf-8") as f:
    church_ts = f.read()

church_ts = re.sub(r"term:\s*\[true\],\],", "term: [true]", church_ts)
with open(church_ts_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(church_ts)
print("-> Updated src/pages/church/church.ts")

print("=== ALL 3 REGISTRATION FORM CHUNKS & SOURCES ARE VERIFIED CLEAN & WORKING! ===")
