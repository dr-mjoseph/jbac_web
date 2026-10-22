const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appRoot = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const buildDir = path.join(appRoot, 'www', 'build');
const srcPagesDir = path.join(appRoot, 'src', 'pages');

console.log('=== APPLYING REGISTRATION FORM FIXES ===');

// 1. Fix Ministry (21.js)
const chunk21Path = path.join(buildDir, '21.js');
let chunk21 = fs.readFileSync(chunk21Path, 'utf8');

const oldMinistryForm = `        this.ministryform = this.formBuilder.group({
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
            // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
            pastor: [''],
            description: [''],
        });
        this.ministryform.reset();`;

const newMinistryForm = `        this.submitted = false;
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
        this.r = this.ministryform.controls;`;

if (!chunk21.includes(oldMinistryForm)) {
    throw new Error('Target string not found in 21.js');
}
chunk21 = chunk21.replace(oldMinistryForm, newMinistryForm);

// Add r property getter on MinistryPage prototype if not present
if (!chunk21.includes('Object.defineProperty(MinistryPage.prototype, "r"')) {
    chunk21 = chunk21.replace('MinistryPage.prototype.onStateChange = function (event) {', `    Object.defineProperty(MinistryPage.prototype, "r", {
        get: function () { return this.ministryform ? this.ministryform.controls : {}; },
        enumerable: true,
        configurable: true
    });
    MinistryPage.prototype.onStateChange = function (event) {`);
}

// In postministrysignup, ensure this.submitted = true;
if (chunk21.includes('MinistryPage.prototype.postministrysignup = function () {\n        this.showSpinner = true;\n        var _this = this;')) {
    chunk21 = chunk21.replace(
        'MinistryPage.prototype.postministrysignup = function () {\n        this.showSpinner = true;\n        var _this = this;',
        'MinistryPage.prototype.postministrysignup = function () {\n        this.showSpinner = true;\n        this.submitted = true;\n        var _this = this;'
    );
}

fs.writeFileSync(chunk21Path, chunk21, 'utf8');
console.log('-> Updated 21.js (MinistryPage)');

// 2. Fix Church (35.js)
const chunk35Path = path.join(buildDir, '35.js');
let chunk35 = fs.readFileSync(chunk35Path, 'utf8');

const oldChurchForm = `            password: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].minLength(6)]],
            // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
            facebook: [''],
            youtube: [''],
            remarks: [''],
            village_name: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],
        });`;

const newChurchForm = `            password: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].minLength(6)]],
            retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].minLength(6)]],
            facebook: [''],
            youtube: [''],
            remarks: [''],
            village_name: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],
            term: [true]
        });`;

if (!chunk35.includes(oldChurchForm)) {
    throw new Error('Target string not found in 35.js');
}
chunk35 = chunk35.replace(oldChurchForm, newChurchForm);

if (chunk35.includes('ChurchPage.prototype.postchurchregister = function () {\n        this.showSpinner = true;\n        var _this = this;')) {
    chunk35 = chunk35.replace(
        'ChurchPage.prototype.postchurchregister = function () {\n        this.showSpinner = true;\n        var _this = this;',
        'ChurchPage.prototype.postchurchregister = function () {\n        this.showSpinner = true;\n        this.submitted = true;\n        var _this = this;'
    );
}

fs.writeFileSync(chunk35Path, chunk35, 'utf8');
console.log('-> Updated 35.js (ChurchPage)');

// 3. Fix Organisation (18.js)
const chunk18Path = path.join(buildDir, '18.js');
let chunk18 = fs.readFileSync(chunk18Path, 'utf8');

const oldOrgForm = `            password: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(6)]],
            // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
            state_id: ['1'],
            districts: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            constituencyname: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            mandals: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            panchayati: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            villagename: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            ward: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            term: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]]
        });`;

const newOrgForm = `            password: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(6)]],
            retypepassword: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(6)]],
            state_id: ['1'],
            districts: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            constituencyname: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            mandals: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            panchayati: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            villagename: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            ward: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            term: [true]
        });`;

if (!chunk18.includes(oldOrgForm)) {
    throw new Error('Target string not found in 18.js');
}
chunk18 = chunk18.replace(oldOrgForm, newOrgForm);

fs.writeFileSync(chunk18Path, chunk18, 'utf8');
console.log('-> Updated 18.js (OrganisationPage)');

// Validate syntax for all three chunks
for (const ch of ['21.js', '35.js', '18.js']) {
    const p = path.join(buildDir, ch);
    execSync(`node -c "${p}"`);
    console.log(`[PASS] Syntax check OK for ${ch}`);
}

// 4. Update TypeScript source files as well
// ministry.ts
const ministryTsPath = path.join(srcPagesDir, 'ministry', 'ministry.ts');
let ministryTs = fs.readFileSync(ministryTsPath, 'utf8');
ministryTs = ministryTs.replace(/term:\s*\[true\],\],/g, 'term: [true],');
if (!ministryTs.includes('this.r = this.ministryform.controls;')) {
    ministryTs = ministryTs.replace('this.ministryform.reset();', 'this.r = this.ministryform.controls;');
}
fs.writeFileSync(ministryTsPath, ministryTs, 'utf8');
console.log('-> Updated src/pages/ministry/ministry.ts');

// church.ts
const churchTsPath = path.join(srcPagesDir, 'church', 'church.ts');
let churchTs = fs.readFileSync(churchTsPath, 'utf8');
churchTs = churchTs.replace(/term:\s*\[true\],\],/g, 'term: [true]');
fs.writeFileSync(churchTsPath, churchTs, 'utf8');
console.log('-> Updated src/pages/church/church.ts');

console.log('=== ALL REGISTRATION FORM FIXES APPLIED SUCCESSFULLY! ===');
