const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appRoot = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const targetDirs = [
    path.join(appRoot, 'www', 'build'),
    path.join(appRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build')
];

for (const buildDir of targetDirs) {
    const f49Path = path.join(buildDir, '49.js');
    if (!fs.existsSync(f49Path)) continue;

    let f49 = fs.readFileSync(f49Path, 'utf8');

    // Regex to match openBookingForm regardless of \r\n or \n
    const openBookingRegex = /FamilyCouncellingPage\.prototype\.openBookingForm\s*=\s*function\s*\(\s*doc\s*\)\s*\{[\s\S]*?this\.viewMode\s*=\s*['"]book_now['"];\s*\};/;

    const replacement = `FamilyCouncellingPage.prototype.openBookingForm = function (doc) {
        var _this = this;
        if (!this.isLoggedIn) {
            var alert = this.alertCtrl.create({
                mode: 'ios',
                title: 'లాగిన్ అవసరం (Login Required)',
                message: 'డాక్టర్ అపాయింట్‌మెంట్ బుక్ చేయడానికి ముందుగా దయచేసి లాగిన్ అవ్వండి.\\n(Please login first to book an appointment.)',
                buttons: [
                    {
                        text: 'రద్దు (Cancel)',
                        role: 'cancel'
                    },
                    {
                        text: 'సభ్యుల నమోదు (Register)',
                        handler: function () {
                            _this.navCtrl.push('EntryFormPage');
                        }
                    },
                    {
                        text: 'లాగిన్ (Login)',
                        handler: function () {
                            _this.navCtrl.push('LoginPage', { redirect: 'FamilyCouncellingPage' });
                        }
                    }
                ]
            });
            alert.present();
            return;
        }
        this.selectedDoctor = doc;
        this.bookingData.doc_id = doc.id;
        this.clearUserVoiceRecording();
        this.viewMode = 'book_now';
    };

    FamilyCouncellingPage.prototype.onTabChange = function (tab) {
        var _this = this;
        if ((tab === 'my_bookings' || tab === 'doctor_profile' || tab === 'doctor_schedule') && !this.isLoggedIn) {
            var alert = this.alertCtrl.create({
                mode: 'ios',
                title: 'లాగిన్ అవసరం (Login Required)',
                message: 'మీ అపాయింట్‌మెంట్లు లేదా ప్రొఫైల్ చూడటానికి దయచేసి లాగిన్ అవ్వండి.\\n(Please login first to view bookings or dashboard.)',
                buttons: [
                    {
                        text: 'రద్దు (Cancel)',
                        role: 'cancel',
                        handler: function () {
                            _this.viewMode = 'browse';
                        }
                    },
                    {
                        text: 'లాగిన్ చేయండి (Login)',
                        handler: function () {
                            _this.navCtrl.push('LoginPage', { redirect: 'FamilyCouncellingPage' });
                        }
                    }
                ]
            });
            alert.present();
            this.viewMode = 'browse';
            return;
        }
        this.viewMode = tab;
    };

    FamilyCouncellingPage.prototype.gotoUserRegister = function () {
        this.navCtrl.push('EntryFormPage');
    };`;

    if (openBookingRegex.test(f49)) {
        f49 = f49.replace(openBookingRegex, replacement);
        new vm.Script(f49);
        fs.writeFileSync(f49Path, f49, 'utf8');
        console.log(`[SUCCESS] Patched openBookingForm and onTabChange in ${f49Path}`);
    } else {
        console.log(`[WARNING] Pattern not matched in ${f49Path}`);
    }
}
