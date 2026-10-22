var webpackJsonp = function(a, b) { WScript.Echo('keys: ' + Object.keys(b).length); };
﻿webpackJsonp([18],{

/***/ 443:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OrganisationPageModule", function() { return OrganisationPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__organisation__ = __webpack_require__(495);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var OrganisationPageModule = /** @class */ (function () {
    function OrganisationPageModule() {
    }
    OrganisationPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__organisation__["a" /* OrganisationPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__organisation__["a" /* OrganisationPage */]),
            ],
        })
    ], OrganisationPageModule);
    return OrganisationPageModule;
}());

//# sourceMappingURL=organisation.module.js.map

/***/ }),

/***/ 495:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrganisationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_service_service__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(21);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var OrganisationPage = /** @class */ (function () {
    function OrganisationPage(navCtrl, navParams, service, formBuilder) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.service = service;
        this.formBuilder = formBuilder;
        this.submitted = false;
        this.form = this.formBuilder.group({
            organisation_name: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            checkbox: [''],
            believer_id: [''],
            pastor_id: [''],
            denomation: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            org_address: [''],
            location: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            contact_num: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(10)]],
            email: [''],
            website: [''],
            service_name: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            organizationtype: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            ministry_id: [''],
            password: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(6)]],
            // retypepassword: ['', [Validators.required, Validators.minLength(6)]],
            state_id: ['1'],
            districts: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            constituencyname: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            mandals: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            panchayati: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            villagename: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            ward: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]],
            term: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required]]
        });
    }
    OrganisationPage.prototype.onStateChange = function (event) {
        var stateId = event;
        if (this.searchdist !== undefined) this.searchdist = "";
        if (this.searchconts !== undefined) this.searchconts = "";
        var patchObj = { state_id: stateId };
        patchObj["districts"] = "";
        if (this.form) this.form.patchValue(patchObj);
        if (this.serachMeetingform) this.serachMeetingform.patchValue(patchObj);
        if (this.jobsadding) this.jobsadding.patchValue(patchObj);
        if (this.studentform) this.studentform.patchValue(patchObj);
        this.districts = [];
        this.constituency = [];
        this.mandals = [];
        this.panchayati = [];
        var _this = this;
        this.service.getdistrict(stateId).subscribe(function (res) {
            if (res && res.status == 200) {
                _this.districts = res.data;
            }
        }, function (error) {
            console.log(error);
        });
        if (this.getjobs) {
            if (stateId && this.service.searchjobswise) {
                this.service.searchjobswise({ state_id: stateId }).subscribe(function (res) {
                    if (res && res.status == 200 && Array.isArray(res.data)) {
                        _this.jobs = res.data;
                    }
                });
            } else {
                this.getjobs();
            }
        }
        if (this.defaultdata) {
            if (stateId && this.service.getorganizations) {
                this.service.getorganizations({ state_id: stateId }).subscribe(function (res) {
                    if (res && res.status == 200 && Array.isArray(res.data)) {
                        _this.marriagedata = res.data.map(function (item) { return Object.assign({}, item, { showMore: false }); });
                    }
                });
            } else {
                this.defaultdata();
            }
        }
    };
    OrganisationPage.prototype.ionViewDidLoad = function () {
        this.getdistric();
        this.getdenomations();
        this.getbelivers();
        this.getbeliver();
        this.getservice();
    };
    OrganisationPage.prototype.getbelivers = function () {
        var _this = this;
        this.service.getbelivers().subscribe(function (res) {
            _this.bliversdata = res.data;
        });
    };
    OrganisationPage.prototype.gotohome = function () {
        this.navCtrl.push('FormsPage');
    };
    OrganisationPage.prototype.getdenomations = function () {
        var _this = this;
        this.service.getdenomation().subscribe(function (res) {
            _this.denomation = res.data;
        });
    };
    OrganisationPage.prototype.getdistric = function () {
        var _this = this;
        this.service.getdistrict().subscribe(function (res) {
            _this.districts = res.data;
        });
    };
    OrganisationPage.prototype.getconstency = function (event) {
        var _this = this;
        var id = event;
        this.service.getconsistencys().subscribe(function (res) {
            _this.constituency = res.data.filter(function (data) { return data.dstrct_id == id; });
        });
    };
    OrganisationPage.prototype.getmandals = function (event) {
        var _this = this;
        var id = event;
        this.service.getmandals().subscribe(function (res) {
            _this.mandals = res.data.filter(function (data) { return data.const_id == id; });
        });
    };
    OrganisationPage.prototype.gepanchayati = function (event) {
        var _this = this;
        var id = event;
        this.service.gepanchayatis().subscribe(function (res) {
            _this.panchayati = res.data.filter(function (data) { return data.mndl_id == id; });
        });
    };
    OrganisationPage.prototype.filterbelivers = function (inputValue) {
        var val = inputValue.value;
        if (val && val.trim() != '') {
            var reportdata = this.bliversdata.filter(function (item) {
                return (item.fname.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
            this.bliversdata = reportdata;
        }
        else if (val == "") {
            this.getbelivers();
        }
    };
    // Accept Input As a Number Only
    OrganisationPage.prototype.numericOnly = function (event) {
        var patt = /^([0-9])$/;
        var result = patt.test(event.key);
        return result;
    };
    OrganisationPage.prototype.getservice = function () {
        var _this = this;
        this.service.getservices().subscribe(function (res) {
            if (res.status == 202) {
                alert(res.message);
            }
            else _this.showSpinner = false;
            if (res.status == 200) {
                _this.services = res.data;
            }
        });
    };
    OrganisationPage.prototype.getbeliver = function () {
        var _this = this;
        this.service.getbeliversdata().subscribe(function (res) {
            if (res.status == 202) {
                alert(res.message);
            }
            else _this.showSpinner = false;
            if (res.status == 200) {
                _this.ministryname = res.data;
            }
        });
    };
    OrganisationPage.prototype.postindepedentorganisation = function () {
        this.showSpinner = true;
        var _this = this;
        this.submitted = true;
        if (this.form.invalid) {
            alert('please fiil the details ');
            return;
        }
        else if (this.form.value.password != this.form.value.retypepassword) {
            alert("Passwords are Unmatched");
        }
        else {
            this.service.postindepedentorganisation(this.form.value).subscribe(function (res) {
                _this.showSpinner = false;
            if (res.status == 451) {
                    alert('ఇదే ఫోన్ నెంబర్ తో ఇంతకుముందే రిజిస్టర్ అయ్యారు');
                }
                else _this.showSpinner = false;
            if (res.status == 200) {
                    alert('విజయవంతముగా సబ్మిట్ అయింది');
                    _this.form.reset();
                    _this.submitted = false;
                }
                else {
                    alert('Error');
                }
            });
        }
    };
    OrganisationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-organisation',template:/*ion-inline-start:"C:\Users\rajes\StudioProjects\jbac_app\src\pages\organisation\organisation.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-buttons end>\n\n      <button ion-button (click)="gotohome()">\n\n        <ion-icon style="font-size: 20px;" name="home"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n    <ion-title style="text-align: center;"><b>సంస్థ రిజిస్ట్రేషన్</b></ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding class="pagecss">\n\n  \n\n  <form [formGroup]="form">\n\n    <ion-row>\n\n      <ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>సంస్థ పేరు <span style="color:red; ">*</span></ion-label>\n\n          <ion-input formControlName="organisation_name" type="text" placeholder="సంస్థ పేరు"></ion-input>\n\n        </ion-item>\n\n        <div *ngIf="submitted && form.get(\'organisation_name\').errors" class="invalid-feedback">\n\n          <div *ngIf="form.get(\'organisation_name\').errors[\'required\']">సంస్థ పేరు అవసరం</div>\n\n        </div>\n\n      </ion-col>\n\n\n\n      <ion-col col-12>\n\n        <ion-list>\n\n          <ion-label>సంస్థ యజమాని రకం <span style="color:red;"> * </span></ion-label>\n\n          <ion-item>\n\n            <input type="radio" value="1" formControlName="checkbox">\n\n            <label>విశ్వాసి</label>\n\n          </ion-item>\n\n          <ion-item>\n\n            <input type="radio" value="2" formControlName="checkbox" />\n\n            <label> పాస్టర్ </label>\n\n          </ion-item>\n\n        </ion-list>\n\n      </ion-col>\n\n\n\n      <ion-col col-12 *ngIf="form.get(\'checkbox\').value === \'1\'">\n\n        <ion-item>\n\n          <ion-label stacked>విశ్వాసి పేరు కోసం శోధించండి</ion-label>\n\n          <ion-input type="text" (keyup)="filterbelivers($event.target)"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n      <ion-col col-12 *ngIf="form.get(\'checkbox\').value === \'1\'">\n\n        <ion-item>\n\n          <ion-label stacked>విశ్వాసి</ion-label>\n\n          <ion-select formControlName="believer_id" placeholder="విశ్వాసి పేరు ఎంచుకోండి">\n\n            <ion-option *ngFor="let i of bliversdata" [value]="i.id">{{i.fname}}</ion-option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n      <ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>వాట్సాప్ నంబర్</ion-label>\n\n          <ion-input formControlName="org_address" type="text" placeholder="వాట్సాప్ నంబర్" maxlength="10"\n\n            minlength="10" (keypress)="numericOnly($event)"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n      <ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>స్థలం <span style="color:red; ">*</span></ion-label>\n\n          <ion-input formControlName="location" type="text" placeholder="స్థలం"></ion-input>\n\n        </ion-item>\n\n        <div *ngIf="submitted && form.get(\'location\').errors" class="invalid-feedback">\n\n          <div *ngIf="form.get(\'location\').errors[\'required\']">స్థలం అవసరం</div>\n\n        </div>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>సంస్థ సంప్రదించండి నెంబర్ <span\n\n              style="color:red; ">*</span></ion-label>\n\n          <ion-input formControlName="contact_num" type="text" placeholder="సంస్థ సంప్రదించండి నంబర్" maxlength="10"\n\n            minlength="10" (keypress)="numericOnly($event)"></ion-input>\n\n        </ion-item>\n\n        <div *ngIf="submitted && form.get(\'contact_num\').errors" class="invalid-feedback">\n\n          <div *ngIf="form.get(\'contact_num\').errors[\'required\']">సంస్థ సంప్రదించండి నెంబర్ అవసరం</div>\n\n          <div *ngIf="form.get(\'contact_num\').errors[\'maxlength\']">10 అంకెల నెంబర్ అవసరం</div>\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>ఇమెయిల్</ion-label>\n\n          <ion-input formControlName="email" type="text" placeholder="ఇమెయిల్"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n      <ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>సంస్థ వెబ్‌సైట్</ion-label>\n\n          <ion-input formControlName="website" type="text" placeholder="సంస్థ వెబ్‌సైట్"></ion-input>\n\n        </ion-item>\n\n      </ion-col>\n\n      <ion-col col-12>\n\n        <ion-item>\n\n          <ion-label stacked>సేవా పేరు <span style="color:red; ">*</span></ion-label>\n\n          <ion-select formControlName="service_name">\n\n            <ion-option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</ion-option>\n\n            <ion-option *ngFor="let item of services" [value]="item?.id">{{item?.servicename}}</ion-option>\n\n          </ion-select>\n\n        </ion-item>\n\n        <div *ngIf="submitted && form.get(\'service_name\').errors" class="invalid-feedback">\n\n          <div *ngIf="form.get(\'service_name\').errors[\'required\']">సేవా పేరు అవసరం\n\n          </div>\n\n        </div>\n\n      </ion-col>\n\n      <ion-col col-12>\n\n        <ion-list>\n\n          <ion-label>సంస్థ రకం <span style="color:red;"> * </span></ion-label>\n\n          <ion-item>\n\n            <input type="radio" value="Ministry" formControlName="organizationtype">\n\n            <label>మంత్రివర్గ సంస్థ </label>\n\n          </ion-item>\n\n          <ion-item>\n\n            <input type="radio" value="Independentchurch" formControlName="organizationtype" />\n\n            <label> స్వతంత్ర సంస్థ </label>\n\n          </ion-item>\n\n        </ion-list>\n\n\n\n        <div *ngIf="submitted && form.get(\'organizationtype\').errors" class="invalid-feedback">\n\n          <div *ngIf="form.get(\'organizationtype\').errors[\'organizationtype\']">సంస్థ రకం అవసరం</div>\n\n        </div>\n\n      </ion-col>\n\n\n\n      <ion-col col-12 *ngIf="form.get(\'organizationtype\').value === \'Ministry\'">\n\n        <ion-item>\n\n          <ion-label>మంత్రివర్గం</ion-label>\n\n          <ion-select formControlName="ministry_id">\n\n            <ion-option value="" disabled selected>మంత్రివర్గం ఎంచుకోండి</ion-option>\n\n            <ion-option *ngFor="let i of ministryname" [value]="i.id">{{i.ministryname}}</ion-option>\n\n          </ion-select>\n\n        </ion-item>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-card>\n\n      <p>చిరునామా</p>\n\n      <ion-row>\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>రాష్ట్రం / State <span style="color:red; ">*</span></ion-label>\n\n            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">\n\n              <ion-option value="1">ఆంధ్రప్రదేశ్ (AP)</ion-option>\n\n              <ion-option value="2">తెలంగాణ (TG)</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n        </ion-col>\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>జిల్లాలను ఎంచుకోండి <span\n\n                style="color:red; ">*</span></ion-label>\n\n            <ion-select formControlName="districts" (ionChange)="getconstency($event)"\n\n              style="height:37px;width: 273px;">\n\n              <ion-option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</ion-option>\n\n              <ion-option *ngFor="let item of districts" [value]="item.id">{{item.distrct_nm}}</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <div *ngIf="submitted && form.get(\'districts\').errors" class="invalid-feedback">\n\n            <div *ngIf="form.get(\'districts\').errors[\'required\']">జిల్లాలు అవసరం\n\n            </div>\n\n          </div>\n\n        </ion-col>\n\n\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>నియోజకవర్గం ఎంచుకోండి <span\n\n                style="color:red; ">*</span></ion-label>\n\n            <ion-select formControlName="constituencyname" (ionChange)="getmandals($event)"\n\n              style="height:37px;width: 273px;">\n\n              <ion-option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</ion-option>\n\n              <ion-option *ngFor="let item of constituency" [value]="item.id">{{item.const_nm}}</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <div *ngIf="submitted && form.get(\'constituencyname\').errors" class="invalid-feedback">\n\n            <div *ngIf="form.get(\'constituencyname\').errors[\'required\']">\n\n              నియోజకవర్గం అవసరం</div>\n\n          </div>\n\n        </ion-col>\n\n\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>మండలాను ఎంచుకోండి <span\n\n                style="color:red; ">*</span></ion-label>\n\n            <ion-select formControlName="mandals" (ionChange)="gepanchayati($event)" style="height:37px;width: 273px;">\n\n              <ion-option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</ion-option>\n\n              <ion-option *ngFor="let item of mandals" [value]="item.id">{{item.mndl_nm}}</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <div *ngIf="submitted && form.get(\'mandals\').errors" class="invalid-feedback">\n\n            <div *ngIf="form.get(\'mandals\').errors[\'required\']">మండలం అవసరం</div>\n\n          </div>\n\n        </ion-col>\n\n\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>పంచాయితీ ఎంచుకోండి <span\n\n                style="color:red; ">*</span></ion-label>\n\n            <ion-select formControlName="panchayati" style="height:37px;width: 273px;">\n\n              <ion-option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</ion-option>\n\n              <ion-option *ngFor="let item of panchayati" [value]="item.id">{{item.pnchyt_nm}}</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <div *ngIf="submitted && form.get(\'panchayati\').errors" class="invalid-feedback">\n\n            <div *ngIf="form.get(\'panchayati\').errors[\'required\']">పంచాయితీ అవసరం</div>\n\n          </div>\n\n        </ion-col>\n\n\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>గ్రామం పేరు / స్ట్రీట్ పేరు <span\n\n                style="color:red; ">*</span></ion-label>\n\n            <ion-input formControlName="villagename" type="text" placeholder="ఇక్కడ క్లిక్ చేసి నమోదు చేయండి"></ion-input>\n\n          </ion-item>\n\n          <div *ngIf="submitted && form.get(\'villagename\').errors" class="invalid-feedback">\n\n            <div *ngIf="form.get(\'villagename\').errors[\'required\']">గ్రామం పేరు అవసరం</div>\n\n          </div>\n\n        </ion-col>\n\n\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>మీ స్థానిక చిరునామా / హౌస్ నంబర్ <span\n\n                style="color:red; ">*</span></ion-label>\n\n            <ion-input formControlName="ward" type="text" placeholder="మీ స్ట్రీట్ పేరు నమోదు చేయండి"></ion-input>\n\n          </ion-item>\n\n          <div *ngIf="submitted && form.get(\'ward\').errors" class="invalid-feedback">\n\n            <div *ngIf="form.get(\'ward\').errors[\'required\']">స్ట్రీట్ పేరు అవసరం</div>\n\n          </div>\n\n        </ion-col>\n\n\n\n        <ion-col col-12 *ngIf="form==2">\n\n          <ion-item>\n\n            <ion-label stacked>పాస్టర్</ion-label>\n\n            <ion-select formControlName="pastor_id" (click)="getorgnaziationpstorsget()">\n\n              <ion-option value="" disabled selected>పాస్టర్‌ను ఎంచుకోండి</ion-option>\n\n              <ion-option *ngFor="let i of getorganizationpastors" [value]="i.id">{{i.pastorname}}</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n        </ion-col>\n\n\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>సెలెక్ట్ డినామినేషన్ మోడల్ <span\n\n                style="color:red; ">*</span></ion-label>\n\n            <ion-select formControlName="denomation" style="height:37px;width: 273px;">\n\n              <ion-option value="" disabled selected>ఇక్కడ క్లిక్ చేసి ఎంచుకోండి</ion-option>\n\n              <ion-option *ngFor="let item of denomation" [value]="item.id">{{item.denomation_name}}</ion-option>\n\n            </ion-select>\n\n          </ion-item>\n\n          <div *ngIf="submitted && form.get(\'denomation\').errors" class="invalid-feedback">\n\n            <div *ngIf="form.get(\'denomation\').errors[\'required\']">\n\n              డినామినేషన్ అవసరం\n\n            </div>\n\n          </div>\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-card>\n\n    <ion-row>\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>పాస్వర్డ్ <span style="color:red; ">*</span></ion-label>\n\n            <ion-input formControlName="password" type="password" placeholder="మీ పాస్వర్డ్‌ను నమోదు చేయండి"\n\n              maxlength="16" minlength="6"></ion-input>\n\n            <div *ngIf="submitted && form.get(\'password\').errors" class="invalid-feedback">\n\n              <div *ngIf="form.get(\'password\').errors[\'required\']">పాస్వర్డ్ అవసరం\n\n              </div>\n\n              <div *ngIf="form.get(\'password\').errors[\'minlength\']">పాస్వర్డ్ మినిమం 6 నుండి 16 అక్షరాలలో\n\n                ఉండాలి/అంకెలు/ప్రత్యేక అక్షరాలు ఉండాలి\n\n              </div>\n\n            </div>\n\n          </ion-item>\n\n        </ion-col>\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <ion-label stacked>పునఃనమోదు పాస్వర్డ్ <span\n\n                style="color:red; ">*</span></ion-label>\n\n            <ion-input formControlName="retypepassword" type="password"\n\n              placeholder="మీ పునఃనమోదు పాస్వర్డ్‌ను నమోదు చేయండి" maxlength="16" minlength="6"></ion-input>\n\n            <div *ngIf="submitted && form.get(\'retypepassword\').errors" class="invalid-feedback">\n\n              <div *ngIf="form.get(\'retypepassword\').errors[\'required\']">పునఃనమోదు పాస్వర్డ్ అవసరం\n\n              </div>\n\n              <div *ngIf="form.get(\'retypepassword\').errors[\'minlength\']">పాస్వర్డ్ మినిమం 6 నుండి 16 అక్షరాలలో\n\n                ఉండాలి/అంకెలు/ప్రత్యేక అక్షరాలు ఉండాలి\n\n              </div>\n\n            </div>\n\n          </ion-item>\n\n        </ion-col>\n\n        <ion-col col-12>\n\n          <ion-item>\n\n            <input type="checkbox" value="yes" formControlName="term">\n\n            <label> &nbsp; మీరు సంగ్రహించి మరియు పంపు చేయుటకు అంగీకరిస్తున్నారు</label>\n\n          </ion-item>\n\n        </ion-col>\n\n    </ion-row>\n\n\n\n    <ion-row>\n\n      <ion-col col-12>\n\n        <div style="text-align: center;">\n\n          <button ion-button color="secondary" (click)="postindepedentorganisation()" [disabled]="showSpinner" style="letter-spacing: 1px;"><ion-spinner *ngIf="showSpinner" name="crescent" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"></ion-spinner><span *ngIf="showSpinner">దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...</span><span *ngIf="!showSpinner">నమోదు చేయండి</span></button>\n\n            </div>\n\n      </ion-col>\n\n    </ion-row>\n\n  </form>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Users\rajes\StudioProjects\jbac_app\src\pages\organisation\organisation.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_service_service__["a" /* ServiceProvider */], __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */]])
    ], OrganisationPage);
    return OrganisationPage;
}());

//# sourceMappingURL=organisation.js.map

/***/ })

});
//# sourceMappingURL=18.js.map