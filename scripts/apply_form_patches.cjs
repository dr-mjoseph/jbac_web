const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appRoot = 'C:/Users/rajes/StudioProjects/jbac_app';

console.log('=== Cleaning TypeScript Source Files ===');

// 1. church.ts
const churchTsPath = path.join(appRoot, 'src/pages/church/church.ts');
let churchTs = fs.readFileSync(churchTsPath, 'utf8');
churchTs = churchTs.replace(/retypepassword:\s*\[''[^\]]*\]\],\]?,?/g, "retypepassword: ['', [Validators.required, Validators.minLength(6)]],");
churchTs = churchTs.replace(/term:\s*\[[^\]]*\]\],\]?,?/g, "term: [true],");
fs.writeFileSync(churchTsPath, churchTs, 'utf8');
console.log('[OK] Cleaned church.ts');

// 2. ministry.ts
const minTsPath = path.join(appRoot, 'src/pages/ministry/ministry.ts');
let minTs = fs.readFileSync(minTsPath, 'utf8');
minTs = minTs.replace(/retypepassword:\s*\[''[^\]]*\]\],\]?,?/g, "retypepassword: ['', [Validators.required, Validators.minLength(6)]],");
minTs = minTs.replace(/term:\s*\[[^\]]*\]\],\]?,?/g, "term: [true],");
fs.writeFileSync(minTsPath, minTs, 'utf8');
console.log('[OK] Cleaned ministry.ts');

// 3. organisation.ts
const orgTsPath = path.join(appRoot, 'src/pages/organisation/organisation.ts');
let orgTs = fs.readFileSync(orgTsPath, 'utf8');
orgTs = orgTs.replace(/retypepassword:\s*\[''[^\]]*\]\],\]?,?/g, "retypepassword: ['', [Validators.required, Validators.minLength(6)]],");
orgTs = orgTs.replace(/term:\s*\[[^\]]*\]\],\]?,?/g, "term: [true]");
fs.writeFileSync(orgTsPath, orgTs, 'utf8');
console.log('[OK] Cleaned organisation.ts');

// 4. association.ts
const ascTsPath = path.join(appRoot, 'src/pages/association/association.ts');
let ascTs = fs.readFileSync(ascTsPath, 'utf8');
ascTs = ascTs.replace(/retypepassword:\s*\[''[^\]]*\]\],\]?,?/g, "retypepassword: [''],");
ascTs = ascTs.replace(/term:\s*\[[^\]]*\]\],\]?,?/g, "term: [true],");
fs.writeFileSync(ascTsPath, ascTs, 'utf8');
console.log('[OK] Cleaned association.ts');

// 5. pastor.ts
const pasTsPath = path.join(appRoot, 'src/pages/pastor/pastor.ts');
let pasTs = fs.readFileSync(pasTsPath, 'utf8');
pasTs = pasTs.replace(/retypepassword:\s*\[''[^\]]*\]\],\]?,?/g, "retypepassword: [''],");
pasTs = pasTs.replace(/term:\s*\[[^\]]*\]\],\]?,?/g, "term: [true],");
fs.writeFileSync(pasTsPath, pasTs, 'utf8');
console.log('[OK] Cleaned pastor.ts');

console.log('\n=== Patching Compiled JavaScript Bundles (www/build & platforms/...) ===');

const buildDirs = [
  path.join(appRoot, 'www/build'),
  path.join(appRoot, 'platforms/android/app/src/main/assets/www/build')
];

buildDirs.forEach(dir => {
  console.log(`\nProcessing: ${dir}`);

  // Patch 35.js (Church)
  const f35 = path.join(dir, '35.js');
  if (fs.existsSync(f35)) {
    let code35 = fs.readFileSync(f35, 'utf8');

    // Ensure term is in formBuilder.group
    if (!code35.includes('term: [true]') && !code35.includes('term:')) {
      code35 = code35.replace(
        "village_name: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required]],",
        "village_name: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required]],\n            term: [true],"
      );
    } else if (code35.includes('village_name:') && !code35.includes('term: [true]')) {
      code35 = code35.replace(
        /village_name:\s*\[''[^\]]*\]\]\s*,?/,
        "village_name: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required]],\n            term: [true],"
      );
    }

    // Ensure retypepassword is present
    if (!code35.includes('retypepassword:')) {
      code35 = code35.replace(
        "password: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],",
        "password: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],\n            retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],"
      );
    }

    // Validate syntax
    new vm.Script(code35);
    fs.writeFileSync(f35, code35, 'utf8');
    console.log(`  [OK] Successfully patched and validated 35.js (Church)`);
  }

  // Patch 21.js (Ministry)
  const f21 = path.join(dir, '21.js');
  if (fs.existsSync(f21)) {
    let code21 = fs.readFileSync(f21, 'utf8');

    // Ensure term is in formBuilder.group
    if (!code21.includes('term: [true]') && !code21.includes('term:')) {
      code21 = code21.replace(
        "description: [''],",
        "description: [''],\n            term: [true],"
      );
    }

    // Ensure retypepassword is present
    if (!code21.includes('retypepassword:')) {
      code21 = code21.replace(
        "password: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],",
        "password: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],\n            retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],"
      );
    }

    // Ensure r getter exists for template binding
    if (!code21.includes('get r()') && !code21.includes('Object.defineProperty(MinistryPage.prototype, "r"')) {
      code21 = code21.replace(
        'function MinistryPage(navCtrl, navParams, formBuilder, service) {',
        'Object.defineProperty(MinistryPage.prototype, "r", { get: function() { return this.ministryform ? this.ministryform.controls : {}; }, enumerable: true, configurable: true });\n    function MinistryPage(navCtrl, navParams, formBuilder, service) {'
      );
    }

    // Validate syntax
    new vm.Script(code21);
    fs.writeFileSync(f21, code21, 'utf8');
    console.log(`  [OK] Successfully patched and validated 21.js (Ministry)`);
  }

  // Patch 18.js (Organisation)
  const f18 = path.join(dir, '18.js');
  if (fs.existsSync(f18)) {
    let code18 = fs.readFileSync(f18, 'utf8');
    if (!code18.includes('retypepassword:')) {
      code18 = code18.replace(
        "password: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],",
        "password: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],\n            retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].minLength(6)]],"
      );
    }
    if (!code18.includes('term: [true]') && !code18.includes('term:')) {
      code18 = code18.replace(
        "ward: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required]],",
        "ward: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required]],\n            term: [true]"
      );
    }
    new vm.Script(code18);
    fs.writeFileSync(f18, code18, 'utf8');
    console.log(`  [OK] Successfully patched and validated 18.js (Organisation)`);
  }

  // Patch 38.js (Association)
  const f38 = path.join(dir, '38.js');
  if (fs.existsSync(f38)) {
    let code38 = fs.readFileSync(f38, 'utf8');
    if (!code38.includes('retypepassword:')) {
      code38 = code38.replace(
        "password: [''],",
        "password: [''],\n            retypepassword: [''],"
      );
    }
    if (!code38.includes('term: [true]') && !code38.includes('term:')) {
      code38 = code38.replace(
        "retypepassword: [''],",
        "retypepassword: [''],\n            term: [true],"
      );
    }
    new vm.Script(code38);
    fs.writeFileSync(f38, code38, 'utf8');
    console.log(`  [OK] Successfully patched and validated 38.js (Association)`);
  }
});

console.log('\n=== All Mobile Form Patches Applied & Verified! ===');
