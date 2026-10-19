const fs = require('fs');
const path = require('path');
const vm = require('vm');

const mobileRoot = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const targetBuildDirs = [
  path.join(mobileRoot, 'www', 'build'),
  path.join(mobileRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build')
];

console.log('====================================================');
console.log(' Applying Comprehensive Mobile Fixes to Sources & Bundles');
console.log('====================================================');

// =========================================================
// 1. UPDATE SOURCE TS FILES IN src/pages/
// =========================================================
console.log('\n[1/2] Updating TypeScript Source Files in src/pages/ ...');

// 1.1 ChurchPage (church.ts)
const churchTsPath = path.join(mobileRoot, 'src', 'pages', 'church', 'church.ts');
if (fs.existsSync(churchTsPath)) {
  let code = fs.readFileSync(churchTsPath, 'utf8');
  code = code.replace(/\/\/\s*retypepassword:\s*\[''[^\]]*\],?/, "retypepassword: ['', [Validators.required, Validators.minLength(6)]],");
  code = code.replace(/\/\/\s*term:\s*\[''[^\]]*\],?/, "term: [true],");
  if (!code.includes("retypepassword: [''")) {
    code = code.replace("password: ['', [Validators.required, Validators.minLength(6)]],",
      "password: ['', [Validators.required, Validators.minLength(6)]],\n      retypepassword: ['', [Validators.required, Validators.minLength(6)]],");
  }
  if (!code.includes("term: [true]")) {
    code = code.replace("village_name: ['', [Validators.required]],",
      "village_name: ['', [Validators.required]],\n      term: [true],");
  }
  if (!code.includes("if (!this.form.get('term')")) {
    code = code.replace("postchurchregister() {",
      "postchurchregister() {\n    if (!this.form.get('term') || !this.form.get('term').value) {\n      this.form.patchValue({ term: true });\n    }");
  }
  fs.writeFileSync(churchTsPath, code, 'utf8');
  console.log('  [OK] Updated src/pages/church/church.ts');
}

// 1.2 OrganisationPage (organisation.ts)
const orgTsPath = path.join(mobileRoot, 'src', 'pages', 'organisation', 'organisation.ts');
if (fs.existsSync(orgTsPath)) {
  let code = fs.readFileSync(orgTsPath, 'utf8');
  code = code.replace(/\/\/\s*retypepassword:\s*\[''[^\]]*\],?/, "retypepassword: ['', [Validators.required, Validators.minLength(6)]],");
  if (!code.includes("retypepassword: [''")) {
    code = code.replace("password: ['', [Validators.required, Validators.minLength(6)]],",
      "password: ['', [Validators.required, Validators.minLength(6)]],\n      retypepassword: ['', [Validators.required, Validators.minLength(6)]],");
  }
  fs.writeFileSync(orgTsPath, code, 'utf8');
  console.log('  [OK] Updated src/pages/organisation/organisation.ts');
}

// 1.3 MinistryPage (ministry.ts)
const ministryTsPath = path.join(mobileRoot, 'src', 'pages', 'ministry', 'ministry.ts');
if (fs.existsSync(ministryTsPath)) {
  let code = fs.readFileSync(ministryTsPath, 'utf8');
  code = code.replace(/\/\/\s*retypepassword:\s*\[''[^\]]*\],?/, "retypepassword: ['', [Validators.required, Validators.minLength(6)]],");
  code = code.replace(/\/\/\s*term:\s*\[''[^\]]*\],?/, "term: [true],");
  if (!code.includes("retypepassword: [''")) {
    code = code.replace("password: ['', [Validators.required, Validators.minLength(6)]],",
      "password: ['', [Validators.required, Validators.minLength(6)]],\n      retypepassword: ['', [Validators.required, Validators.minLength(6)]],");
  }
  if (!code.includes("term: [true]")) {
    code = code.replace("description: [''],",
      "description: [''],\n      term: [true],");
  }
  if (!code.includes("get r()")) {
    code = code.replace("constructor(", "get r() { return this.ministryform ? this.ministryform.controls : {}; }\n\n  constructor(");
  }
  fs.writeFileSync(ministryTsPath, code, 'utf8');
  console.log('  [OK] Updated src/pages/ministry/ministry.ts');
}

// 1.4 AssociationPage (association.ts)
const assocTsPath = path.join(mobileRoot, 'src', 'pages', 'association', 'association.ts');
if (fs.existsSync(assocTsPath)) {
  let code = fs.readFileSync(assocTsPath, 'utf8');
  code = code.replace(/\/\/\s*retypepassword:\s*\[''[^\]]*\],?/, "retypepassword: [''],");
  code = code.replace(/term:\s*\[''\]/, "term: [true]");
  if (!code.includes("retypepassword: [''")) {
    code = code.replace("password: [''],",
      "password: [''],\n      retypepassword: [''],");
  }
  fs.writeFileSync(assocTsPath, code, 'utf8');
  console.log('  [OK] Updated src/pages/association/association.ts');
}

// 1.5 PastorPage (pastor.ts)
const pastorTsPath = path.join(mobileRoot, 'src', 'pages', 'pastor', 'pastor.ts');
if (fs.existsSync(pastorTsPath)) {
  let code = fs.readFileSync(pastorTsPath, 'utf8');
  code = code.replace(/\/\/\/\/\s*retypepassword:\s*\[''[^\]]*\],?/, "retypepassword: [''],");
  fs.writeFileSync(pastorTsPath, code, 'utf8');
  console.log('  [OK] Updated src/pages/pastor/pastor.ts');
}


// =========================================================
// 2. UPDATE RUNTIME BUNDLES IN www/build/ AND platforms/...
// =========================================================
console.log('\n[2/2] Patching Runtime JavaScript Bundles for Instant Execution ...');

for (const buildDir of targetBuildDirs) {
  if (!fs.existsSync(buildDir)) {
    console.log('  [SKIP] Build directory does not exist:', buildDir);
    continue;
  }
  console.log('\n -> Processing directory:', buildDir);

  // 2.1 PATCH 35.js (ChurchPageModule)
  const chunk35Path = path.join(buildDir, '35.js');
  if (fs.existsSync(chunk35Path)) {
    let code = fs.readFileSync(chunk35Path, 'utf8');
    code = code.replace(
      "// retypepassword: ['', [Validators.required, Validators.minLength(6)]],",
      "retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],"
    );
    code = code.replace(
      "// term: ['', [Validators.required]],",
      "term: [true],"
    );
    if (!code.includes("this.form.get('term')")) {
      code = code.replace(
        "postchurchregister = function () {",
        "postchurchregister = function () {\n        if (!this.form.get('term') || !this.form.get('term').value) { this.form.patchValue({ term: true }); }"
      );
    }
    if (code.includes("_this.form.reset();")) {
      code = code.replace("_this.form.reset();", "_this.form.reset({ term: true }); _this.mandals = []; _this.constituency = []; _this.panchayati = [];");
    }

    new vm.Script(code);
    fs.writeFileSync(chunk35Path, code, 'utf8');
    console.log('  [OK] 35.js syntax verified and written successfully');
  }

  // 2.2 PATCH 18.js (OrganisationPageModule)
  const chunk18Path = path.join(buildDir, '18.js');
  if (fs.existsSync(chunk18Path)) {
    let code = fs.readFileSync(chunk18Path, 'utf8');
    code = code.replace(
      "// retypepassword: ['', [Validators.required, Validators.minLength(6)]],",
      "retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].minLength(6)]],"
    );
    code = code.replace(
      "term: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__[\"f\" /* Validators */].required]]",
      "term: [true]"
    );
    if (!code.includes("this.form.get('term')")) {
      code = code.replace(
        "postindepedentorganisation = function () {",
        "postindepedentorganisation = function () {\n        if (!this.form.get('term') || !this.form.get('term').value) { this.form.patchValue({ term: true }); }"
      );
    }
    if (code.includes("_this.form.reset();")) {
      code = code.replace("_this.form.reset();", "_this.form.reset({ term: true }); _this.mandals = []; _this.constituency = []; _this.panchayati = [];");
    }

    new vm.Script(code);
    fs.writeFileSync(chunk18Path, code, 'utf8');
    console.log('  [OK] 18.js syntax verified and written successfully');
  }

  // 2.3 PATCH 21.js (MinistryPageModule)
  const chunk21Path = path.join(buildDir, '21.js');
  if (fs.existsSync(chunk21Path)) {
    let code = fs.readFileSync(chunk21Path, 'utf8');
    code = code.replace(
      "// retypepassword: ['', [Validators.required, Validators.minLength(6)]],",
      "retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],"
    );
    code = code.replace(
      "// term: ['', [Validators.required]],",
      "term: [true],"
    );
    if (!code.includes("Object.defineProperty(MinistryPage.prototype, \"r\"")) {
      code = code.replace(
        "function MinistryPage(",
        "Object.defineProperty(MinistryPage.prototype, \"r\", { get: function () { return this.ministryform ? this.ministryform.controls : {}; }, enumerable: true, configurable: true });\n    function MinistryPage("
      );
    }
    if (code.includes("_this.ministryform.reset();")) {
      code = code.replace("_this.ministryform.reset();", "_this.ministryform.reset({ term: true }); _this.mandals = []; _this.constituency = []; _this.panchayati = []; _this.submitted = false;");
    }

    new vm.Script(code);
    fs.writeFileSync(chunk21Path, code, 'utf8');
    console.log('  [OK] 21.js syntax verified and written successfully');
  }

  // 2.4 PATCH 38.js (AssociationPageModule)
  const chunk38Path = path.join(buildDir, '38.js');
  if (fs.existsSync(chunk38Path)) {
    let code = fs.readFileSync(chunk38Path, 'utf8');
    code = code.replace(
      "//retypepassword: ['', [Validators.required, Validators.minLength(6)]],",
      "retypepassword: [''],"
    );
    code = code.replace("term: ['']", "term: [true]");
    if (code.includes("_this.form.reset();")) {
      code = code.replace("_this.form.reset();", "_this.form.reset({ term: true }); _this.mandals = []; _this.constituency = []; _this.panchayati = [];");
    }

    new vm.Script(code);
    fs.writeFileSync(chunk38Path, code, 'utf8');
    console.log('  [OK] 38.js syntax verified and written successfully');
  }

  // 2.5 PATCH 37.js (BelieverPageModule - repeat submission fix)
  const chunk37Path = path.join(buildDir, '37.js');
  if (fs.existsSync(chunk37Path)) {
    let code = fs.readFileSync(chunk37Path, 'utf8');
    code = code.replace("term: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required],", "term: [true],");
    if (code.includes("_this.form.reset();")) {
      code = code.replace("_this.form.reset();", "_this.form.reset({ term: true }); _this.mandals = []; _this.constituency = []; _this.panchayati = [];");
    }
    if (!code.includes("this.form.patchValue({ term: true })")) {
      code = code.replace(
        "postbeliversignup = function () {",
        "postbeliversignup = function () {\n        if (!this.form.get('term') || !this.form.get('term').value) { this.form.patchValue({ term: true }); }"
      );
    }
    new vm.Script(code);
    fs.writeFileSync(chunk37Path, code, 'utf8');
    console.log('  [OK] 37.js syntax verified and written successfully');
  }

  // 2.6 PATCH 12.js (StudentPageModule - repeat submission fix)
  const chunk12Path = path.join(buildDir, '12.js');
  if (fs.existsSync(chunk12Path)) {
    let code = fs.readFileSync(chunk12Path, 'utf8');
    code = code.replace("term: [''],", "term: [true],");
    if (code.includes("_this.studentform.reset();")) {
      code = code.replace("_this.studentform.reset();", "_this.studentform.reset({ term: true }); _this.mandals = []; _this.constituency = []; _this.panchayati = [];");
    }
    if (!code.includes("this.studentform.patchValue({ term: true })")) {
      code = code.replace(
        "poststudentsignup = function () {",
        "poststudentsignup = function () {\n        if (!this.studentform.get('term') || !this.studentform.get('term').value) { this.studentform.patchValue({ term: true }); }"
      );
    }
    new vm.Script(code);
    fs.writeFileSync(chunk12Path, code, 'utf8');
    console.log('  [OK] 12.js syntax verified and written successfully');
  }

  // 2.7 PATCH 16.js (PastorPageModule - repeat submission fix)
  const chunk16Path = path.join(buildDir, '16.js');
  if (fs.existsSync(chunk16Path)) {
    let code = fs.readFileSync(chunk16Path, 'utf8');
    if (code.includes("_this.form.reset();")) {
      code = code.replace("_this.form.reset();", "_this.form.reset(); _this.mandals = []; _this.constituency = []; _this.panchayati = [];");
    }
    new vm.Script(code);
    fs.writeFileSync(chunk16Path, code, 'utf8');
    console.log('  [OK] 16.js syntax verified and written successfully');
  }

  // 2.8 PATCH main.js (Add "Edit Profile" in side menu & openPage routing)
  const mainJsPath = path.join(buildDir, 'main.js');
  if (fs.existsSync(mainJsPath)) {
    let code = fs.readFileSync(mainJsPath, 'utf8');
    
    // Inject Edit Profile tile into this.pages
    if (!code.includes("'Edit Profile & Details'") && code.includes("this.pages = [")) {
      code = code.replace(
        "this.pages = [",
        "this.pages = [\n            { 'title': 'ప్రొఫైల్‌ని సవరించండి', 'subtitle': 'Edit Profile & Details', 'image': 'assets/icon/svg/services.svg', 'page': 'ProfilePage' },"
      );
      console.log('  [OK] Added Edit Profile item to this.pages in main.js');
    }

    // Check openPage method to guard ProfilePage with login check
    const openPageRegex = /MyApp\.prototype\.openPage\s*=\s*function\s*\(\s*page\s*\)\s*\{[\s\S]*?this\.nav\.push\(\s*page\s*\);\s*\};/;
    if (openPageRegex.test(code)) {
      code = code.replace(openPageRegex, `MyApp.prototype.openPage = function (page) {
        if (page === 'ProfilePage') {
            var uid = localStorage.getItem('usr_id');
            if (!uid || uid === ' ' || uid === 'null' || uid === 'undefined') {
                this.nav.push('LoginPage');
                return;
            }
        }
        this.nav.push(page);
    };`);
      console.log('  [OK] Updated openPage handler in main.js with ProfilePage login guard');
    }

    new vm.Script(code);
    fs.writeFileSync(mainJsPath, code, 'utf8');
    console.log('  [OK] main.js syntax verified and written successfully');
  }
}

console.log('\n====================================================');
console.log(' All Mobile Registration & Responsiveness Patches Applied!');
console.log('====================================================');
