webpackJsonp([30],{

/***/ 425:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Forms2PageModule", function() { return Forms2PageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__forms2__ = __webpack_require__(480);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var Forms2PageModule = /** @class */ (function () {
    function Forms2PageModule() {
    }
    Forms2PageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__forms2__["a" /* Forms2Page */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__forms2__["a" /* Forms2Page */]),
            ],
        })
    ], Forms2PageModule);
    return Forms2PageModule;
}());

//# sourceMappingURL=forms2.module.js.map

/***/ }),

/***/ 480:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Forms2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import { HomePage } from '../home/home';
var Forms2Page = /** @class */ (function () {
    function Forms2Page(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    Forms2Page.prototype.gotohome = function () {
        this.navCtrl.push('HomePage');
    };
    Forms2Page.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad FormsPage');
    };
    Forms2Page.prototype.gotopage = function (id) {
        if (id == 1) {
            this.navCtrl.push('InstitutePage');
        }
        else if (id == 2) {
            this.navCtrl.push('MarriagePage');
        }
        else if (id == 3) {
            this.navCtrl.push('JobsPage');
        }
        else if (id == 4) {
            this.navCtrl.push('HelpPage');
        }
        else if (id == 5) {
            this.navCtrl.push('SearchhousePage');
        }
        else if (id == 6) {
            this.navCtrl.push('WingPage');
        }
        else if (id == 7) {
            this.navCtrl.push('SearchorganisationPage');
        }
        else if (id == 8) {
            this.navCtrl.push('FamilyCouncellingPage');
        }
    };
    Forms2Page = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-forms2',template:/*ion-inline-start:"C:\Users\rajes\StudioProjects\jbac_app\src\pages\forms2\forms2.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-buttons end>\n\n      <button ion-button (click)="gotohome()">\n\n        <ion-icon style="font-size: 20px;" name="home"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n    <ion-title style="text-align: center;"><b>సర్వీసస్</b></ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="pagecss">\n\n  <ion-card class="hesd" tappable (click)="gotopage(1)">\n\n    <ion-card-header >\n\n      క్రైస్తవ సంస్థలు\n\n    </ion-card-header>\n\n  </ion-card>\n\n  <ion-card class="hesd" tappable (click)="gotopage(2)">\n\n    <ion-card-header >\n\n      వివాహాలు\n\n    </ion-card-header>\n\n  </ion-card>\n\n  <ion-card class="hesd" tappable (click)="gotopage(3)">\n\n    <ion-card-header >\n\n      ఉద్యోగాలు\n\n    </ion-card-header>\n\n  </ion-card>\n\n  <ion-card class="hesd" tappable (click)="gotopage(4)">\n\n    <ion-card-header >\n\n      సహాయం కొరకు\n\n    </ion-card-header>\n\n  </ion-card>\n\n  <ion-card class="hesd" tappable (click)="gotopage(5)">\n\n    <ion-card-header >\n\n      సెర్చ్ బుసినెస్ / హౌస్ రెంట్ ఇన్ఫర్మేషన్\n\n    </ion-card-header>\n\n  </ion-card>\n\n  <ion-card class="hesd" tappable (click)="gotopage(6)">\n\n    <ion-card-header>\n\n      JBAC వింగ్స్ ఇన్ఫర్మేషన్\n\n    </ion-card-header>\n\n  </ion-card>\n\n  <ion-card class="hesd" tappable (click)="gotopage(7)">\n\n    <ion-card-header >\n\n      సెర్చ్ ఒరగనిరోషన్స్\n\n    </ion-card-header>\n\n  </ion-card>\n\n  <ion-card class="hesd" tappable (click)="gotopage(8)" style="border-left: 5px solid #00548F; background: linear-gradient(135deg, #e0f2fe, #ffffff);">\n    <ion-card-header style="color: #00548F; font-weight: bold;">\n      💑 వివాహ & కుటుంబ కౌన్సిలింగ్ (Family Counselling)\n    </ion-card-header>\n  </ion-card>\n</ion-content>'/*ion-inline-end:"C:\Users\rajes\StudioProjects\jbac_app\src\pages\forms2\forms2.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["s" /* NavParams */]])
    ], Forms2Page);
    return Forms2Page;
}());

//# sourceMappingURL=forms2.js.map

/***/ })

});
//# sourceMappingURL=30.js.map