webpackJsonp([49],{

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
        var fallbackDocs = [
            { id: 1, name: "Rev. Dr. P. Emmanuel", qualification: "M.Th., Ph.D. in Family Counselling", specialization: "వివాహ & కుటుంబ కౌన్సిలర్ (Senior Marriage Counsellor)", experience: "18+ సం.", phone: "9848012345", email: "dr.emmanuel@jbac.org", hospital_name: "JBAC Family Guidance Centre, Vijayawada", city: "విజయవాడ / ఆన్‌లైన్", consultation_fee: "ఉచిత సేవ (Free Ministry)", available_days: "Mon-Sat", timings: "10:00 AM - 6:00 PM", status: "Active", languages: "Telugu, English" },
            { id: 2, name: "Dr. Sarah Grace", qualification: "M.A. (Psychology), Dip. Marital Therapy", specialization: "ప్రీ-మ్యారేజ్ & దాంపత్య సలహాదారు (Pre-Marriage & Couple Specialist)", experience: "12+ సం.", phone: "9440123456", email: "sarah.grace@jbac.org", hospital_name: "Christian Counselling Trust, Guntur", city: "గుంటూరు / ఆన్‌లైన్", consultation_fee: "ఉచిత సేవ (Free Ministry)", available_days: "All Days", timings: "11:00 AM - 7:00 PM", status: "Active", languages: "Telugu, English" },
            { id: 3, name: "Rev. K. Samuel", qualification: "M.Div., Certified Youth & Family Mentor", specialization: "యువతీ యువకుల వివాహ మార్గదర్శి (Youth & Pre-Marital Mentor)", experience: "15+ సం.", phone: "9989012345", email: "samuel.k@jbac.org", hospital_name: "Bethel Family Centre, Visakhapatnam", city: "విశాఖపట్నం / ఆన్‌లైన్", consultation_fee: "ఉచిత సేవ (Free Ministry)", available_days: "Mon-Fri", timings: "2:00 PM - 8:00 PM", status: "Active", languages: "Telugu, English, Hindi" },
            { id: 4, name: "Dr. M. Joseph", qualification: "M.S.W., Ph.D. (Social Work & Family Welfare)", specialization: "కుటుంబ సమాజ & సంక్షేమ సలహాదారు (Family Welfare Advisor)", experience: "20+ సం.", phone: "9849112233", email: "joseph.m@jbac.org", hospital_name: "Grace Family Restoration, Kurnool", city: "కర్నూలు / ఆన్‌లైన్", consultation_fee: "ఉచిత సేవ (Free Ministry)", available_days: "Mon-Sat", timings: "9:00 AM - 5:00 PM", status: "Active", languages: "Telugu, English" }
        ];
        _this.doctors = fallbackDocs;
        this.service.getcouncellingdoctors().subscribe(function (res) {
            if (res && res.status === 200 && res.data && res.data.length > 0) {
                _this.doctors = res.data;
                var myDoc = _this.doctors.find(function (d) {
                    return String(d.usr_id) === String(_this.usr_id) || (_this.user_phone && String(d.phone_number || d.phone) === String(_this.user_phone));
                });
                if (myDoc) {
                    _this.isDoctor = true;
                    _this.doctorProfile = Object.assign({}, myDoc);
                }
            }
        }, function (err) {
            console.warn('Network issue loading doctors, using verified counsellors:', err);
            _this.doctors = fallbackDocs;
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
        var nav = navigator;
        var getGum = function(opts) {
            if (nav.mediaDevices && nav.mediaDevices.getUserMedia) {
                return nav.mediaDevices.getUserMedia(opts);
            }
            var legacy = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
            if (legacy) {
                return new Promise(function(resolve, reject) {
                    legacy.call(nav, opts, resolve, reject);
                });
            }
            return Promise.reject(new Error('NO_GUM'));
        };

        var SpeechRec = window.webkitSpeechRecognition || window.SpeechRecognition;
        var speechActive = false;
        if (SpeechRec) {
            try {
                if (this.speechRecognition) {
                    try { this.speechRecognition.abort(); } catch(e){}
                }
                this.speechRecognition = new SpeechRec();
                this.speechRecognition.lang = this.selectedLang || 'te-IN';
                this.speechRecognition.continuous = true;
                this.speechRecognition.interimResults = true;
                this.speechRecognition.onresult = function (event) {
                    var text = '';
                    for (var i = event.resultIndex; i < event.results.length; ++i) {
                        text += event.results[i][0].transcript;
                    }
                    if (text) {
                        _this.transcribedText = text;
                        _this.bookingData.user_voice_text = text;
                        var currentNotes = _this.bookingData.notes || '';
                        if (currentNotes.indexOf(text) === -1) {
                            _this.bookingData.notes = currentNotes ? (currentNotes + ' ' + text) : text;
                        }
                    }
                };
                this.speechRecognition.start();
                speechActive = true;
            } catch (e) {}
        }

        this.isRecording = true;
        this.recordingTimer = 0;
        if (this.recordingInterval) clearInterval(this.recordingInterval);
        this.recordingInterval = setInterval(function () {
            _this.recordingTimer++;
        }, 1000);

        getGum({ audio: true }).then(function (stream) {
            _this.audioChunks = [];
            var MediaRec = window.MediaRecorder;
            if (MediaRec) {
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
                    stream.getTracks().forEach(function(t) { t.stop(); });
                };
                _this.mediaRecorder.start();
            }
        }).catch(function (err) {
            console.warn('Microphone error:', err);
            if (speechActive) {
                _this.showToast('స్పీచ్ రికగ్నిషన్ ప్రారంభమైంది! మాట్లాడండి.');
            } else {
                _this.isRecording = false;
                if (_this.recordingInterval) clearInterval(_this.recordingInterval);
                _this.showToast('దయచేసి మైక్రోఫోన్ అనుమతి ఇవ్వండి లేదా సమస్యను నేరుగా టైప్ చేయండి.');
            }
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
        var nav = navigator;
        var getGum = function(opts) {
            if (nav.mediaDevices && nav.mediaDevices.getUserMedia) {
                return nav.mediaDevices.getUserMedia(opts);
            }
            var legacy = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
            if (legacy) {
                return new Promise(function(resolve, reject) {
                    legacy.call(nav, opts, resolve, reject);
                });
            }
            return Promise.reject(new Error('NO_GUM'));
        };

        var SpeechRec = window.webkitSpeechRecognition || window.SpeechRecognition;
        var speechActive = false;
        if (SpeechRec) {
            try {
                if (this.doctorSpeechRecognition) {
                    try { this.doctorSpeechRecognition.abort(); } catch(e){}
                }
                this.doctorSpeechRecognition = new SpeechRec();
                this.doctorSpeechRecognition.lang = this.selectedDoctorLang || 'te-IN';
                this.doctorSpeechRecognition.continuous = true;
                this.doctorSpeechRecognition.interimResults = true;
                this.doctorSpeechRecognition.onresult = function (event) {
                    var text = '';
                    for (var i = event.resultIndex; i < event.results.length; ++i) {
                        text += event.results[i][0].transcript;
                    }
                    if (text) {
                        _this.doctorTranscribedText = text;
                    }
                };
                this.doctorSpeechRecognition.start();
                speechActive = true;
            } catch (e) {}
        }

        this.isDoctorRecording = true;
        this.doctorRecordingTimer = 0;
        if (this.doctorRecordingInterval) clearInterval(this.doctorRecordingInterval);
        this.doctorRecordingInterval = setInterval(function () {
            _this.doctorRecordingTimer++;
        }, 1000);

        getGum({ audio: true }).then(function (stream) {
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
                stream.getTracks().forEach(function(t) { t.stop(); });
            };
            _this.doctorMediaRecorder.start();
        }).catch(function (err) {
            console.warn('Doctor microphone error:', err);
            if (speechActive) {
                _this.showToast('స్పీచ్ రికగ్నిషన్ ప్రారంభమైంది! మాట్లాడండి.');
            } else {
                _this.isDoctorRecording = false;
                if (_this.doctorRecordingInterval) clearInterval(_this.doctorRecordingInterval);
                _this.showToast('దయచేసి మైక్రోఫోన్ అనుమతి ఇవ్వండి లేదా సలహాను టైప్ చేయండి.');
            }
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
            template: `<ion-header>
  <ion-navbar color="primary">
    <ion-title style="text-align: center; font-size: 15px;">
      <b>వివాహ & కుటుంబ కౌన్సిలింగ్ (Counselling)</b>
    </ion-title>
    <ion-buttons end>
      <button ion-button icon-only tappable (click)="gotohome()">
        <ion-icon name="home"></ion-icon>
      </button>
    </ion-buttons>
  </ion-navbar>

  <ion-toolbar no-border-top>
    <ion-segment [(ngModel)]="viewMode" color="primary">
      <ion-segment-button value="browse">
        కౌన్సిలర్లు
      </ion-segment-button>
      <ion-segment-button value="my_bookings">
        నా బుకింగ్స్
      </ion-segment-button>
      <ion-segment-button value="doctor_profile" *ngIf="isDoctor || isAdmin">
        ప్రొఫైల్
      </ion-segment-button>
      <ion-segment-button value="doctor_schedule" *ngIf="isDoctor || isAdmin">
        షెడ్యూల్
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>
</ion-header>

<ion-content class="pagecss">

  <!-- TOP BANNER FOR GUESTS: PROMINENT DOCTOR REGISTER & LOGIN BUTTONS -->
  <div *ngIf="!isLoggedIn && viewMode !== 'book_now'" style="background: linear-gradient(135deg, #f0fdf4, #e0f2fe); border: 1px solid #bbf7d0; margin: 10px; padding: 12px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 13px; font-weight: bold; color: #166534;">
          🩺 మీరు డాక్టర్ లేదా కౌన్సిలరా?
        </div>
        <div style="font-size: 11px; color: #374151; margin-top: 2px;">
          క్రిస్టియన్ ఫ్యామిలీ వెల్నెస్ నెట్‌వర్క్‌లో చేరండి
        </div>
      </div>
      <button ion-button small color="secondary" style="border-radius: 8px; font-weight: bold; margin: 0;" tappable (click)="gotoDoctorRegister()">
        రిజిస్టర్ అవ్వండి
      </button>
    </div>
  </div>

  <!-- TOP BANNER FOR DOCTORS & ADMINS -->
  <div *ngIf="(isDoctor || isAdmin) && viewMode !== 'book_now'" class="doctor-workspace-mobile-banner" style="background: linear-gradient(135deg, #00548F, #00365c); color: white; margin: 10px; padding: 12px 14px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,84,143,0.25);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-size: 13px; font-weight: bold; color: #ffeb3b;">
        🩺 డాక్టర్ వర్క్‌స్పేస్ (Doctor Portal)
      </span>
      <span style="background: rgba(255,255,255,0.2); font-size: 10px; padding: 2px 6px; border-radius: 6px;">
        DOCTOR
      </span>
    </div>
    <div style="display: flex; gap: 8px; margin-top: 8px;">
      <button ion-button small style="background-color: #10b981; font-weight: bold; margin: 0; flex: 1; border-radius: 6px;" tappable (click)="viewMode = 'doctor_schedule'">
        అపాయింట్‌మెంట్లు ({{ appointments.length }})
      </button>
      <button ion-button small outline style="border-color: white; color: white; font-weight: bold; margin: 0; flex: 1; border-radius: 6px;" tappable (click)="viewMode = 'doctor_profile'">
        ప్రొఫైల్ ఎడిట్
      </button>
    </div>
  </div>

  <!-- ==============================================
       TAB 1: BROWSE DOCTORS & COUNSELLORS
       ============================================== -->
  <div *ngIf="viewMode === 'browse'">
    <div style="background: #e0f2fe; padding: 10px 14px; margin: 10px; border-radius: 10px; color: #0369a1; font-size: 12px;">
      <b>✝️ Christian Marriage & Family Care:</b> వివాహ బంధాలు, కుటుంబ సమస్యలు, పిల్లల పెంపకం మరియు మానసిక ఆరోగ్యానికి క్రైస్తవ వైద్యులు & కౌన్సిలర్ల నుండి ఉచిత / నామమాత్రపు కన్సల్టేషన్.
    </div>

    <div *ngFor="let doc of doctors" class="doc-card" style="background: white; margin: 10px; padding: 14px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #00548F;">
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px;">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: #e0f2fe; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #00548F;">
          <ion-icon name="medkit"></ion-icon>
        </div>
        <div>
          <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #1e293b;">{{doc.doctor_name || doc.name}}</h3>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #0284c7; font-weight: 600;">{{doc.specialization || doc.specialty || 'Family Counsellor'}} &bull; {{doc.qualification || 'Certified'}}</p>
        </div>
      </div>

      <div style="font-size: 12px; color: #475569; line-height: 1.6;">
        <div><b>📅 రోజులు:</b> {{doc.available_days || 'Mon to Sat'}}</div>
        <div><b>⏰ సమయం:</b> {{doc.available_time_slots || (doc.available_time_start + ' - ' + doc.available_time_end) || '10:00 AM - 05:00 PM'}}</div>
        <div><b>📍 స్థలం:</b> {{doc.location || doc.hospital_church || 'Online Consultation'}}</div>
        <div><b>💳 ఫీజు:</b> {{doc.consultation_fee ? doc.consultation_fee : 'ఉచిత సేవ (Free Consultation)'}}</div>
      </div>

      <p *ngIf="doc.bio" style="font-size: 11.5px; color: #64748b; margin: 8px 0; background: #f8fafc; padding: 6px 10px; border-radius: 6px;">
        {{doc.bio}}
      </p>

      <div style="margin-top: 10px;">
        <button ion-button block color="primary" style="border-radius: 8px; font-weight: bold; margin: 0;" tappable (click)="openBookingForm(doc)">
          <ion-icon name="calendar" style="margin-right: 6px;"></ion-icon> అపాయింట్‌మెంట్ బుక్ చేసుకోండి
        </button>
      </div>
    </div>

    <div *ngIf="doctors.length === 0" style="text-align: center; padding: 40px 20px; color: #6b7280;">
      <ion-icon name="people" style="font-size: 48px; color: #cbd5e1;"></ion-icon>
      <p>కౌన్సిలర్ల వివరాలు లోడ్ అవుతున్నాయి...</p>
    </div>
  </div>

  <!-- ==============================================
       BOOKING FORM SUB-PAGE (WITH VOICE CONSULTATION)
       ============================================== -->
  <div *ngIf="viewMode === 'book_now' && selectedDoctor" style="padding: 10px;">
    <div style="background: #eef6ff; padding: 12px; border-radius: 10px; margin-bottom: 12px; border-left: 4px solid #00548F;">
      <h4 style="margin: 0; font-size: 15px; font-weight: bold; color: #00548F;">
        డాక్టర్: {{selectedDoctor.doctor_name || selectedDoctor.name}}
      </h4>
      <p style="margin: 2px 0 0 0; font-size: 12px; color: #4b5563;">
        {{selectedDoctor.specialization || selectedDoctor.specialty}}
      </p>
    </div>

    <div style="background: white; border-radius: 12px; padding: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); margin-bottom: 14px;">
      <h5 style="margin: 0 0 10px 0; font-size: 13.5px; font-weight: bold; color: #1e293b;">
        అపాయింట్‌మెంట్ వివరాలు
      </h5>

      <ion-list no-lines>
        <ion-item style="padding-left: 0;">
          <ion-label stacked>పేరు (Full Name) *</ion-label>
          <ion-input type="text" [(ngModel)]="bookingData.patient_name" placeholder="మీ పేరు"></ion-input>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>ఫోన్ నంబర్ (Phone) *</ion-label>
          <ion-input type="tel" [(ngModel)]="bookingData.patient_phone" placeholder="10-అంకెల ఫోన్"></ion-input>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>అపాయింట్‌మెంట్ తేదీ (Date) *</ion-label>
          <ion-datetime displayFormat="YYYY-MM-DD" pickerFormat="YYYY-MM-DD" [(ngModel)]="bookingData.appointment_date"></ion-datetime>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>సమయం (Time Slot) *</ion-label>
          <ion-select [(ngModel)]="bookingData.appointment_time">
            <ion-option *ngFor="let slot of timeSlots" [value]="slot">{{slot}}</ion-option>
          </ion-select>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>సమస్య సంక్షిప్తంగా (Reason)</ion-label>
          <ion-input type="text" [(ngModel)]="bookingData.reason" placeholder="ఉదా: వివాహ / కుటుంబ సలహా"></ion-input>
        </ion-item>
      </ion-list>
    </div>

    <!-- VOICE CONSULTATION CARD -->
    <div style="background: linear-gradient(135deg, #fef2f2, #fff7ed); border: 2px dashed #f87171; border-radius: 12px; padding: 14px; margin-bottom: 14px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <span style="font-size: 14px; font-weight: bold; color: #b91c1c;">
          🎙️ వాయిస్ కన్సల్టేషన్ (Voice Problem Recording)
        </span>
        <span style="background: #fee2e2; color: #991b1b; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 6px;">
          తెలుగు / English / हिंदी
        </span>
      </div>
      <p style="font-size: 11.5px; color: #7f1d1d; margin: 0 0 10px 0;">
        మీ సమస్యను నేరుగా మాట్లాడి రికార్డ్ చేయండి. డాక్టర్ గారికి మీ వాయిస్ మరియు అనువదించబడిన టెక్స్ట్ చేరుతుంది.
      </p>

      <!-- Language Selector -->
      <div style="display: flex; gap: 6px; margin-bottom: 12px;">
        <button ion-button small [outline]="selectedLang !== 'te-IN'" color="danger" style="flex: 1; border-radius: 6px; font-size: 11px; margin: 0;" tappable (click)="setLanguage('te-IN')">
          తెలుగు
        </button>
        <button ion-button small [outline]="selectedLang !== 'en-IN'" color="danger" style="flex: 1; border-radius: 6px; font-size: 11px; margin: 0;" tappable (click)="setLanguage('en-IN')">
          English
        </button>
        <button ion-button small [outline]="selectedLang !== 'hi-IN'" color="danger" style="flex: 1; border-radius: 6px; font-size: 11px; margin: 0;" tappable (click)="setLanguage('hi-IN')">
          हिंदी
        </button>
      </div>

      <!-- Record Buttons & Timer -->
      <div style="text-align: center; margin-bottom: 10px;">
        <button *ngIf="!isRecording" ion-button color="danger" style="border-radius: 24px; font-weight: bold; padding: 0 20px;" tappable (click)="startUserVoiceRecording()">
          <ion-icon name="mic" style="margin-right: 6px;"></ion-icon> మాట్లాడండి (Start Recording)
        </button>
        <button *ngIf="isRecording" ion-button color="dark" style="border-radius: 24px; font-weight: bold; padding: 0 20px; background-color: #dc2626;" tappable (click)="stopUserVoiceRecording()">
          <ion-icon name="square" style="margin-right: 6px;"></ion-icon> ఆపండి (Stop: {{ recordingTimer }}s)
        </button>
      </div>

      <!-- Audio Playback -->
      <div *ngIf="recordedAudioUrl" style="margin-top: 10px; text-align: center;">
        <audio [src]="recordedAudioUrl" controls style="width: 100%; height: 38px; margin-bottom: 6px;"></audio>
        <button ion-button clear small color="danger" tappable (click)="clearUserVoiceRecording()" style="margin: 0; font-size: 11px;">
          <ion-icon name="trash" style="margin-right: 4px;"></ion-icon> మళ్లీ రికార్డ్ చేయండి
        </button>
      </div>

      <!-- Transcribed Text Preview -->
      <div *ngIf="transcribedText || bookingData.notes" style="background: white; border-radius: 8px; padding: 10px; margin-top: 10px; border: 1px solid #fed7aa;">
        <div style="font-size: 11px; font-weight: bold; color: #c2410c; margin-bottom: 4px;">
          📝 వాయిస్ అనువాదం (Transcribed Text - {{ getLangName(selectedLang) }}):
        </div>
        <p style="margin: 0; font-size: 12px; color: #1e293b;">
          {{ transcribedText || bookingData.notes }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <ion-row>
      <ion-col col-6>
        <button ion-button block outline color="dark" tappable (click)="cancelBooking()">
          రద్దు (Cancel)
        </button>
      </ion-col>
      <ion-col col-6>
        <button ion-button block color="primary" tappable (click)="submitAppointment()">
          బుక్ చేయండి
        </button>
      </ion-col>
    </ion-row>
  </div>

  <!-- ==============================================
       TAB 2: MY BOOKINGS (PATIENT VIEW)
       ============================================== -->
  <div *ngIf="viewMode === 'my_bookings'">
    <div style="padding: 10px 14px 4px 14px;">
      <h4 style="font-size: 15px; font-weight: bold; color: #1e293b; margin: 0;">
        నా అపాయింట్‌మెంట్లు (My Appointments)
      </h4>
    </div>

    <div *ngFor="let appt of appointments" style="background: white; margin: 10px; padding: 14px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid #10b981;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: bold; font-size: 14px; color: #00548F;">
          👨‍⚕️ {{appt.doctor_name || 'Dr. Christian Counsellor'}}
        </span>
        <span style="font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 12px; background: #dcfce7; color: #15803d;">
          {{appt.status || 'Confirmed'}}
        </span>
      </div>

      <div style="font-size: 12px; color: #475569; line-height: 1.6;">
        <div><b>📅 తేదీ:</b> {{appt.appointment_date}} &bull; <b>సమయం:</b> {{appt.appointment_time}}</div>
        <div *ngIf="appt.counselling_type || appt.reason"><b>విషయం:</b> {{appt.counselling_type || appt.reason}}</div>
      </div>

      <!-- Patient voice audio preview if present -->
      <div *ngIf="appt.user_voice_audio || appt.user_voice_text" style="background: #f8fafc; border-radius: 8px; padding: 8px; margin-top: 8px; border: 1px solid #e2e8f0;">
        <div style="font-size: 11px; font-weight: bold; color: #64748b;">
          🎙️ మీ వాయిస్ సమస్య:
        </div>
        <audio *ngIf="appt.user_voice_audio" [src]="appt.user_voice_audio" controls style="width: 100%; height: 32px; margin-top: 4px;"></audio>
        <p *ngIf="appt.user_voice_text" style="margin: 4px 0 0 0; font-size: 11.5px; color: #334155;">
          "{{appt.user_voice_text}}"
        </p>
      </div>

      <!-- DOCTOR VOICE ADVICE REPLY -->
      <div *ngIf="appt.doctor_voice_audio || appt.doctor_voice_text || appt.doctor_notes" style="background: linear-gradient(135deg, #ecfdf5, #f0fdf4); border: 1px solid #86efac; border-radius: 10px; padding: 10px; margin-top: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 12.5px; font-weight: bold; color: #166534;">
            🩺 డాక్టర్ వాయిస్ సలహా (Doctor Voice Advice):
          </span>
          <span *ngIf="appt.doctor_language" style="font-size: 10px; background: #bbf7d0; color: #14532d; padding: 1px 6px; border-radius: 6px; font-weight: bold;">
            {{ getLangName(appt.doctor_language) }}
          </span>
        </div>
        <audio *ngIf="appt.doctor_voice_audio" [src]="appt.doctor_voice_audio" controls style="width: 100%; height: 36px; margin-bottom: 6px;"></audio>
        <p *ngIf="appt.doctor_voice_text || appt.doctor_notes" style="margin: 0; font-size: 12px; color: #166534; font-weight: 500;">
          {{ appt.doctor_voice_text || appt.doctor_notes }}
        </p>
      </div>
    </div>

    <div *ngIf="appointments.length === 0" style="text-align: center; padding: 40px 20px; color: #6b7280;">
      <ion-icon name="calendar" style="font-size: 48px; color: #cbd5e1;"></ion-icon>
      <p>మీకు ఇంకా ఏ విధమైన అపాయింట్‌మెంట్లు బుక్ కాలేదు.</p>
      <button ion-button outline small color="primary" tappable (click)="viewMode = 'browse'">
        కౌన్సిలర్లను చూడండి
      </button>
    </div>
  </div>

  <!-- ==============================================
       TAB 3: DOCTOR / ADMIN PROFILE SETUP
       ============================================== -->
  <div *ngIf="viewMode === 'doctor_profile' && (isDoctor || isAdmin)" style="padding: 10px;">
    <div style="background: white; border-radius: 12px; padding: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <h4 style="margin: 0 0 10px 0; font-size: 15px; font-weight: bold; color: #00548F;">
        🩺 డాక్టర్ ప్రొఫైల్ వివరాలు (Doctor Profile)
      </h4>

      <ion-list no-lines>
        <ion-item style="padding-left: 0;">
          <ion-label stacked>డాక్టర్ పేరు *</ion-label>
          <ion-input type="text" [(ngModel)]="doctorProfile.doctor_name" placeholder="Dr. Name"></ion-input>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>విద్యార్హత (Qualification) *</ion-label>
          <ion-input type="text" [(ngModel)]="doctorProfile.qualification" placeholder="MBBS, MD / Counsellor"></ion-input>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>స్పెషలైజేషన్ (Specialty) *</ion-label>
          <ion-input type="text" [(ngModel)]="doctorProfile.specialty" placeholder="Family Counselling / Psychologist"></ion-input>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>మొబైల్ ఫోన్ నంబర్ *</ion-label>
          <ion-input type="tel" [(ngModel)]="doctorProfile.phone"></ion-input>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>అందుబాటులో ఉండే రోజులు</ion-label>
          <ion-input type="text" [(ngModel)]="doctorProfile.available_days" placeholder="Mon, Wed, Fri"></ion-input>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>సమయాలు</ion-label>
          <ion-input type="text" [(ngModel)]="doctorProfile.available_time_slots" placeholder="10:00 AM - 05:00 PM"></ion-input>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>కన్సల్టేషన్ ఫీజు (ఉచితమైతే 0)</ion-label>
          <ion-input type="text" [(ngModel)]="doctorProfile.consultation_fee" placeholder="Free / 200"></ion-input>
        </ion-item>

        <ion-item style="padding-left: 0;">
          <ion-label stacked>డాక్టర్ పరిచయం (Bio)</ion-label>
          <ion-textarea rows="3" [(ngModel)]="doctorProfile.bio" placeholder="పరిచయం, సేవా వివరాలు..."></ion-textarea>
        </ion-item>
      </ion-list>

      <button ion-button block color="primary" tappable (click)="saveDoctorProfile()" style="border-radius: 8px; font-weight: bold; margin-top: 14px;">
        ప్రొఫైల్ సేవ్ చేయండి
      </button>
    </div>
  </div>

  <!-- ==============================================
       TAB 4: DOCTOR APPOINTMENTS SCHEDULE & VOICE REPLY
       ============================================== -->
  <div *ngIf="viewMode === 'doctor_schedule' && (isDoctor || isAdmin)">
    <div style="padding: 10px 14px 4px 14px;">
      <h4 style="font-size: 15px; font-weight: bold; color: #1e293b; margin: 0;">
        డాక్టర్ షెడ్యూల్ & పేషెంట్స్ (Schedule & Voice Consultations)
      </h4>
    </div>

    <!-- DOCTOR VOICE REPLY MODAL / PANEL -->
    <div *ngIf="isDoctorVoiceReplyOpen && activeApptForReply" style="background: linear-gradient(135deg, #eff6ff, #f0fdf4); border: 2px solid #3b82f6; border-radius: 12px; margin: 10px; padding: 14px; box-shadow: 0 4px 16px rgba(59,130,246,0.2);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 14px; font-weight: bold; color: #1d4ed8;">
          🎙️ వాయిస్ సలహా రికార్డింగ్ (Advice to {{ activeApptForReply.patient_name || activeApptForReply.family_name }})
        </span>
        <button ion-button icon-only clear small tappable (click)="closeDoctorVoiceReply()" style="color: #64748b;">
          <ion-icon name="close"></ion-icon>
        </button>
      </div>

      <!-- Language selector for doctor -->
      <div style="display: flex; gap: 6px; margin-bottom: 12px;">
        <button ion-button small [outline]="selectedDoctorLang !== 'te-IN'" color="primary" style="flex: 1; border-radius: 6px; font-size: 11px; margin: 0;" tappable (click)="setDoctorLanguage('te-IN')">
          తెలుగు
        </button>
        <button ion-button small [outline]="selectedDoctorLang !== 'en-IN'" color="primary" style="flex: 1; border-radius: 6px; font-size: 11px; margin: 0;" tappable (click)="setDoctorLanguage('en-IN')">
          English
        </button>
        <button ion-button small [outline]="selectedDoctorLang !== 'hi-IN'" color="primary" style="flex: 1; border-radius: 6px; font-size: 11px; margin: 0;" tappable (click)="setDoctorLanguage('hi-IN')">
          हिंदी
        </button>
      </div>

      <!-- Doctor recording button -->
      <div style="text-align: center; margin-bottom: 10px;">
        <button *ngIf="!isDoctorRecording" ion-button color="primary" style="border-radius: 24px; font-weight: bold; padding: 0 20px;" tappable (click)="startDoctorVoiceRecording()">
          <ion-icon name="mic" style="margin-right: 6px;"></ion-icon> వాయిస్ సలహా చెప్పండి
        </button>
        <button *ngIf="isDoctorRecording" ion-button color="danger" style="border-radius: 24px; font-weight: bold; padding: 0 20px;" tappable (click)="stopDoctorVoiceRecording()">
          <ion-icon name="square" style="margin-right: 6px;"></ion-icon> ఆపండి ({{ doctorRecordingTimer }}s)
        </button>
      </div>

      <!-- Doctor audio preview -->
      <div *ngIf="doctorRecordedAudioUrl" style="margin-top: 8px; text-align: center;">
        <audio [src]="doctorRecordedAudioUrl" controls style="width: 100%; height: 36px; margin-bottom: 6px;"></audio>
        <button ion-button clear small color="danger" tappable (click)="clearDoctorVoiceRecording()" style="margin: 0; font-size: 11px;">
          <ion-icon name="trash" style="margin-right: 4px;"></ion-icon> మళ్లీ రికార్డ్ చేయండి
        </button>
      </div>

      <!-- Doctor transcribed text -->
      <div *ngIf="doctorTranscribedText" style="background: white; border-radius: 8px; padding: 8px; margin: 8px 0; border: 1px solid #bfdbfe;">
        <div style="font-size: 11px; font-weight: bold; color: #1e40af;">
          📝 వాయిస్ అనువాదం ({{ getLangName(selectedDoctorLang) }}):
        </div>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #1e293b;">
          {{ doctorTranscribedText }}
        </p>
      </div>

      <!-- Submit button -->
      <div style="margin-top: 10px;">
        <button ion-button block color="secondary" style="border-radius: 8px; font-weight: bold; margin: 0;" tappable (click)="sendDoctorVoiceReply()">
          <ion-icon name="send" style="margin-right: 6px;"></ion-icon> పేషెంట్‌కి వాయిస్ సలహా పంపండి
        </button>
      </div>
    </div>

    <!-- Appointment list for doctor -->
    <div *ngFor="let appt of appointments" style="background: white; margin: 10px; padding: 14px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid #0284c7;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: bold; font-size: 14px; color: #00548F;">
          👤 {{appt.patient_name || appt.family_name}}
        </span>
        <span style="font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 12px; background: #e0f2fe; color: #0369a1;">
          {{appt.status || 'Confirmed'}}
        </span>
      </div>

      <div style="font-size: 12px; color: #475569; line-height: 1.6;">
        <div><b>📞 ఫోన్:</b> {{appt.phone_number || appt.patient_phone}}</div>
        <div><b>📅 తేదీ:</b> {{appt.appointment_date}} &bull; <b>సమయం:</b> {{appt.appointment_time}}</div>
        <div *ngIf="appt.counselling_type || appt.reason"><b>సమస్య:</b> {{appt.counselling_type || appt.reason}}</div>
      </div>

      <!-- Patient Voice Message & Speech-to-Text playback -->
      <div *ngIf="appt.user_voice_audio || appt.user_voice_text" style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 8px; margin-top: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 11px; font-weight: bold; color: #991b1b;">
            🎙️ పేషెంట్ వాయిస్ మెసేజ్:
          </span>
          <span *ngIf="appt.user_language" style="font-size: 9.5px; background: #fee2e2; color: #7f1d1d; padding: 1px 5px; border-radius: 4px; font-weight: bold;">
            {{ getLangName(appt.user_language) }}
          </span>
        </div>
        <audio *ngIf="appt.user_voice_audio" [src]="appt.user_voice_audio" controls style="width: 100%; height: 32px; margin-bottom: 4px;"></audio>
        <p *ngIf="appt.user_voice_text" style="margin: 0; font-size: 11.5px; color: #7f1d1d;">
          "{{ appt.user_voice_text }}"
        </p>
      </div>

      <!-- Doctor Previous Reply preview if exists -->
      <div *ngIf="appt.doctor_voice_audio || appt.doctor_voice_text" style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px; margin-top: 8px;">
        <div style="font-size: 11px; font-weight: bold; color: #166534; margin-bottom: 4px;">
          🩺 మీరు పంపిన వాయిస్ సలహా:
        </div>
        <audio *ngIf="appt.doctor_voice_audio" [src]="appt.doctor_voice_audio" controls style="width: 100%; height: 32px; margin-bottom: 4px;"></audio>
        <p *ngIf="appt.doctor_voice_text" style="margin: 0; font-size: 11.5px; color: #15803d;">
          {{ appt.doctor_voice_text }}
        </p>
      </div>

      <!-- Action buttons -->
      <div style="display: flex; gap: 8px; margin-top: 10px;">
        <button ion-button small color="primary" style="flex: 1; border-radius: 6px; font-weight: bold; margin: 0;" tappable (click)="openDoctorVoiceReply(appt)">
          <ion-icon name="mic" style="margin-right: 4px;"></ion-icon> వాయిస్ సలహా ఇవ్వండి
        </button>
        <button ion-button small outline color="secondary" style="border-radius: 6px; font-weight: bold; margin: 0;" tappable (click)="updateStatus(appt, 'Completed')">
          పూర్తయింది
        </button>
      </div>
    </div>

    <div *ngIf="appointments.length === 0" style="text-align: center; padding: 40px 20px; color: #6b7280;">
      <ion-icon name="clipboard" style="font-size: 48px; color: #cbd5e1;"></ion-icon>
      <p>షెడ్యూల్ చేసిన అపాయింట్‌మెంట్లు లేవు.</p>
    </div>
  </div>

</ion-content>
`
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
