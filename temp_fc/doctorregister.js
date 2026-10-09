var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ServiceProvider } from '../../providers/service/service';
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
            doctor_name: ['', [Validators.required, Validators.minLength(3)]],
            license_number: ['', [Validators.required]],
            specialization: ['Family Counsellor & Clinical Psychologist', [Validators.required]],
            qualification: ['', [Validators.required]],
            experience_years: ['', [Validators.required]],
            phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
            email: ['', [Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            consultation_fee: ['Free / Volunteer Service'],
            available_days: ['Monday to Saturday', [Validators.required]],
            available_time_start: ['10:00 AM', [Validators.required]],
            available_time_end: ['05:00 PM', [Validators.required]],
            location: ['Vijayawada & Online Consultation', [Validators.required]],
            address: ['', [Validators.required]],
            bio: ['', [Validators.required]],
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
    var _a, _b, _c, _d, _e, _f;
    DoctorregisterPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-doctorregister',
            templateUrl: 'doctorregister.html',
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof NavController !== "undefined" && NavController) === "function" ? _a : Object, typeof (_b = typeof FormBuilder !== "undefined" && FormBuilder) === "function" ? _b : Object, typeof (_c = typeof AlertController !== "undefined" && AlertController) === "function" ? _c : Object, typeof (_d = typeof LoadingController !== "undefined" && LoadingController) === "function" ? _d : Object, typeof (_e = typeof ToastController !== "undefined" && ToastController) === "function" ? _e : Object, typeof (_f = typeof ServiceProvider !== "undefined" && ServiceProvider) === "function" ? _f : Object])
    ], DoctorregisterPage);
    return DoctorregisterPage;
}());
export { DoctorregisterPage };
