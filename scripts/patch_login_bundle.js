const fs = require('fs');
const vm = require('vm');

const newPassloginCode = `LoginPage.prototype.passlogin = function () {
        this.isLoggingIn = true;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var alert_1;
            var dismissLoadingSafely = function () {
                _this.isLoggingIn = false;
                if (_this.loading) {
                    try {
                        _this.loading.dismiss().catch(function () {});
                    } catch (e) {}
                }
            };
            return __generator(this, function (_a) {
                this.loading = this.loadingCtrl.create({
                    spinner: 'ios',
                    content: 'దయచేసి వేచి ఉండండి, ప్రాసెస్ అవుతోంది...'
                });
                this.loading.present();
                if (this.passloginform.invalid) {
                    dismissLoadingSafely();
                    alert_1 = this.alertCtrl.create({
                        mode: 'ios',
                        title: 'మీ వివరాలు తప్పు, సరి చుడండి',
                        buttons: ['OK']
                    });
                    alert_1.present();
                }
                else {
                    this.service.passwordlogin(this.passloginform.value).subscribe(function (res) {
                        dismissLoadingSafely();
                        if (res.status == 250) {
                            var alert_2 = _this.alertCtrl.create({
                                mode: 'ios',
                                title: 'ఈ నంబర్ రిజిస్టర్ కాలేదు',
                                buttons: ['OK']
                            });
                            alert_2.present();
                        }
                        else if (res.status == 600) {
                            var alert_3 = _this.alertCtrl.create({
                                mode: 'ios',
                                title: 'పాస్‌వర్డ్ తప్పు',
                                buttons: ['OK']
                            });
                            alert_3.present();
                        }
                        else if (res.status == 200 || res.status == 201) {
                            if (res.data && res.data.length > 0) {
                                localStorage.setItem('usr_id', res.data[0].id);
                                localStorage.setItem('mobile_number', _this.passloginform.value.mobile_number);
                                localStorage.setItem('name', res.data[0].name);
                                localStorage.setItem('category_id', _this.passloginform.value.category);
                                localStorage.setItem('auth_ind', "1");
                                if (_this.passloginform.value.category == 1) {
                                    localStorage.setItem('category', 'Believer');
                                }
                                else if (_this.passloginform.value.category == 2) {
                                    localStorage.setItem('category', 'Student');
                                }
                                else if (_this.passloginform.value.category == 3) {
                                    localStorage.setItem('category', 'Ministry');
                                }
                                else if (_this.passloginform.value.category == 4) {
                                    localStorage.setItem('category', 'Pastor');
                                }
                                else if (_this.passloginform.value.category == 5) {
                                    localStorage.setItem('category', 'Church');
                                }
                                else if (_this.passloginform.value.category == 6) {
                                    localStorage.setItem('category', 'Independent Organization');
                                }
                                else if (_this.passloginform.value.category == 7) {
                                    localStorage.setItem('category', 'Pastors Association ');
                                }
                                else if (_this.passloginform.value.category == 8) {
                                    localStorage.setItem('category', 'Doctor');
                                    localStorage.setItem('is_doctor', '1');
                                }
                            }

                            var navigated = false;
                            var doNavigate = function () {
                                if (navigated) return;
                                navigated = true;
                                var redirect = _this.navParams.get('redirect');
                                if (redirect === 'FamilyCouncellingPage' || redirect === 'family-councelling') {
                                    _this.navCtrl.setRoot('FamilyCouncellingPage');
                                } else {
                                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);
                                }
                            };

                            var alert_4 = _this.alertCtrl.create({
                                mode: 'ios',
                                title: 'విజయ వంతం గా లాగిన్ అయ్యారు',
                                buttons: [{
                                    text: 'OK',
                                    handler: function () {
                                        doNavigate();
                                    }
                                }]
                            });
                            alert_4.onDidDismiss(function () {
                                doNavigate();
                            });
                            alert_4.present();
                        }
                        else {
                            var alert_other = _this.alertCtrl.create({
                                mode: 'ios',
                                title: res.message || 'లాగిన్ విఫలమైంది',
                                buttons: ['OK']
                            });
                            alert_other.present();
                        }
                    }, function (err) {
                        dismissLoadingSafely();
                        var alert_err = _this.alertCtrl.create({
                            mode: 'ios',
                            title: 'సర్వర్ సమస్య ఉంది, దయచేసి మళ్లీ ప్రయత్నించండి',
                            buttons: ['OK']
                        });
                        alert_err.present();
                    });
                }
                return [2 /*return*/];
            });
        });
    };`;

function patchBundle(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn('File not found:', filePath);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    const startStr = 'LoginPage.prototype.passlogin = function';
    const startIdx = content.indexOf(startStr);
    if (startIdx === -1) {
        console.error('Could not find start in', filePath);
        return;
    }
    const endStr = 'LoginPage.prototype.gotoformspage = function';
    const endIdx = content.indexOf(endStr, startIdx);
    if (endIdx === -1) {
        console.error('Could not find end in', filePath);
        return;
    }

    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    const newContent = before + newPassloginCode + '\n    ' + after;

    // Validate syntax
    try {
        new vm.Script(newContent);
        console.log('Syntax valid for', filePath);
    } catch (e) {
        console.error('SYNTAX ERROR for', filePath, e);
        return;
    }

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Successfully patched', filePath);
}

patchBundle('C:/Users/rajes/StudioProjects/jbac_app/www/build/0.js');
patchBundle('C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/0.js');
