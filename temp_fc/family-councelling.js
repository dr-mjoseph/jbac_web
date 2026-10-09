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
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
var FamilyCouncellingPage = /** @class */ (function () {
    function FamilyCouncellingPage(navCtrl, navParams, alertCtrl, toastCtrl, loadingCtrl, service) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.service = service;
        this.viewMode = 'browse'; // 'browse' | 'my_bookings' | 'doctor_profile' | 'doctor_schedule'
        this.role = 'user';
        this.isAdmin = false;
        this.isDoctor = false;
        this.doctors = [];
        this.appointments = [];
        this.selectedDoctor = null;
        this.loading = false;
        // Booking Form model
        this.bookingData = {
            doc_id: '',
            patient_name: '',
            patient_phone: '',
            patient_email: '',
            appointment_date: '',
            appointment_time: '10:00 AM - 11:00 AM',
            reason: '',
            notes: ''
        };
        // Doctor Profile Form model
        this.doctorProfile = {
            id: null,
            usr_id: '',
            doctor_name: '',
            specialty: 'Family Counsellor & Physician',
            qualification: 'MBBS, MD',
            phone: '',
            email: '',
            hospital_church: '',
            available_days: 'Mon, Wed, Fri',
            available_time_slots: '10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM',
            consultation_fee: '0',
            bio: '',
            is_active: 1
        };
        this.timeSlots = [
            '09:00 AM - 10:00 AM',
            '10:00 AM - 11:00 AM',
            '11:00 AM - 12:00 PM',
            '12:00 PM - 01:00 PM',
            '02:00 PM - 03:00 PM',
            '03:00 PM - 04:00 PM',
            '04:00 PM - 05:00 PM',
            '05:00 PM - 06:00 PM',
            '06:00 PM - 07:00 PM',
            '07:00 PM - 08:00 PM'
        ];
    }
    FamilyCouncellingPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.usr_id = localStorage.getItem('usr_id');
        this.user_name = localStorage.getItem('name') || '';
        this.user_phone = localStorage.getItem('phone') || '';
        this.user_email = localStorage.getItem('email') || '';
        this.role = localStorage.getItem('role') || 'user';
        var aortId = localStorage.getItem('aort_id');
        if (!this.usr_id || this.usr_id === ' ' || this.usr_id === '') {
            var alert_1 = this.alertCtrl.create({
                title: 'దయచేసి లాగిన్ అవ్వండి',
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
        // Safety guard: Non-doctors are never allowed into doctor tabs
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
        // Default booking date to tomorrow
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
                // Check if current user is one of the doctors
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
    var _a, _b, _c, _d, _e, _f;
    FamilyCouncellingPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-family-councelling',
            templateUrl: 'family-councelling.html',
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof NavController !== "undefined" && NavController) === "function" ? _a : Object, typeof (_b = typeof NavParams !== "undefined" && NavParams) === "function" ? _b : Object, typeof (_c = typeof AlertController !== "undefined" && AlertController) === "function" ? _c : Object, typeof (_d = typeof ToastController !== "undefined" && ToastController) === "function" ? _d : Object, typeof (_e = typeof LoadingController !== "undefined" && LoadingController) === "function" ? _e : Object, typeof (_f = typeof ServiceProvider !== "undefined" && ServiceProvider) === "function" ? _f : Object])
    ], FamilyCouncellingPage);
    return FamilyCouncellingPage;
}());
export { FamilyCouncellingPage };
