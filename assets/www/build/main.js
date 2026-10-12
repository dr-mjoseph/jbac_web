webpackJsonp([49],{

/***/ 128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var testApi = "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/";
var ServiceProvider = /** @class */ (function () {
    // testApi = 'http://localhost:2303/dashboardapi/'
    function ServiceProvider(http) {
        this.http = http;
        this.testApi = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';
        console.log('Hello ServiceProvider Provider');
    }
    // <-------------------------------------------------------Meeting start----------------------------------------------->
    ServiceProvider.prototype.getdenomation = function () {
        return this.http.post(testApi + 'denomations', []);
    };
    ServiceProvider.prototype.getbeliversdata = function () {
        return this.http.post(this.testApi + 'getbeliversdata', []);
    };
    ServiceProvider.prototype.searchingdemonationdata = function (data) {
        return this.http.post(this.testApi + 'searchingdemonation', data);
    };
    ServiceProvider.prototype.getdistrict = function () {
        return this.http.post(this.testApi + 'getdistricts', []);
    };
    ServiceProvider.prototype.getconsistencys = function () {
        return this.http.post(this.testApi + 'getconsistencys', []);
    };
    ServiceProvider.prototype.getmandals = function () {
        return this.http.post(this.testApi + 'getmandals', []);
    };
    ServiceProvider.prototype.gepanchayatis = function () {
        return this.http.post(this.testApi + 'gepanchayati', []);
    };
    ServiceProvider.prototype.searchingdata = function (data) {
        return this.http.post(this.testApi + 'searchingdata', data);
    };
    ServiceProvider.prototype.getevents = function () {
        return this.http.post(this.testApi + 'getupdateevents', []);
    };
    ServiceProvider.prototype.getpastorsfilters = function (data) {
        return this.http.post(this.testApi + 'getpastorsfilters', data);
    };
    ServiceProvider.prototype.getwing = function () {
        return this.http.post(this.testApi + 'getwing', []);
    };
    ServiceProvider.prototype.getchurch = function () {
        return this.http.post(this.testApi + 'getchurch', []);
    };
    ServiceProvider.prototype.getbelivers = function () {
        return this.http.post(this.testApi + 'getbelivers', []);
    };
    ServiceProvider.prototype.getservices = function () {
        return this.http.post(this.testApi + 'getservices', []);
    };
    ServiceProvider.prototype.institutes = function () {
        return this.http.post(this.testApi + 'getinstitutes', []);
    };
    ServiceProvider.prototype.postbeliver = function (data) {
        return this.http.post(this.testApi + 'postbeliversignup', data);
    };
    ServiceProvider.prototype.poststudentsignup = function (data) {
        return this.http.post(this.testApi + 'studentsignup', data);
    };
    ServiceProvider.prototype.postministrysignup = function (data) {
        return this.http.post(this.testApi + 'postministrysignup', data);
    };
    ServiceProvider.prototype.postchurchregister = function (data) {
        return this.http.post(this.testApi + 'postchurchregister', data);
    };
    ServiceProvider.prototype.postpastor = function (data) {
        return this.http.post(this.testApi + 'postpastor', data);
    };
    ServiceProvider.prototype.postindepedentorganisation = function (data) {
        return this.http.post(this.testApi + 'postindepedentorganisation', data);
    };
    ServiceProvider.prototype.postpastorassociationss = function (data) {
        return this.http.post(this.testApi + 'postpastorassociations', data);
    };
    ServiceProvider.prototype.getimages = function () {
        return this.http.post(this.testApi + 'getwebsitegallery', []);
    };
    ServiceProvider.prototype.postupdatenews = function (data) {
        return this.http.post(this.testApi + 'postnews', data);
    };
    ServiceProvider.prototype.Searchinstitute = function (data) {
        return this.http.post(this.testApi + 'Searchinstitute', data);
    };
    ServiceProvider.prototype.searchmarriages = function (data) {
        return this.http.post(this.testApi + 'Searchmarriages', data);
    };
    ServiceProvider.prototype.searchingmarriages = function (data) {
        return this.http.post(this.testApi + 'searchingmarriages', data);
    };
    ServiceProvider.prototype.getjobs = function (data) {
        return this.http.post(this.testApi + 'searchjob', data);
    };
    ServiceProvider.prototype.getjob = function () {
        return this.http.post(this.testApi + 'getjob', []);
    };
    ServiceProvider.prototype.searchjobswise = function (data) {
        return this.http.post(this.testApi + 'searchjobswise', data);
    };
    ServiceProvider.prototype.posthelping = function (data) {
        return this.http.post(this.testApi + 'posthelping', data);
    };
    ServiceProvider.prototype.searchingbusiness = function (data) {
        return this.http.post(this.testApi + 'searchingbusiness', data);
    };
    ServiceProvider.prototype.getbusiness = function () {
        return this.http.post(this.testApi + 'getbusiness', []);
    };
    ServiceProvider.prototype.postattacks = function (data) {
        return this.http.post(this.testApi + 'postattacks', data);
    };
    ServiceProvider.prototype.postsmeetings = function (data) {
        return this.http.post(this.testApi + 'postmeetings', data);
    };
    ServiceProvider.prototype.searchorganization = function (data) {
        return this.http.post(this.testApi + 'searchorganization', data);
    };
    ServiceProvider.prototype.searchinorganizations = function (data) {
        return this.http.post(this.testApi + 'searchinorganizations', data);
    };
    ServiceProvider.prototype.getorganizations = function () {
        return this.http.post(this.testApi + 'getorganizations', []);
    };
    ServiceProvider.prototype.postchurchmeetings = function (data) {
        return this.http.post(this.testApi + 'postchuechmeetings', data);
    };
    ServiceProvider.prototype.postinsututies = function (data) {
        return this.http.post(this.testApi + 'postinsututies', data);
    };
    ServiceProvider.prototype.postbusiness = function (data) {
        return this.http.post(this.testApi + 'postbusiness', data);
    };
    ServiceProvider.prototype.postingmarriages = function (data) {
        return this.http.post(this.testApi + 'postingmarriages', data);
    };
    ServiceProvider.prototype.postjobs = function (data) {
        return this.http.post(this.testApi + 'postjobs', data);
    };
    ServiceProvider.prototype.postadds = function (data) {
        return this.http.post(this.testApi + 'postadds', data);
    };
    ServiceProvider.prototype.passwordlogin = function (data) {
        return this.http.post(this.testApi + 'passwordwebsitelogin', data);
    };
    ServiceProvider.prototype.getpastorassci = function () {
        return this.http.post(this.testApi + 'getpastorassociation', []);
    };
    ServiceProvider.prototype.getuserprofilereport = function (data) {
        return this.http.post(this.testApi + 'getuserprofilereport', data);
    };
    ServiceProvider.prototype.geteditdtails = function (data) {
        return this.http.post(this.testApi + 'geteditdtails', data);
    };
    ServiceProvider.prototype.editbeliver = function (data) {
        return this.http.post(this.testApi + 'editbeliver', data);
    };
    ServiceProvider.prototype.editstudent = function (data) {
        return this.http.post(this.testApi + 'editstudent', data);
    };
    ServiceProvider.prototype.editministry = function (data) {
        return this.http.post(this.testApi + 'editministry', data);
    };
    ServiceProvider.prototype.editindependentorgainsation = function (data) {
        return this.http.post(this.testApi + 'editindependentorgainsation', data);
    };
    ServiceProvider.prototype.editpastororgainsation = function (data) {
        return this.http.post(this.testApi + 'editpastororgainsation', data);
    };
    ServiceProvider.prototype.editpastorsassociations = function (data) {
        return this.http.post(this.testApi + 'editpastorsassociations', data);
    };
    ServiceProvider.prototype.editchurch = function (data) {
        return this.http.post(this.testApi + 'editchurch', data);
    };
    ServiceProvider.prototype.editpastor = function (data) {
        return this.http.post(this.testApi + 'editpastor', data);
    };
    ServiceProvider.prototype.getcatewebsitegallery = function () {
        return this.http.get(this.testApi + 'getcatewebsitegallery');
    };
    ServiceProvider.prototype.getvideourl = function () {
        return this.http.get(this.testApi + 'getvideourl');
    };
    ServiceProvider.prototype.getUserMainData = function (data) {
        return this.http.post(this.testApi + 'getUserMainData', data);
    };
    ServiceProvider.prototype.getLeaderswebsiteD = function (data) {
        return this.http.post(this.testApi + 'getLeaderswebsiteData', data);
    };
    ServiceProvider.prototype.getLeaderswebsitewing = function (data) {
        return this.http.post(this.testApi + 'getLeaderswebsitewing', data);
    };
    ServiceProvider.prototype.deleteleaders = function (data) {
        return this.http.post(this.testApi + 'deleteboardmember', data);
    };
    ServiceProvider.prototype.updateconsistency = function (data) {
        return this.http.post(this.testApi + "updateconsis", data);
    };
    ServiceProvider.prototype.postinfo = function (data) {
        return this.http.post(this.testApi + "postinfo", data);
    };
    ServiceProvider.prototype.getupdatenews = function () {
        return this.http.get(this.testApi + "updatenewsdataa");
    };
    ServiceProvider.prototype.getchurchesdatafilters = function (data) {
        return this.http.post(this.testApi + "getchurchesdatafilters", data);
    };
    ServiceProvider.prototype.getchurches = function () {
        return this.http.post(this.testApi + "getchurches", []);
    };
    ServiceProvider.prototype.searchingchurchdata = function (data) {
        return this.http.post(this.testApi + 'searchingchurchdata', data);
    };
    ServiceProvider.prototype.getadds = function () {
        return this.http.post(this.testApi + 'searchingchurchdata', []);
    };
    ServiceProvider.prototype.updatecount = function () {
        return this.http.post(this.testApi + 'updatecount', []);
    };
    ServiceProvider.prototype.getcount = function () {
        return this.http.post(this.testApi + 'getcount', []);
    };
    // <-------------------------------------------------------Meeting End----------------------------------------------->
    ServiceProvider.prototype.checknumberpassword = function (data) {
        return this.http.post(this.testApi + 'checknumberpassword', data);
    };
    ServiceProvider.prototype.upadtedpassword = function (data) {
        return this.http.post(this.testApi + 'upadtedpassword', data);
    };
        ServiceProvider.prototype.getcouncellingdoctors = function () {
        return this.http.post(this.testApi + 'getcouncellingdoctors', {});
    };
    ServiceProvider.prototype.savecouncellingdoctor = function (data) {
        return this.http.post(this.testApi + 'savecouncellingdoctor', data);
    };
    ServiceProvider.prototype.deletecouncellingdoctor = function (data) {
        return this.http.post(this.testApi + 'deletecouncellingdoctor', data);
    };
    ServiceProvider.prototype.getcouncellingappointments = function (data) {
        return this.http.post(this.testApi + 'getcouncellingappointments', data);
    };
    ServiceProvider.prototype.bookcouncellingappointment = function (data) {
        return this.http.post(this.testApi + 'bookcouncellingappointment', data);
    };
    ServiceProvider.prototype.updateappointmentstatus = function (data) {
        return this.http.post(this.testApi + 'updateappointmentstatus', data);
    };
    ServiceProvider.prototype.registercouncellingdoctor = function (data) {
        return this.http.post(this.testApi + 'registerdoctor', data);
    };
    ServiceProvider.prototype.doctorvoicereply = function (data) {
        return this.http.post(this.testApi + 'doctorvoicereply', data);
    };
    ServiceProvider.prototype.getcouncellingvoicemessages = function (data) {
        return this.http.post(this.testApi + 'getcouncellingvoicemessages', data);
    };
    ServiceProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]])
    ], ServiceProvider);
    return ServiceProvider;
}());

//# sourceMappingURL=service.js.map

/***/ }),

/***/ 139:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 139;

/***/ }),

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/family-councelling/family-councelling.module": [
		511,
		49
	],
	"../pages/doctorregister/doctorregister.module": [
		513,
		50
	],
	"../pages/about/about.module": [
		408,
		48
	],
	"../pages/account/account.module": [
		409,
		47
	],
	"../pages/addads/addads.module": [
		410,
		46
	],
	"../pages/addattacks/addattacks.module": [
		411,
		45
	],
	"../pages/addbussiness/addbussiness.module": [
		412,
		44
	],
	"../pages/addchurchtimings/addchurchtimings.module": [
		413,
		43
	],
	"../pages/addinstitute/addinstitute.module": [
		415,
		42
	],
	"../pages/addjobs/addjobs.module": [
		414,
		41
	],
	"../pages/addmarriage/addmarriage.module": [
		429,
		40
	],
	"../pages/addmeetings/addmeetings.module": [
		416,
		39
	],
	"../pages/association/association.module": [
		418,
		38
	],
	"../pages/believer/believer.module": [
		417,
		37
	],
	"../pages/church-timings/church-timings.module": [
		419,
		36
	],
	"../pages/church/church.module": [
		422,
		35
	],
	"../pages/churchgo/churchgo.module": [
		421,
		34
	],
	"../pages/contact/contact.module": [
		420,
		33
	],
	"../pages/entry-form/entry-form.module": [
		424,
		32
	],
	"../pages/forgot-password/forgot-password.module": [
		423,
		31
	],
	"../pages/forms/forms.module": [
		426,
		29
	],
	"../pages/forms2/forms2.module": [
		425,
		30
	],
	"../pages/gallery/gallery.module": [
		427,
		28
	],
	"../pages/help/help.module": [
		428,
		27
	],
	"../pages/helpinghands/helpinghands.module": [
		430,
		26
	],
	"../pages/home/home.module": [
		432,
		1
	],
	"../pages/imagemodal/imagemodal.module": [
		433,
		25
	],
	"../pages/institute/institute.module": [
		431,
		24
	],
	"../pages/jobs/jobs.module": [
		435,
		23
	],
	"../pages/login/login.module": [
		434,
		0
	],
	"../pages/marriage/marriage.module": [
		438,
		22
	],
	"../pages/meeting/meeting.module": [
		436,
		5
	],
	"../pages/ministry/ministry.module": [
		437,
		21
	],
	"../pages/modalpage/modalpage.module": [
		439,
		20
	],
	"../pages/news-view/news-view.module": [
		440,
		4
	],
	"../pages/news/news.module": [
		441,
		19
	],
	"../pages/organisation/organisation.module": [
		443,
		18
	],
	"../pages/pages-privacy/pages-privacy.module": [
		442,
		17
	],
	"../pages/pastor/pastor.module": [
		444,
		16
	],
	"../pages/profile/profile.module": [
		445,
		15
	],
	"../pages/searchhouse/searchhouse.module": [
		446,
		14
	],
	"../pages/searchorganisation/searchorganisation.module": [
		449,
		13
	],
	"../pages/student/student.module": [
		447,
		12
	],
	"../pages/sub-gallery/sub-gallery.module": [
		450,
		6
	],
	"../pages/techsol/techsol.module": [
		448,
		11
	],
	"../pages/video-gallery-sub/video-gallery-sub.module": [
		451,
		3
	],
	"../pages/video-gallery/video-gallery.module": [
		454,
		2
	],
	"../pages/webhelp/webhelp.module": [
		452,
		10
	],
	"../pages/whatsapp/whatsapp.module": [
		455,
		9
	],
	"../pages/wing/wing.module": [
		453,
		8
	],
	"../pages/wingcommand/wingcommand.module": [
		456,
		7
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 182;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(255);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 255:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_service_service__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_common_http__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_forms__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_camera__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ionic_img_viewer__ = __webpack_require__(303);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/about/about.module#AboutPageModule', name: 'AboutPage', segment: 'about', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/account/account.module#AccountPageModule', name: 'AccountPage', segment: 'account', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/addads/addads.module#AddadsPageModule', name: 'AddadsPage', segment: 'addads', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/addattacks/addattacks.module#AddattacksPageModule', name: 'AddattacksPage', segment: 'addattacks', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/addbussiness/addbussiness.module#AddbussinessPageModule', name: 'AddbussinessPage', segment: 'addbussiness', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/addchurchtimings/addchurchtimings.module#AddchurchtimingsPageModule', name: 'AddchurchtimingsPage', segment: 'addchurchtimings', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/addjobs/addjobs.module#AddjobsPageModule', name: 'AddjobsPage', segment: 'addjobs', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/addinstitute/addinstitute.module#AddinstitutePageModule', name: 'AddinstitutePage', segment: 'addinstitute', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/addmeetings/addmeetings.module#AddmeetingsPageModule', name: 'AddmeetingsPage', segment: 'addmeetings', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/believer/believer.module#BelieverPageModule', name: 'BelieverPage', segment: 'believer', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/association/association.module#AssociationPageModule', name: 'AssociationPage', segment: 'association', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/church-timings/church-timings.module#ChurchTimingsPageModule', name: 'ChurchTimingsPage', segment: 'church-timings', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/contact/contact.module#ContactPageModule', name: 'ContactPage', segment: 'contact', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/family-councelling/family-councelling.module#FamilyCouncellingPageModule', name: 'FamilyCouncellingPage', segment: 'family-councelling', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/doctorregister/doctorregister.module#DoctorregisterPageModule', name: 'DoctorregisterPage', segment: 'doctorregister', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/churchgo/churchgo.module#ChurchgoPageModule', name: 'ChurchgoPage', segment: 'churchgo', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/church/church.module#ChurchPageModule', name: 'ChurchPage', segment: 'church', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/forgot-password/forgot-password.module#ForgotPasswordPageModule', name: 'ForgotPasswordPage', segment: 'forgot-password', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/entry-form/entry-form.module#EntryFormPageModule', name: 'EntryFormPage', segment: 'entry-form', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/forms2/forms2.module#Forms2PageModule', name: 'Forms2Page', segment: 'forms2', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/forms/forms.module#FormsPageModule', name: 'FormsPage', segment: 'forms', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/gallery/gallery.module#GalleryPageModule', name: 'GalleryPage', segment: 'gallery', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/help/help.module#HelpPageModule', name: 'HelpPage', segment: 'help', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/addmarriage/addmarriage.module#AddmarriagePageModule', name: 'AddmarriagePage', segment: 'addmarriage', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/helpinghands/helpinghands.module#HelpinghandsPageModule', name: 'HelpinghandsPage', segment: 'helpinghands', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/institute/institute.module#InstitutePageModule', name: 'InstitutePage', segment: 'institute', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/home/home.module#HomePageModule', name: 'HomePage', segment: 'home', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/imagemodal/imagemodal.module#ImagemodalPageModule', name: 'ImagemodalPage', segment: 'imagemodal', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/jobs/jobs.module#JobsPageModule', name: 'JobsPage', segment: 'jobs', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/meeting/meeting.module#MeetingPageModule', name: 'MeetingPage', segment: 'meeting', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/ministry/ministry.module#MinistryPageModule', name: 'MinistryPage', segment: 'ministry', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/marriage/marriage.module#MarriagePageModule', name: 'MarriagePage', segment: 'marriage', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/modalpage/modalpage.module#ModalpagePageModule', name: 'ModalpagePage', segment: 'modalpage', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/news-view/news-view.module#NewsViewPageModule', name: 'NewsViewPage', segment: 'news-view', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/news/news.module#NewsPageModule', name: 'NewsPage', segment: 'news', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/pages-privacy/pages-privacy.module#PagesPrivacyPageModule', name: 'PagesPrivacyPage', segment: 'pages-privacy', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/organisation/organisation.module#OrganisationPageModule', name: 'OrganisationPage', segment: 'organisation', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/pastor/pastor.module#PastorPageModule', name: 'PastorPage', segment: 'pastor', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/profile/profile.module#ProfilePageModule', name: 'ProfilePage', segment: 'profile', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/searchhouse/searchhouse.module#SearchhousePageModule', name: 'SearchhousePage', segment: 'searchhouse', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/student/student.module#StudentPageModule', name: 'StudentPage', segment: 'student', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/techsol/techsol.module#TechsolPageModule', name: 'TechsolPage', segment: 'techsol', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/searchorganisation/searchorganisation.module#SearchorganisationPageModule', name: 'SearchorganisationPage', segment: 'searchorganisation', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/sub-gallery/sub-gallery.module#SubGalleryPageModule', name: 'SubGalleryPage', segment: 'sub-gallery', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/video-gallery-sub/video-gallery-sub.module#VideoGallerySubPageModule', name: 'VideoGallerySubPage', segment: 'video-gallery-sub', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/webhelp/webhelp.module#WebhelpPageModule', name: 'WebhelpPage', segment: 'webhelp', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/wing/wing.module#WingPageModule', name: 'WingPage', segment: 'wing', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/video-gallery/video-gallery.module#VideoGalleryPageModule', name: 'VideoGalleryPage', segment: 'video-gallery', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/whatsapp/whatsapp.module#WhatsappPageModule', name: 'WhatsappPage', segment: 'whatsapp', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/wingcommand/wingcommand.module#WingcommandPageModule', name: 'WingcommandPage', segment: 'wingcommand', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_7__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_8__angular_forms__["e" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_8__angular_forms__["b" /* FormsModule */],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_6__providers_service_service__["a" /* ServiceProvider */],
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_10_ionic_img_viewer__["a" /* ImageViewerController */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 302:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_service_service__ = __webpack_require__(128);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




// import { HomePage } from '../pages/home/home';

var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, service) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.service = service;
        this.initializeApp();
                this.pages = [
            { 'title': 'వివాహ & కుటుంబ కౌన్సిలింగ్', 'subtitle': 'Family & Marriage Counselling', 'image': 'assets/icon/svg/couple.svg', 'page': 'FamilyCouncellingPage' },
            { 'title': 'వివాహ సంబంధాలు', 'subtitle': 'Christian Marriage Alliances', 'image': 'assets/icon/svg/register.svg', 'page': 'MarriagePage' },
            { 'title': 'వివాహ సంబంధం నమోదు', 'subtitle': 'Register Marriage Profile', 'image': 'assets/icon/svg/register.svg', 'page': 'AddmarriagePage' },
            { 'title': 'కౌన్సిలర్ / డాక్టర్ నమోదు', 'subtitle': 'Register as Counsellor', 'image': 'assets/icon/svg/employee.svg', 'page': 'DoctorregisterPage' },
            { 'title': 'మీకు మా సహాయం', 'subtitle': 'Helping Hands & Support', 'image': 'assets/icon/svg/helping-hand.svg', 'page': 'HelpinghandsPage' },
            { 'title': 'చర్చి పర్మిషన్ గవర్నమెంట్ ఆర్డర్స్', 'subtitle': 'Govt Orders & Church Permissions', 'image': 'assets/icon/svg/governmental.svg', 'page': 'ChurchgoPage' },
            { 'title': 'యాప్ ఎలా ఉపయోగించాలి', 'subtitle': 'App & Website Help Guide', 'image': 'assets/icon/svg/cloud-computing.svg', 'page': 'WebhelpPage' },
            { 'title': 'మీ చర్చికి మా టెక్నికల్ సొల్యూషన్స్', 'subtitle': 'Technical Church Solutions', 'image': 'assets/icon/svg/employee.svg', 'page': 'TechsolPage' },
            { 'title': 'ఫోటో గ్యాలరీ', 'subtitle': 'JBAC Photo Gallery', 'image': 'assets/icon/svg/picture.svg', 'page': 'GalleryPage' },
            { 'title': 'వీడియో గ్యాలరీ', 'subtitle': 'Video Gallery & Sermons', 'image': 'assets/icon/svg/video.svg', 'page': 'VideoGalleryPage' },
            { 'title': 'క్రైస్తవ వార్తలు', 'subtitle': 'Latest Christian News', 'image': 'assets/icon/svg/news.svg', 'page': 'NewsPage' },
            { 'title': 'క్రైస్తవులపై దాడుల నమోదు', 'subtitle': 'Report Attacks on Christians', 'image': 'assets/icon/svg/organisation.svg', 'page': 'AddattacksPage' },
            { 'title': 'JBAC వింగ్స్ సమాచారం', 'subtitle': 'JBAC Wings & Leadership', 'image': 'assets/icon/svg/project-manager.svg', 'page': 'WingPage' },
            { 'title': 'మమ్మల్ని సంప్రదించండి', 'subtitle': 'Contact JBAC Helpline', 'image': 'assets/icon/svg/contact-us.svg', 'page': 'ContactPage' }
        ];
        this.service.updatecount().subscribe(function (res) {
        });
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // this.statusBar.styleDefault();
            _this.statusBar.backgroundColorByHexString('#00548F'); // Set color to blue
            _this.splashScreen.hide();
            // if (localStorage.getItem("usr_id") == "" || localStorage.getItem("usr_id") == null || localStorage.getItem("usr_id") == undefined) {
            //   this.nav.setRoot('LoginPage'); // Use setRoot for the initial page
            // } else {
            _this.nav.setRoot('HomePage'); // Use setRoot for the initial page
            // }
        });
    };
    MyApp.prototype.openPage = function (page) {
        this.nav.push(page);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\app\\app.html"*/'<ion-menu [content]="content" type="overlay">\n  <ion-header>\n    <ion-toolbar color="primary" style="background-color: #00548F; color: white;">\n      <ion-title style="color: white; font-weight: bold; font-size: 16px;">\n        JBAC మెనూ\n      </ion-title>\n      <ion-buttons end>\n        <button ion-button icon-only menuClose tappable style="color: white; font-size: 22px;">\n          <ion-icon name="close"></ion-icon>\n        </button>\n      </ion-buttons>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content style="background-color: #f1f5f9;">\n    <div style="background: linear-gradient(135deg, #00548F, #19386d); padding: 16px 14px; color: white; margin-bottom: 8px;">\n      <div style="font-size: 16px; font-weight: bold; color: white;">Welcome to JBAC</div>\n      <div style="font-size: 11px; color: #dbeafe; margin-top: 3px;">జీసస్ బిలీవర్స్ అసోసియేషన్, ఆంధ్ర ప్రదేశ్</div>\n    </div>\n\n    <ion-list no-lines style="margin: 0; padding: 0 0 24px 0;">\n      <button ion-item *ngFor="let a of pages" (click)="openPage(a.page)" menuClose tappable class="jbac-menu-item">\n        <ion-avatar item-start class="jbac-menu-avatar">\n          <img [src]="a.image">\n        </ion-avatar>\n        <ion-label class="jbac-menu-label">\n          <div class="jbac-menu-title">{{a.title}}</div>\n          <div *ngIf="a.subtitle" class="jbac-menu-sub">{{a.subtitle}}</div>\n        </ion-label>\n        <ion-icon name="ios-arrow-forward" item-end class="jbac-menu-arrow"></ion-icon>\n      </button>\n    </ion-list>\n  </ion-content>\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it is poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\app\\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["u" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_4__providers_service_service__["a" /* ServiceProvider */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ })

},[247]);
//# sourceMappingURL=main.js.map