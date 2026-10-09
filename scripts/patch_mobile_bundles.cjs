const fs = require('fs');
const path = require('path');

const mobileAppDir = 'C:/Users/rajes/StudioProjects/jbac_app';
const dirs = [
  path.join(mobileAppDir, 'www/build'),
  path.join(mobileAppDir, 'platforms/android/app/src/main/assets/www/build')
];

console.log('=== Patching Mobile Production Bundles for Marriage Counselling & Voice Consultation ===');

for (const buildDir of dirs) {
  if (!fs.existsSync(buildDir)) {
    console.log(`[SKIP] Directory not found: ${buildDir}`);
    continue;
  }
  console.log(`\nProcessing directory: ${buildDir}`);

  // -------------------------------------------------------------
  // 1. PATCH 0.js (HomePage navigation for id == 19)
  // -------------------------------------------------------------
  const zeroJsPath = path.join(buildDir, '0.js');
  if (fs.existsSync(zeroJsPath)) {
    let zeroJs = fs.readFileSync(zeroJsPath, 'utf8');
    if (!zeroJs.includes("id == 19") || !zeroJs.includes("'FamilyCouncellingPage'")) {
      // Find 'id == 18' handler
      const targetPattern = /else\s+if\s*\(\s*id\s*==\s*18\s*\)\s*\{[^}]*this\.navCtrl\.push\(\s*['"]AddattacksPage['"]\s*\);\s*\}/;
      const match = zeroJs.match(targetPattern);
      if (match) {
        const replacement = match[0] + "\n        else if (id == 19) {\n            this.navCtrl.push('FamilyCouncellingPage');\n        }";
        zeroJs = zeroJs.replace(targetPattern, replacement);
        fs.writeFileSync(zeroJsPath, zeroJs, 'utf8');
        console.log(`  [OK] Patched 0.js: added id == 19 -> FamilyCouncellingPage`);
      } else {
        console.log(`  [WARN] Could not find id == 18 pattern in 0.js`);
      }
    } else {
      console.log(`  [INFO] 0.js already contains FamilyCouncellingPage handler`);
    }
  }

  // -------------------------------------------------------------
  // 2. PATCH main.js (ServiceProvider endpoints)
  // -------------------------------------------------------------
  const mainJsPath = path.join(buildDir, 'main.js');
  if (fs.existsSync(mainJsPath)) {
    let mainJs = fs.readFileSync(mainJsPath, 'utf8');
    if (!mainJs.includes('doctorvoicereply')) {
      const injectTarget = 'ServiceProvider = __decorate([';
      const methodsToInject = `    ServiceProvider.prototype.getcouncellingdoctors = function () {
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
    `;
      if (mainJs.includes(injectTarget)) {
        mainJs = mainJs.replace(injectTarget, methodsToInject + injectTarget);
        fs.writeFileSync(mainJsPath, mainJs, 'utf8');
        console.log(`  [OK] Patched main.js: injected counselling & voice methods into ServiceProvider`);
      } else {
        console.log(`  [WARN] Could not find inject target in main.js`);
      }
    } else {
      console.log(`  [INFO] main.js already contains doctorvoicereply`);
    }
  }

  // -------------------------------------------------------------
  // 3. PATCH 49.js (FamilyCouncellingPage bundle with Voice)
  // -------------------------------------------------------------
  const fortyNinePath = path.join(buildDir, '49.js');
  // Read our pristine HTML template from family-councelling.html
  const htmlTemplatePath = path.join(mobileAppDir, 'src/pages/family-councelling/family-councelling.html');
  let rawHtml = fs.readFileSync(htmlTemplatePath, 'utf8');
  // Escape for JS template literal
  const escapedHtml = rawHtml.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');

  const compiled49Js = `webpackJsonp([49],{

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
        this.isLoggedIn = false;
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
            reason: '',
            notes: '',
            user_voice_audio: '',
            user_voice_text: '',
            user_language: 'te-IN'
        };

        this.selectedLang = 'te-IN';
        this.isRecording = false;
        this.recordingTimer = 0;
        this.recordingInterval = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordedAudioUrl = '';
        this.recordedAudioBase64 = '';
        this.speechRecognition = null;
        this.transcribedText = '';

        this.isDoctorVoiceReplyOpen = false;
        this.activeApptForReply = null;
        this.selectedDoctorLang = 'te-IN';
        this.isDoctorRecording = false;
        this.doctorRecordingTimer = 0;
        this.doctorRecordingInterval = null;
        this.doctorMediaRecorder = null;
        this.doctorAudioChunks = [];
        this.doctorRecordedAudioUrl = '';
        this.doctorRecordedAudioBase64 = '';
        this.doctorTranscribedText = '';
        this.doctorSpeechRecognition = null;

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
        this.role = (localStorage.getItem('role') || 'user').toLowerCase();
        var aortId = localStorage.getItem('aort_id');

        if (this.usr_id && this.usr_id !== ' ' && this.usr_id !== '' && this.usr_id !== 'null') {
            this.isLoggedIn = true;
        } else {
            this.isLoggedIn = false;
            this.usr_id = 'guest_' + Math.floor(100000 + Math.random() * 900000);
        }

        var categoryId = localStorage.getItem('category_id');
        var isDoctorStorage = localStorage.getItem('is_doctor');
        var category = (localStorage.getItem('category') || '').toLowerCase();

        if (this.role === 'admin' || aortId === '1' || aortId === '2') {
            this.isAdmin = true;
        }
        if (categoryId === '8' || isDoctorStorage === '1' || category.indexOf('doctor') !== -1 || category.indexOf('councellor') !== -1 || this.role === 'doctor') {
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

        var tmrw = new Date();
        tmrw.setDate(tmrw.getDate() + 1);
        this.bookingData.appointment_date = tmrw.toISOString().split('T')[0];

        this.loadDoctors();
        this.loadAppointments();
    };

    FamilyCouncellingPage.prototype.gotohome = function () {
        this.navCtrl.setRoot('HomePage');
    };

    FamilyCouncellingPage.prototype.goToLogin = function () {
        this.navCtrl.push('LoginPage');
    };

    FamilyCouncellingPage.prototype.gotoDoctorRegister = function () {
        this.navCtrl.push('DoctorregisterPage');
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
                var myDoc = _this.doctors.find(function (d) {
                    return String(d.usr_id) === String(_this.usr_id) || (_this.user_phone && String(d.phone_number || d.phone) === String(_this.user_phone));
                });
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
            phone_number: this.user_phone,
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
        this.clearUserVoiceRecording();
        this.viewMode = 'book_now';
    };

    FamilyCouncellingPage.prototype.cancelBooking = function () {
        this.selectedDoctor = null;
        this.clearUserVoiceRecording();
        this.viewMode = 'browse';
    };

    FamilyCouncellingPage.prototype.setLanguage = function (lang) {
        this.selectedLang = lang;
        this.bookingData.user_language = lang;
    };

    FamilyCouncellingPage.prototype.startUserVoiceRecording = function () {
        var _this = this;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showToast('మైక్రోఫోన్ సపోర్ట్ లేదు (Microphone not supported).');
            return;
        }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            _this.audioChunks = [];
            var MediaRec = window.MediaRecorder;
            if (!MediaRec) {
                _this.showToast('MediaRecorder not available.');
                return;
            }
            _this.mediaRecorder = new MediaRec(stream);
            _this.mediaRecorder.ondataavailable = function (e) {
                if (e.data && e.data.size > 0) {
                    _this.audioChunks.push(e.data);
                }
            };
            _this.mediaRecorder.onstop = function () {
                var audioBlob = new Blob(_this.audioChunks, { type: 'audio/webm' });
                _this.recordedAudioUrl = URL.createObjectURL(audioBlob);
                var reader = new FileReader();
                reader.onloadend = function () {
                    _this.recordedAudioBase64 = reader.result;
                    _this.bookingData.user_voice_audio = _this.recordedAudioBase64;
                };
                reader.readAsDataURL(audioBlob);
            };
            _this.mediaRecorder.start();
            _this.isRecording = true;
            _this.recordingTimer = 0;
            _this.recordingInterval = setInterval(function () {
                _this.recordingTimer++;
            }, 1000);

            var SpeechRec = window.webkitSpeechRecognition || window.SpeechRecognition;
            if (SpeechRec) {
                _this.speechRecognition = new SpeechRec();
                _this.speechRecognition.lang = _this.selectedLang;
                _this.speechRecognition.continuous = true;
                _this.speechRecognition.interimResults = true;
                _this.speechRecognition.onresult = function (event) {
                    var text = '';
                    for (var i = event.resultIndex; i < event.results.length; ++i) {
                        text += event.results[i][0].transcript;
                    }
                    if (text) {
                        _this.transcribedText = text;
                        _this.bookingData.user_voice_text = text;
                        if (!_this.bookingData.notes) {
                            _this.bookingData.notes = text;
                        }
                    }
                };
                try { _this.speechRecognition.start(); } catch (e) {}
            }
        }).catch(function (err) {
            _this.showToast('దయచేసి మైక్రోఫోన్ అనుమతి ఇవ్వండి.');
        });
    };

    FamilyCouncellingPage.prototype.stopUserVoiceRecording = function () {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            if (this.mediaRecorder.stream) {
                this.mediaRecorder.stream.getTracks().forEach(function (t) { return t.stop(); });
            }
        }
        if (this.speechRecognition) {
            try { this.speechRecognition.stop(); } catch (e) {}
        }
        if (this.recordingInterval) {
            clearInterval(this.recordingInterval);
        }
        this.isRecording = false;
        this.showToast('వాయిస్ రికార్డింగ్ పూర్తయింది!');
    };

    FamilyCouncellingPage.prototype.clearUserVoiceRecording = function () {
        if (this.isRecording) {
            this.stopUserVoiceRecording();
        }
        this.recordedAudioUrl = '';
        this.recordedAudioBase64 = '';
        this.transcribedText = '';
        this.recordingTimer = 0;
        this.bookingData.user_voice_audio = '';
        this.bookingData.user_voice_text = '';
    };

    FamilyCouncellingPage.prototype.submitAppointment = function () {
        var _this = this;
        if (!this.bookingData.doc_id) {
            this.showToast('దయచేసి డాక్టర్ని ఎంచుకోండి');
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
            doctor_id: this.bookingData.doc_id,
            doctor_name: this.selectedDoctor ? (this.selectedDoctor.doctor_name || this.selectedDoctor.name) : '',
            usr_id: this.usr_id,
            user_id: this.usr_id,
            patient_name: this.bookingData.patient_name,
            family_name: this.bookingData.patient_name,
            patient_phone: this.bookingData.patient_phone,
            phone_number: this.bookingData.patient_phone,
            patient_email: this.bookingData.patient_email || '',
            appointment_date: this.bookingData.appointment_date,
            appointment_time: this.bookingData.appointment_time,
            reason: this.bookingData.reason || 'Family Counselling & Consultation',
            notes: this.bookingData.notes || this.transcribedText || '',
            user_voice_audio: this.recordedAudioBase64 || '',
            user_voice_text: this.transcribedText || this.bookingData.notes || '',
            user_language: this.selectedLang || 'te-IN'
        };

        this.service.bookcouncellingappointment(payload).subscribe(function (res) {
            loader.dismiss();
            if (res && (res.status === 200 || res.status === '200')) {
                var alert = _this.alertCtrl.create({
                    title: 'విజయవంతం! (Success)',
                    subTitle: 'మీ అపాయింట్‌మెంట్ మరియు వాయిస్ కన్సల్టేషన్ విజయవంతంగా బుక్ అయ్యాయి!',
                    buttons: ['Ok']
                });
                alert.present();
                _this.loadAppointments();
                _this.clearUserVoiceRecording();
                _this.viewMode = 'my_bookings';
            } else {
                _this.showToast(res.message || 'అపాయింట్‌మెంట్ విఫలమైంది.');
            }
        }, function (err) {
            loader.dismiss();
            _this.showToast('నెట్‌వర్క్ సమస్య. దయచేసి మళ్లీ ప్రయత్నించండి.');
        });
    };

    FamilyCouncellingPage.prototype.openDoctorVoiceReply = function (appt) {
        this.activeApptForReply = appt;
        this.clearDoctorVoiceRecording();
        this.isDoctorVoiceReplyOpen = true;
    };

    FamilyCouncellingPage.prototype.closeDoctorVoiceReply = function () {
        this.clearDoctorVoiceRecording();
        this.isDoctorVoiceReplyOpen = false;
        this.activeApptForReply = null;
    };

    FamilyCouncellingPage.prototype.setDoctorLanguage = function (lang) {
        this.selectedDoctorLang = lang;
    };

    FamilyCouncellingPage.prototype.startDoctorVoiceRecording = function () {
        var _this = this;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showToast('మైక్రోఫోన్ సపోర్ట్ లేదు.');
            return;
        }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            _this.doctorAudioChunks = [];
            var MediaRec = window.MediaRecorder;
            if (!MediaRec) return;
            _this.doctorMediaRecorder = new MediaRec(stream);
            _this.doctorMediaRecorder.ondataavailable = function (e) {
                if (e.data && e.data.size > 0) {
                    _this.doctorAudioChunks.push(e.data);
                }
            };
            _this.doctorMediaRecorder.onstop = function () {
                var audioBlob = new Blob(_this.doctorAudioChunks, { type: 'audio/webm' });
                _this.doctorRecordedAudioUrl = URL.createObjectURL(audioBlob);
                var reader = new FileReader();
                reader.onloadend = function () {
                    _this.doctorRecordedAudioBase64 = reader.result;
                };
                reader.readAsDataURL(audioBlob);
            };
            _this.doctorMediaRecorder.start();
            _this.isDoctorRecording = true;
            _this.doctorRecordingTimer = 0;
            _this.doctorRecordingInterval = setInterval(function () {
                _this.doctorRecordingTimer++;
            }, 1000);

            var SpeechRec = window.webkitSpeechRecognition || window.SpeechRecognition;
            if (SpeechRec) {
                _this.doctorSpeechRecognition = new SpeechRec();
                _this.doctorSpeechRecognition.lang = _this.selectedDoctorLang;
                _this.doctorSpeechRecognition.continuous = true;
                _this.doctorSpeechRecognition.interimResults = true;
                _this.doctorSpeechRecognition.onresult = function (event) {
                    var text = '';
                    for (var i = event.resultIndex; i < event.results.length; ++i) {
                        text += event.results[i][0].transcript;
                    }
                    if (text) {
                        _this.doctorTranscribedText = text;
                    }
                };
                try { _this.doctorSpeechRecognition.start(); } catch (e) {}
            }
        }).catch(function (err) {
            _this.showToast('దయచేసి మైక్రోఫోన్ అనుమతి ఇవ్వండి.');
        });
    };

    FamilyCouncellingPage.prototype.stopDoctorVoiceRecording = function () {
        if (this.doctorMediaRecorder && this.isDoctorRecording) {
            this.doctorMediaRecorder.stop();
            if (this.doctorMediaRecorder.stream) {
                this.doctorMediaRecorder.stream.getTracks().forEach(function (t) { return t.stop(); });
            }
        }
        if (this.doctorSpeechRecognition) {
            try { this.doctorSpeechRecognition.stop(); } catch (e) {}
        }
        if (this.doctorRecordingInterval) {
            clearInterval(this.doctorRecordingInterval);
        }
        this.isDoctorRecording = false;
        this.showToast('డాక్టర్ వాయిస్ సలహా రికార్డ్ అయింది!');
    };

    FamilyCouncellingPage.prototype.clearDoctorVoiceRecording = function () {
        if (this.isDoctorRecording) {
            this.stopDoctorVoiceRecording();
        }
        this.doctorRecordedAudioUrl = '';
        this.doctorRecordedAudioBase64 = '';
        this.doctorTranscribedText = '';
        this.doctorRecordingTimer = 0;
    };

    FamilyCouncellingPage.prototype.sendDoctorVoiceReply = function () {
        var _this = this;
        if (!this.activeApptForReply) return;
        if (!this.doctorRecordedAudioBase64 && !this.doctorTranscribedText) {
            this.showToast('దయచేసి వాయిస్ సలహా లేదా టెక్స్ట్ నమోదు చేయండి.');
            return;
        }
        var loader = this.loadingCtrl.create({ content: 'వాయిస్ సలహా పంపబడుతోంది...' });
        loader.present();

        var payload = {
            appointment_id: this.activeApptForReply.id,
            id: this.activeApptForReply.id,
            doctor_voice_audio: this.doctorRecordedAudioBase64 || '',
            doctor_voice_text: this.doctorTranscribedText || '',
            doctor_language: this.selectedDoctorLang || 'te-IN',
            doctor_notes: this.doctorTranscribedText || 'Voice Consultation Advice Provided'
        };

        this.service.doctorvoicereply(payload).subscribe(function (res) {
            loader.dismiss();
            if (res && (res.status === 200 || res.status === '200')) {
                _this.activeApptForReply.doctor_voice_audio = payload.doctor_voice_audio;
                _this.activeApptForReply.doctor_voice_text = payload.doctor_voice_text;
                _this.activeApptForReply.doctor_language = payload.doctor_language;
                _this.activeApptForReply.status = 'Doctor Replied';
                _this.showToast('పేషెంట్‌కి వాయిస్ సలహా విజయవంతంగా పంపబడింది!');
                _this.closeDoctorVoiceReply();
                _this.loadAppointments();
            } else {
                _this.showToast(res ? res.message : 'సలహా పంపడంలో సమస్య ఏర్పడింది.');
            }
        }, function (err) {
            loader.dismiss();
            _this.showToast('నెట్‌వర్క్ సమస్య.');
        });
    };

    FamilyCouncellingPage.prototype.saveDoctorProfile = function () {
        var _this = this;
        if (!this.doctorProfile.doctor_name || !this.doctorProfile.phone) {
            this.showToast('దయచేసి డాక్టర్ పేరు మరియు ఫోన్ నంబర్ నమోదు చేయండి');
            return;
        }
        var loader = this.loadingCtrl.create({ content: 'డాక్టర్ ప్రొఫైల్ భద్రపరచబడుతోంది...' });
        loader.present();
        this.service.savecouncellingdoctor(this.doctorProfile).subscribe(function (res) {
            loader.dismiss();
            if (res && res.status === 200) {
                _this.isDoctor = true;
                _this.showToast('డాక్టర్ ప్రొఫైల్ విజయవంతంగా భద్రపరచబడింది!');
                _this.loadDoctors();
                _this.viewMode = 'browse';
            } else {
                _this.showToast(res.message || 'ప్రొఫైల్ సేవ్ విఫలమైంది');
            }
        }, function (err) {
            loader.dismiss();
            _this.showToast('నెట్‌వర్క్ సమస్య.');
        });
    };

    FamilyCouncellingPage.prototype.updateStatus = function (appt, newStatus) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'స్థితిని మార్చండి',
            message: 'ఈ అపాయింట్‌మెంట్ స్థితిని ' + newStatus + ' గా మార్చాలనుకుంటున్నారా?',
            buttons: [
                { text: 'రద్దు (Cancel)', role: 'cancel' },
                {
                    text: 'సరే (Confirm)',
                    handler: function () {
                        _this.service.updateappointmentstatus({ id: appt.id, status: newStatus }).subscribe(function (res) {
                            if (res && res.status === 200) {
                                appt.status = newStatus;
                                _this.showToast('అపాయింట్‌మెంట్ స్థితి మారింది');
                            }
                        });
                    }
                }
            ]
        });
        confirm.present();
    };

    FamilyCouncellingPage.prototype.getLangName = function (code) {
        if (!code) return 'తెలుగు';
        if (code.indexOf('te') === 0) return 'తెలుగు';
        if (code.indexOf('hi') === 0) return 'हिंदी';
        if (code.indexOf('en') === 0) return 'English';
        return code;
    };

    FamilyCouncellingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-family-councelling',
            template: \`${escapedHtml}\`
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

  fs.writeFileSync(fortyNinePath, compiled49Js, 'utf8');
  console.log(`  [OK] Patched 49.js: built and deployed full FamilyCouncellingPage bundle with multilingual voice consultation and unblocked guest flow!`);
}

console.log('\n=== All Mobile Production Bundles Successfully Patched and Synced! ===\n');
