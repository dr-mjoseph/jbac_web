const fs = require('fs');
const path = require('path');

const appRoot = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const androidAssets = path.join(appRoot, 'platforms\\android\\app\\src\\main\\assets\\www');
const wwwRoot = path.join(appRoot, 'www');

console.log('--- Step 1: Reading template HTML files ---');
const homeHtmlPath = path.join(appRoot, 'src\\pages\\home\\home.html');
const fcHtmlPath = path.join(appRoot, 'src\\pages\\family-councelling\\family-councelling.html');
const docHtmlPath = path.join(appRoot, 'src\\pages\\doctorregister\\doctorregister.html');

const homeHtml = fs.readFileSync(homeHtmlPath, 'utf8');
const fcHtml = fs.readFileSync(fcHtmlPath, 'utf8');
const docHtml = fs.readFileSync(docHtmlPath, 'utf8');

console.log(`home.html: ${homeHtml.length} bytes, fc.html: ${fcHtml.length} bytes, doc.html: ${docHtml.length} bytes`);

// Clean Telugu pages list for side menu
const cleanTeluguPagesArrayCode = `        this.pages = [
            { 'title': 'మీకు మా సహాయం', 'image': 'assets/icon/svg/helping-hand.svg', 'page': 'HelpinghandsPage' },
            { 'title': 'చర్చి పర్మిషన్ గవర్నమెంట్ ఆర్డర్స్', 'image': 'assets/icon/svg/governmental.svg', 'page': 'ChurchgoPage' },
            { 'title': 'ఫ్యామిలీ కౌన్సిలింగ్ (వివాహ సలహాదారులు)', 'image': 'assets/icon/svg/couple.svg', 'page': 'FamilyCouncellingPage' },
            { 'title': 'వెబ్ సైట్ ఎలా ఉపయోగించాలి', 'image': 'assets/icon/svg/cloud-computing.svg', 'page': 'WebhelpPage' },
            { 'title': 'మీ చర్చికి మా టెక్నికల్ సొల్యూషన్స్', 'image': 'assets/icon/svg/employee.svg', 'page': 'TechsolPage' },
            { 'title': 'ఫోటో గ్యాలరీ', 'image': 'assets/icon/svg/picture.svg', 'page': 'GalleryPage' },
            { 'title': 'వీడియో గ్యాలరీ', 'image': 'assets/icon/svg/video.svg', 'page': 'VideoGalleryPage' },
            { 'title': 'క్రైస్తవులకు సంబంధించిన వార్తలు పెట్టండి', 'image': 'assets/icon/svg/news.svg', 'page': 'NewsPage' },
            { 'title': 'క్రైస్తవులపై దాడుల నమోదు', 'image': 'assets/icon/svg/organisation.svg', 'page': 'AddattacksPage' },
            { 'title': 'JBAC వింగ్స్ సమాచారం', 'image': 'assets/icon/svg/project-manager.svg', 'page': 'WingPage' },
            { 'title': 'మమ్మల్ని సంప్రదించండి', 'image': 'assets/icon/svg/contact-us.svg', 'page': 'ContactPage' },
        ];`;

// Helper to escape HTML for template: /*ion-inline-start:...*/'...'/*ion-inline-end:...*/
function escapeTemplate(html) {
    return html
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\r?\n/g, '\\n');
}

// -------------------------------------------------------------
// PATCH MAIN.JS
// -------------------------------------------------------------
function patchMainJs(mainJsPath) {
    console.log(`Patching ${mainJsPath}...`);
    let content = fs.readFileSync(mainJsPath, 'utf8');

    // 1. Replace this.pages
    // Match this.pages = [ ... ];
    const pagesRegex = /this\.pages\s*=\s*\[[\s\S]*?\];/;
    if (!pagesRegex.test(content)) {
        throw new Error(`Could not find this.pages in ${mainJsPath}`);
    }
    content = content.replace(pagesRegex, cleanTeluguPagesArrayCode);

    // 2. Add family-councelling and doctorregister to map
    if (!content.includes('"../pages/family-councelling/family-councelling.module"')) {
        const mapEntry = `\t"../pages/family-councelling/family-councelling.module": [
\t\t511,
\t\t49
\t],
\t"../pages/doctorregister/doctorregister.module": [
\t\t513,
\t\t50
\t],
\t"../pages/about/about.module": [`;
        content = content.replace('\t"../pages/about/about.module": [', mapEntry);
    }

    // 3. Add to links: [ ... ]
    if (!content.includes("name: 'FamilyCouncellingPage'")) {
        const linksEntry = `                        { loadChildren: '../pages/family-councelling/family-councelling.module#FamilyCouncellingPageModule', name: 'FamilyCouncellingPage', segment: 'family-councelling', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/doctorregister/doctorregister.module#DoctorregisterPageModule', name: 'DoctorregisterPage', segment: 'doctorregister', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/churchgo/churchgo.module#ChurchgoPageModule', name: 'ChurchgoPage',`;
        content = content.replace(
            "                        { loadChildren: '../pages/churchgo/churchgo.module#ChurchgoPageModule', name: 'ChurchgoPage',",
            linksEntry
        );
    }

    fs.writeFileSync(mainJsPath, content, 'utf8');
    console.log(`Successfully patched ${mainJsPath}`);
}

// -------------------------------------------------------------
// PATCH 1.JS (HomePage)
// -------------------------------------------------------------
function patch1Js(oneJsPath) {
    console.log(`Patching ${oneJsPath}...`);
    let content = fs.readFileSync(oneJsPath, 'utf8');

    // 1. Add gotopage(19) handling if missing
    if (!content.includes('id == 19')) {
        const target = "else if (id == 18) {\n            this.navCtrl.push('AddattacksPage');\n        }";
        const replacement = `else if (id == 18) {
            this.navCtrl.push('AddattacksPage');
        }
        else if (id == 19) {
            if (localStorage.getItem("usr_id") == " " || localStorage.getItem("usr_id") == null || localStorage.getItem("usr_id") == undefined || localStorage.getItem("usr_id") == "") {
                var confirm_19 = this.alertCtrl.create({
                    mode: 'ios',
                    title: 'దయచేసి లాగిన్ అవ్వండి',
                    subTitle: 'ఫ్యామిలీ కౌన్సిలింగ్ సేవలను పొందడానికి దయచేసి లాగిన్ అవ్వండి (Login required)',
                    buttons: ['Ok']
                });
                confirm_19.present();
                this.navCtrl.push('LoginPage');
            } else {
                this.navCtrl.push('FamilyCouncellingPage');
            }
        }`;
        if (content.includes(target)) {
            content = content.replace(target, replacement);
        } else {
            // Try with \r\n
            const targetCRLF = target.replace(/\n/g, '\r\n');
            const replacementCRLF = replacement.replace(/\n/g, '\r\n');
            content = content.replace(targetCRLF, replacementCRLF);
        }
    }

    // 2. Replace the template string with updated homeHtml
    const templateRegex = /(selector:\s*'page-home',\s*template:\s*\/\*ion-inline-start:[^*]+\*\/)('[\s\S]*?')(\/\*ion-inline-end:[^*]+\*\/)/;
    if (!templateRegex.test(content)) {
        throw new Error(`Could not find home template in ${oneJsPath}`);
    }
    const escapedHome = escapeTemplate(homeHtml);
    content = content.replace(templateRegex, `$1'${escapedHome}'$3`);

    fs.writeFileSync(oneJsPath, content, 'utf8');
    console.log(`Successfully patched ${oneJsPath}`);
}

// -------------------------------------------------------------
// GENERATE 49.JS (FamilyCouncellingPage)
// -------------------------------------------------------------
function generate49Js() {
    const escapedFc = escapeTemplate(fcHtml);
    return `webpackJsonp([49],{

/***/ 511:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FamilyCouncellingPageModule", function() { return FamilyCouncellingPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__family_councelling__ = __webpack_require__(512);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var FamilyCouncellingPageModule = /** @class */ (function () {
    function FamilyCouncellingPageModule() {
    }
    FamilyCouncellingPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__family_councelling__["a" /* FamilyCouncellingPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__family_councelling__["a" /* FamilyCouncellingPage */]),
            ],
        })
    ], FamilyCouncellingPageModule);
    return FamilyCouncellingPageModule;
}());

/***/ }),

/***/ 512:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FamilyCouncellingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_service_service__ = __webpack_require__(128);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FamilyCouncellingPage = /** @class */ (function () {
    function FamilyCouncellingPage(navCtrl, navParams, alertCtrl, toastCtrl, loadingCtrl, service) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.service = service;
        this.viewMode = 'browse';
        this.role = 'user';
        this.isAdmin = false;
        this.isDoctor = false;
        this.doctors = [];
        this.appointments = [];
        this.selectedDoctor = null;
        this.loading = false;
        this.bookingData = {
            doc_id: '',
            patient_name: '',
            patient_phone: '',
            patient_email: '',
            appointment_date: '',
            appointment_time: '10:00 AM - 11:00 AM',
            reason: 'Family Counselling & Consultation',
            notes: ''
        };
        this.doctorProfile = {
            id: null,
            usr_id: '',
            doctor_name: '',
            specialization: 'Family Counsellor & Clinical Psychologist',
            qualification: '',
            experience_years: '',
            phone: '',
            email: '',
            consultation_fee: 'Free / Volunteer Service',
            available_days: 'Monday to Saturday',
            available_time_start: '10:00 AM',
            available_time_end: '05:00 PM',
            location: 'Vijayawada & Online Consultation',
            address: '',
            bio: ''
        };
    }
    FamilyCouncellingPage.prototype.ionViewDidLoad = function () {
        this.usr_id = localStorage.getItem('usr_id');
        this.user_name = localStorage.getItem('user_name') || localStorage.getItem('name') || '';
        this.user_phone = localStorage.getItem('phone_number') || localStorage.getItem('mobile') || '';
        this.user_email = localStorage.getItem('email') || '';
        this.role = (localStorage.getItem('role') || 'user').toLowerCase();
        var aortId = localStorage.getItem('aort_id');
        if (!this.usr_id || this.usr_id === ' ' || this.usr_id === '') {
            var alert_1 = this.alertCtrl.create({
                title: 'లాగిన్ అవ్వండి',
                subTitle: 'ఫ్యామిలీ కౌన్సిలింగ్ సేవలను పొందడానికి దయచేసి లాగిన్ అవ్వండి (Login required).',
                buttons: [{
                        text: 'Ok',
                        handler: function () {
                            _this.navCtrl.setRoot('LoginPage');
                        }
                    }]
            });
            alert_1.present();
            return;
        }
        var categoryId = localStorage.getItem('category_id');
        var isDoctorStorage = localStorage.getItem('is_doctor');
        var category = (localStorage.getItem('category') || '').toLowerCase();
        if (this.role === 'admin' || aortId === '1' || aortId === '2') {
            this.isAdmin = true;
        }
        if (categoryId === '8' || isDoctorStorage === '1' || category.includes('doctor') || category.includes('councellor') || this.role === 'doctor') {
            this.isDoctor = true;
            if (this.viewMode === 'browse') {
                this.viewMode = 'doctor_schedule';
            }
        }
        if (!this.isDoctor && !this.isAdmin && (this.viewMode === 'doctor_profile' || this.viewMode === 'doctor_schedule')) {
            this.viewMode = 'browse';
        }
        this.bookingData.patient_name = this.user_name;
        this.bookingData.patient_phone = this.user_phone;
        this.bookingData.patient_email = this.user_email;
        this.doctorProfile.usr_id = this.usr_id;
        this.doctorProfile.phone = this.user_phone;
        this.doctorProfile.email = this.user_email;
        if (this.user_name && !this.doctorProfile.doctor_name) {
            this.doctorProfile.doctor_name = this.user_name.startsWith('Dr') ? this.user_name : 'Dr. ' + this.user_name;
        }
        var tmrw = new Date();
        tmrw.setDate(tmrw.getDate() + 1);
        this.bookingData.appointment_date = tmrw.toISOString().split('T')[0];
        this.loadDoctors();
        this.loadAppointments();
    };
    FamilyCouncellingPage.prototype.gotohome = function () {
        this.navCtrl.setRoot('HomePage');
    };
    FamilyCouncellingPage.prototype.showToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    FamilyCouncellingPage.prototype.loadDoctors = function () {
        var _this = this;
        this.service.getcouncellingdoctors().subscribe(function (res) {
            if (res && res.status === 200) {
                _this.doctors = res.data || [];
                var myDoc = _this.doctors.find(function (d) { return String(d.usr_id) === String(_this.usr_id); });
                if (myDoc) {
                    _this.isDoctor = true;
                    _this.doctorProfile = Object.assign({}, myDoc);
                }
            }
        }, function (err) {
            console.error('Error loading doctors:', err);
        });
    };
    FamilyCouncellingPage.prototype.loadAppointments = function () {
        var _this = this;
        var payload = {
            usr_id: this.usr_id,
            role: (this.isAdmin || this.isDoctor) ? 'doctor' : 'user'
        };
        this.service.getcouncellingappointments(payload).subscribe(function (res) {
            if (res && res.status === 200) {
                _this.appointments = res.data || [];
            }
        }, function (err) {
            console.error('Error loading appointments:', err);
        });
    };
    FamilyCouncellingPage.prototype.openBookingForm = function (doc) {
        this.selectedDoctor = doc;
        this.bookingData.doc_id = doc.id;
        this.viewMode = 'book_now';
    };
    FamilyCouncellingPage.prototype.cancelBooking = function () {
        this.selectedDoctor = null;
        this.viewMode = 'browse';
    };
    FamilyCouncellingPage.prototype.submitAppointment = function () {
        var _this = this;
        if (!this.bookingData.doc_id) {
            this.showToast('దయచేసి డాక్టర్‌ను ఎంచుకోండి (Please select a doctor)');
            return;
        }
        if (!this.bookingData.patient_name || !this.bookingData.patient_phone) {
            this.showToast('దయచేసి మీ పేరు మరియు ఫోన్ నంబర్ నమోదు చేయండి');
            return;
        }
        if (!this.bookingData.appointment_date) {
            this.showToast('దయచేసి అపాయింట్‌మెంట్ తేదీని ఎంచుకోండి');
            return;
        }
        var loader = this.loadingCtrl.create({ content: 'అపాయింట్‌మెంట్ నమోదు అవుతోంది...' });
        loader.present();
        var payload = {
            doc_id: this.bookingData.doc_id,
            usr_id: this.usr_id,
            patient_name: this.bookingData.patient_name,
            patient_phone: this.bookingData.patient_phone,
            patient_email: this.bookingData.patient_email || '',
            appointment_date: this.bookingData.appointment_date,
            appointment_time: this.bookingData.appointment_time,
            reason: this.bookingData.reason || 'Family Counselling & Consultation',
            notes: this.bookingData.notes || ''
        };
        this.service.bookcouncellingappointment(payload).subscribe(function (res) {
            loader.dismiss();
            if (res && res.status === 200) {
                var alert_2 = _this.alertCtrl.create({
                    title: 'అభినందనలు! (Success)',
                    subTitle: 'మీ అపాయింట్‌మెంట్ విజయవంతంగా నమోదైంది! డాక్టర్ గారి షెడ్యూల్ ప్రకారం మీకు సమాచారం అందుతుంది.',
                    buttons: ['Ok']
                });
                alert_2.present();
                _this.loadAppointments();
                _this.viewMode = 'my_bookings';
            }
            else {
                _this.showToast(res.message || 'అపాయింట్‌మెంట్ నమోదు కాలేదు.');
            }
        }, function (err) {
            loader.dismiss();
            _this.showToast('సర్వర్ సమస్య. దయచేసి మళ్లీ ప్రయత్నించండి.');
        });
    };
    FamilyCouncellingPage.prototype.saveDoctorProfile = function () {
        var _this = this;
        if (!this.doctorProfile.doctor_name || !this.doctorProfile.phone) {
            this.showToast('దయచేసి డాక్టర్ పేరు మరియు ఫోన్ నంబర్ నమోదు చేయండి');
            return;
        }
        var loader = this.loadingCtrl.create({ content: 'డాక్టర్ ప్రొఫైల్ సేవ్ అవుతోంది...' });
        loader.present();
        this.service.savecouncellingdoctor(this.doctorProfile).subscribe(function (res) {
            loader.dismiss();
            if (res && res.status === 200) {
                _this.isDoctor = true;
                _this.showToast('డాక్టర్ ప్రొఫైల్ విజయవంతంగా సేవ్ అయ్యింది!');
                _this.loadDoctors();
                _this.viewMode = 'browse';
            }
            else {
                _this.showToast(res.message || 'ప్రొఫైల్ సేవ్ కాలేదు');
            }
        }, function (err) {
            loader.dismiss();
            _this.showToast('సర్వర్ సమస్య.');
        });
    };
    FamilyCouncellingPage.prototype.editDoctorAsAdmin = function (doc) {
        this.doctorProfile = Object.assign({}, doc);
        this.viewMode = 'doctor_profile';
        this.showToast('డాక్టర్ వివరాలు ఎడిట్ చేయడానికి లోడ్ అయ్యాయి');
    };
    FamilyCouncellingPage.prototype.updateStatus = function (appt, newStatus) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'స్టేటస్ మార్పు',
            message: 'ఈ అపాయింట్‌మెంట్ స్టేటస్‌ను ' + newStatus + ' గా మార్చాలనుకుంటున్నారా?',
            buttons: [
                { text: 'రద్దు (Cancel)', role: 'cancel' },
                {
                    text: 'సరే (Confirm)',
                    handler: function () {
                        _this.service.updateappointmentstatus({ id: appt.id, status: newStatus }).subscribe(function (res) {
                            if (res && res.status === 200) {
                                appt.status = newStatus;
                                _this.showToast('అపాయింట్‌మెంట్ స్టేటస్ నవీకరించబడింది');
                            }
                        });
                    }
                }
            ]
        });
        confirm.present();
    };
    FamilyCouncellingPage.prototype.gotoDoctorRegister = function () {
        this.navCtrl.push('DoctorregisterPage');
    };
    FamilyCouncellingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* IonicPage */])(),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-family-councelling',
            template: /*ion-inline-start:"C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\family-councelling\\family-councelling.html"*/'${escapedFc}'/*ion-inline-end:"C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\family-councelling\\family-councelling.html"*/
        }),
        __metadata("design:paramtypes", [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_service_service__["a" /* ServiceProvider */]
        ])
    ], FamilyCouncellingPage);
    return FamilyCouncellingPage;
}());

/***/ })

});
`;
}

// -------------------------------------------------------------
// GENERATE 50.JS (DoctorregisterPage)
// -------------------------------------------------------------
function generate50Js() {
    const escapedDoc = escapeTemplate(docHtml);
    return `webpackJsonp([50],{

/***/ 513:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DoctorregisterPageModule", function() { return DoctorregisterPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__doctorregister__ = __webpack_require__(514);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var DoctorregisterPageModule = /** @class */ (function () {
    function DoctorregisterPageModule() {
    }
    DoctorregisterPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__doctorregister__["a" /* DoctorregisterPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__doctorregister__["a" /* DoctorregisterPage */]),
            ],
        })
    ], DoctorregisterPageModule);
    return DoctorregisterPageModule;
}());

/***/ }),

/***/ 514:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DoctorregisterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_service_service__ = __webpack_require__(128);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DoctorregisterPage = /** @class */ (function () {
    function DoctorregisterPage(navCtrl, fb, alertCtrl, loadingCtrl, toastCtrl, service) {
        this.navCtrl = navCtrl;
        this.fb = fb;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.service = service;
        this.showSpinner = false;
        this.doctorForm = this.fb.group({
            doctor_name: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].minLength(3)]],
            license_number: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required]],
            specialization: ['Family Counsellor & Clinical Psychologist', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required]],
            qualification: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required]],
            experience_years: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required]],
            phone_number: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].pattern(/^[0-9]{10}$/)]],
            email: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].email]],
            password: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].minLength(6)]],
            consultation_fee: ['Free / Volunteer Service'],
            available_days: ['Monday to Saturday', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required]],
            available_time_start: ['10:00 AM', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required]],
            available_time_end: ['05:00 PM', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required]],
            location: ['Vijayawada & Online Consultation', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required]],
            address: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required]],
            bio: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */].required]],
            category_id: [8],
            category: ['Doctor']
        });
    }
    DoctorregisterPage.prototype.gotohome = function () {
        this.navCtrl.setRoot('HomePage');
    };
    DoctorregisterPage.prototype.goToLogin = function () {
        this.navCtrl.push('LoginPage');
    };
    DoctorregisterPage.prototype.submitDoctor = function () {
        var _this = this;
        if (this.doctorForm.invalid) {
            var alert_1 = this.alertCtrl.create({
                title: 'వివరాలు అసంపూర్ణం',
                subTitle: 'దయచేసి పేరు, లైసెన్స్ నంబర్, మొబైల్ నంబర్ మరియు పాస్‌వర్డ్ మొదలైన తప్పనిసరి వివరాలను పూరించండి.',
                buttons: ['Ok']
            });
            alert_1.present();
            return;
        }
        this.showSpinner = true;
        var payload = Object.assign({}, this.doctorForm.value, {
            category_id: 8,
            category: 'Doctor'
        });
        this.service.registercouncellingdoctor(payload).subscribe(function (res) {
            _this.showSpinner = false;
            if (res && res.status === 200) {
                var alert_2 = _this.alertCtrl.create({
                    title: 'రిజిస్ట్రేషన్ విజయవంతమైంది! 🎉',
                    subTitle: 'స్వాగతం, ' + payload.doctor_name + '! మీరు ఇప్పుడు మీ మొబైల్ నంబర్ ' + payload.phone_number + ' తో లాగిన్ అయి మీ అపాయింట్‌మెంట్స్ చూడవచ్చు.',
                    buttons: [{
                            text: 'లాగిన్ అవ్వండి (Login)',
                            handler: function () {
                                _this.navCtrl.setRoot('LoginPage');
                            }
                        }]
                });
                alert_2.present();
            }
            else if (res && res.status === 300) {
                var alert_3 = _this.alertCtrl.create({
                    title: 'మొబైల్ నంబర్ ఇప్పటికే ఉంది',
                    subTitle: res.message || 'ఈ మొబైల్ నంబర్‌తో ఇప్పటికే డాక్టర్ అకౌంట్ ఉంది. దయచేసి నేరుగా లాగిన్ అవ్వండి.',
                    buttons: [{
                            text: 'లాగిన్ పేజీకి వెళ్లండి',
                            handler: function () {
                                _this.navCtrl.setRoot('LoginPage');
                            }
                        }]
                });
                alert_3.present();
            }
            else {
                var alert_4 = _this.alertCtrl.create({
                    title: 'లోపం సంభవించింది',
                    subTitle: (res === null || res === void 0 ? void 0 : res.message) || 'రిజిస్ట్రేషన్ పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
                    buttons: ['Ok']
                });
                alert_4.present();
            }
        }, function (err) {
            _this.showSpinner = false;
            var alert = _this.alertCtrl.create({
                title: 'సర్వర్ సమస్య',
                subTitle: 'నెట్‌వర్క్ లోపం సంభవించింది. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ను పరిశీలించి మళ్లీ ప్రయత్నించండి.',
                buttons: ['Ok']
            });
            alert.present();
        });
    };
    DoctorregisterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* IonicPage */])(),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-doctorregister',
            template: /*ion-inline-start:"C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\doctorregister\\doctorregister.html"*/'${escapedDoc}'/*ion-inline-end:"C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\doctorregister\\doctorregister.html"*/
        }),
        __metadata("design:paramtypes", [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["v" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_service_service__["a" /* ServiceProvider */]
        ])
    ], DoctorregisterPage);
    return DoctorregisterPage;
}());

/***/ })

});
`;
}

// -------------------------------------------------------------
// PATCH MAIN.CSS
// -------------------------------------------------------------
const additionalCss = `
/* Family Counselling & Doctor Register Styles */
page-family-councelling .pagecss { background-color: #f4f7f6; }
page-family-councelling ion-segment { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.06); }
page-family-councelling .segment-button { font-size: 12px !important; font-weight: bold; border-bottom-width: 3px !important; }
page-family-councelling .doc-card { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin: 12px; background: white; overflow: hidden; }
page-family-councelling .doc-header { background: linear-gradient(135deg, #00548F, #0077c2); color: white; padding: 12px 16px; display: flex; align-items: center; }
page-family-councelling .doc-avatar { width: 48px; height: 48px; border-radius: 50%; background: white; color: #00548F; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-right: 12px; }
page-family-councelling .doc-title { font-size: 15px; font-weight: bold; margin: 0; }
page-family-councelling .doc-specialty { font-size: 12px; color: #e0f2fe; margin: 2px 0 0 0; }
page-family-councelling .doc-body { padding: 14px 16px; }
page-family-councelling .detail-row { display: flex; align-items: center; margin-bottom: 6px; font-size: 12.5px; color: #4b5563; }
page-family-councelling .detail-row ion-icon { font-size: 15px; color: #00548F; width: 22px; }
page-family-councelling .btn-book { margin-top: 10px; border-radius: 8px; font-weight: bold; }
page-family-councelling .booking-card { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin: 12px; background: white; padding: 14px; }
page-family-councelling .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
page-family-councelling .status-pending { background: #fef3c7; color: #b45309; }
page-family-councelling .status-confirmed { background: #d1fae5; color: #047857; }
page-family-councelling .status-completed { background: #e0f2fe; color: #0369a1; }
page-family-councelling .status-cancelled { background: #fee2e2; color: #b91c1c; }
page-family-councelling .form-card { border-radius: 12px; background: white; padding: 14px; margin: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
page-family-councelling .form-title { font-size: 16px; font-weight: bold; color: #00548F; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
page-family-councelling .custom-item { border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px; padding: 0 8px; }

page-doctorregister .pagecss { background-color: #f1f5f9; }
page-doctorregister .form-card { background: #ffffff; border-radius: 12px; padding: 16px; margin: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
page-doctorregister .header-box { text-align: center; padding: 16px 12px 10px 12px; background: linear-gradient(135deg, #00548F, #00365c); color: white; border-radius: 12px; margin-bottom: 16px; }
page-doctorregister .custom-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px; padding-left: 8px; }
page-doctorregister .custom-item ion-label { font-size: 13px !important; font-weight: bold; color: #475569; }
page-doctorregister .custom-item ion-input,
page-doctorregister .custom-item ion-select,
page-doctorregister .custom-item ion-textarea { font-size: 14px; color: #0f172a; }
`;

function patchMainCss(cssPath) {
    let css = fs.readFileSync(cssPath, 'utf8');
    if (!css.includes('page-family-councelling')) {
        css += '\n' + additionalCss;
        fs.writeFileSync(cssPath, css, 'utf8');
        console.log(`Appended custom styles to ${cssPath}`);
    }
}

// -------------------------------------------------------------
// UPDATE APP.COMPONENT.TS
// -------------------------------------------------------------
function patchAppComponent() {
    const appCompPath = path.join(appRoot, 'src\\app\\app.component.ts');
    let comp = fs.readFileSync(appCompPath, 'utf8');
    const regex = /this\.pages\s*=\s*\[[\s\S]*?\];/;
    const cleanPagesTs = `    this.pages = [
      { 'title': 'మీకు మా సహాయం', 'image': 'assets/icon/svg/helping-hand.svg', 'page': 'HelpinghandsPage' },
      { 'title': 'చర్చి పర్మిషన్ గవర్నమెంట్ ఆర్డర్స్', 'image': 'assets/icon/svg/governmental.svg', 'page': 'ChurchgoPage' },
      { 'title': 'ఫ్యామిలీ కౌన్సిలింగ్ (వివాహ సలహాదారులు)', 'image': 'assets/icon/svg/couple.svg', 'page': 'FamilyCouncellingPage' },
      { 'title': 'వెబ్ సైట్ ఎలా ఉపయోగించాలి', 'image': 'assets/icon/svg/cloud-computing.svg', 'page': 'WebhelpPage' },
      { 'title': 'మీ చర్చికి మా టెక్నికల్ సొల్యూషన్స్', 'image': 'assets/icon/svg/employee.svg', 'page': 'TechsolPage' },
      { 'title': 'ఫోటో గ్యాలరీ', 'image': 'assets/icon/svg/picture.svg', 'page': 'GalleryPage' },
      { 'title': 'వీడియో గ్యాలరీ', 'image': 'assets/icon/svg/video.svg', 'page': 'VideoGalleryPage' },
      { 'title': 'క్రైస్తవులకు సంబంధించిన వార్తలు పెట్టండి', 'image': 'assets/icon/svg/news.svg', 'page': 'NewsPage' },
      { 'title': 'క్రైస్తవులపై దాడుల నమోదు', 'image': 'assets/icon/svg/organisation.svg', 'page': 'AddattacksPage' },
      { 'title': 'JBAC వింగ్స్ సమాచారం', 'image': 'assets/icon/svg/project-manager.svg', 'page': 'WingPage' },
      { 'title': 'మమ్మల్ని సంప్రదించండి', 'image': 'assets/icon/svg/contact-us.svg', 'page': 'ContactPage' },
    ];`;
    comp = comp.replace(regex, cleanPagesTs);
    fs.writeFileSync(appCompPath, comp, 'utf8');
    console.log(`Updated ${appCompPath}`);
}

// EXECUTE ALL OPERATIONS
const targets = [
    path.join(androidAssets, 'build'),
    path.join(wwwRoot, 'build')
];

for (const targetDir of targets) {
    patchMainJs(path.join(targetDir, 'main.js'));
    patch1Js(path.join(targetDir, '1.js'));
    patchMainCss(path.join(targetDir, 'main.css'));

    const code49 = generate49Js();
    fs.writeFileSync(path.join(targetDir, '49.js'), code49, 'utf8');
    console.log(`Generated 49.js in ${targetDir}`);

    const code50 = generate50Js();
    fs.writeFileSync(path.join(targetDir, '50.js'), code50, 'utf8');
    console.log(`Generated 50.js in ${targetDir}`);
}

patchAppComponent();

console.log('--- ALL APP BUNDLE PREPARATIONS COMPLETED SUCCESSFULLY! ---');
