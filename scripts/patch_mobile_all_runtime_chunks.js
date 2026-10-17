const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appRoot = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const targetDirs = [
    path.join(appRoot, 'www', 'build'),
    path.join(appRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build')
];

for (const buildDir of targetDirs) {
    if (!fs.existsSync(buildDir)) {
        console.log('[SKIP] Directory does not exist:', buildDir);
        continue;
    }
    console.log(`\n======================================================`);
    console.log(`Patching mobile runtime chunks in: ${buildDir}`);
    console.log(`======================================================`);

    // -------------------------------------------------------------
    // 1. PATCH 1.js (HomePage) - Local Banners
    // -------------------------------------------------------------
    const oneJsPath = path.join(buildDir, '1.js');
    if (fs.existsSync(oneJsPath)) {
        let oneJs = fs.readFileSync(oneJsPath, 'utf8');

        // Replace banners array
        const bannerArrayPattern = /this\.banners\s*=\s*\[[\s\S]*?\];/;
        const newBannersBundle = `this.banners = [
            { id: '1', banner: 'assets/images/Banner01.png' },
            { id: '2', banner: 'assets/images/Banner02.png' },
            { id: '3', banner: 'assets/images/Banner03.png' },
            { id: '4', banner: 'assets/images/Banner04.png' },
            { id: '5', banner: 'assets/images/Banner05.png' },
            { id: '6', banner: 'assets/images/Banner06.png' },
            { id: '7', banner: 'assets/images/Banner07.png' },
            { id: '8', banner: 'assets/images/Banner08.png' }
        ];`;

        if (bannerArrayPattern.test(oneJs)) {
            oneJs = oneJs.replace(bannerArrayPattern, newBannersBundle);
            console.log('  [OK] Replaced this.banners array in 1.js with local assets');
        }

        // Global replace any remaining https://jbac.in/baneers/
        oneJs = oneJs.replace(/https:\/\/jbac\.in\/baneers\/Banner0?(\d+)\.png/g, 'assets/images/Banner0$1.png');

        new vm.Script(oneJs);
        fs.writeFileSync(oneJsPath, oneJs, 'utf8');
        console.log('  [OK] 1.js verified and saved');
    }

    // -------------------------------------------------------------
    // 2. PATCH 49.js (FamilyCouncellingPage) - Remove Dummy Doctors, Login Enforcement, Responsive Register
    // -------------------------------------------------------------
    const fortyNinePath = path.join(buildDir, '49.js');
    if (fs.existsSync(fortyNinePath)) {
        let f49 = fs.readFileSync(fortyNinePath, 'utf8');

        // 2a. Replace dummy fallback doctors with empty array
        const dummyDocsPattern = /var\s+fallbackDocs\s*=\s*\[[\s\S]*?\];/;
        if (dummyDocsPattern.test(f49)) {
            f49 = f49.replace(dummyDocsPattern, 'var fallbackDocs = [];');
            console.log('  [OK] Removed dummy test doctors (Samuel, Emmanuel, Sarah, Joseph) from 49.js');
        }

        // 2b. Ensure loadDoctors filters only active non-deleted doctors
        const oldFilterPattern = /_this\.doctors\s*=\s*res\.data;/;
        if (oldFilterPattern.test(f49)) {
            f49 = f49.replace(oldFilterPattern, `_this.doctors = (res.data || []).filter(function(d) { return d.d_in === 0 || d.d_in === '0' || d.d_in === undefined; });`);
            console.log('  [OK] Filtered active doctors (d_in = 0) in 49.js');
        }

        // 2c. Enforce login in openBookingForm
        const oldOpenBooking = `    FamilyCouncellingPage.prototype.openBookingForm = function (doc) {
        this.selectedDoctor = doc;
        this.bookingData.doc_id = doc.id;
        this.clearUserVoiceRecording();
        this.viewMode = 'book_now';
    };`;

        const newOpenBooking = `    FamilyCouncellingPage.prototype.openBookingForm = function (doc) {
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

        if (f49.includes(oldOpenBooking)) {
            f49 = f49.replace(oldOpenBooking, newOpenBooking);
            console.log('  [OK] Enforced login check in openBookingForm() and added onTabChange() in 49.js');
        }

        // 2d. In template of 49.js:
        // Update ion-segment to bind (ionChange)="onTabChange(viewMode)"
        f49 = f49.replace('<ion-segment [(ngModel)]="viewMode" color="primary">', '<ion-segment [(ngModel)]="viewMode" (ionChange)="onTabChange(viewMode)" color="primary">');

        // Update guest top banner
        const oldBannerIn49 = `  <!-- TOP BANNER FOR GUESTS: PROMINENT DOCTOR REGISTER & LOGIN BUTTONS -->
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
      <button ion-button small color="secondary" style="border-radius: 8px; font-weight: bold; margin: 0;" (click)="gotoDoctorRegister()">
        రిజిస్టర్ అవ్వండి
      </button>
    </div>
  </div>`;

        const newBannerIn49 = `  <!-- TOP BANNER FOR GUESTS: RESPONSIVE USER & DOCTOR REGISTER + LOGIN -->
  <div *ngIf="!isLoggedIn && viewMode !== 'book_now'" style="background: linear-gradient(135deg, #f0fdf4, #e0f2fe); border: 1px solid #bbf7d0; margin: 10px; padding: 12px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <div>
        <div style="font-size: 13px; font-weight: bold; color: #166534;">
          🩺 ఫ్యామిలీ కౌన్సిలింగ్ & డాక్టర్ సర్వీసెస్
        </div>
        <div style="font-size: 11px; color: #374151; margin-top: 2px;">
          అపాయింట్‌మెంట్ బుక్ చేయడానికి ముందుగా లాగిన్ లేదా రిజిస్టర్ అవ్వండి
        </div>
      </div>
    </div>
    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
      <button ion-button small tappable color="primary" style="flex: 1; border-radius: 6px; font-weight: bold; margin: 0; min-width: 100px;" (click)="goToLogin()">
        🔑 లాగిన్ (Login)
      </button>
      <button ion-button small tappable color="secondary" style="flex: 1; border-radius: 6px; font-weight: bold; margin: 0; min-width: 110px;" (click)="gotoUserRegister()">
        ✍️ సభ్యుల నమోదు
      </button>
      <button ion-button small tappable outline color="secondary" style="flex: 1; border-radius: 6px; font-weight: bold; margin: 0; min-width: 110px; background: #fff;" (click)="gotoDoctorRegister()">
        👨‍⚕️ డాక్టర్ నమోదు
      </button>
    </div>
  </div>`;

        if (f49.includes(oldBannerIn49)) {
            f49 = f49.replace(oldBannerIn49, newBannerIn49);
            console.log('  [OK] Replaced guest banner in 49.js template with responsive User/Doctor Register + Login');
        }

        // Add tappable to all buttons and segment buttons
        f49 = f49.replace(/<button ion-button (?!.*tappable)/g, '<button ion-button tappable ');
        f49 = f49.replace(/<ion-segment-button (?!.*tappable)/g, '<ion-segment-button tappable ');

        new vm.Script(f49);
        fs.writeFileSync(fortyNinePath, f49, 'utf8');
        console.log('  [OK] 49.js verified and saved');
    }

    // -------------------------------------------------------------
    // 3. PATCH 32.js (EntryFormPage) - Registration Success Message
    // -------------------------------------------------------------
    const thirtyTwoPath = path.join(buildDir, '32.js');
    if (fs.existsSync(thirtyTwoPath)) {
        let f32 = fs.readFileSync(thirtyTwoPath, 'utf8');

        const old32Msg = `message: 'యాప్ ఆక్టివేట్ అయినది, ఫోన్ నెంబర్ పాస్వర్డ్ తో లాగిన్ అవ్వండి',`;
        const new32Msg = `title: 'రిజిస్ట్రేషన్ విజయవంతం! (Registration Successful)',
                                    message: 'registered successfully, you can login with username and password with the same mobile number and if you want to change you can change while login or by clicking forgot password.\\n\\nనమోదు విజయవంతంగా పూర్తయింది. మీరు అదే మొబైల్ నంబరును యూజర్‌నేమ్ మరియు పాస్‌వర్డ్‌గా ఉపయోగించి లాగిన్ అవ్వవచ్చు. పాస్‌వర్డ్ మార్చుకోవాలనుకుంటే లాగిన్ సమయంలో లేదా Forgot Password ద్వారా మార్చుకోవచ్చు.',`;

        if (f32.includes(old32Msg)) {
            f32 = f32.replace(old32Msg, new32Msg);
            new vm.Script(f32);
            fs.writeFileSync(thirtyTwoPath, f32, 'utf8');
            console.log('  [OK] 32.js (EntryFormPage) updated with exact success alert instructions');
        }
    }

    // -------------------------------------------------------------
    // 4. PATCH 31.js (ForgotPasswordPage) - Family Members & Doctor Category
    // -------------------------------------------------------------
    const thirtyOnePath = path.join(buildDir, '31.js');
    if (fs.existsSync(thirtyOnePath)) {
        let f31 = fs.readFileSync(thirtyOnePath, 'utf8');

        // Add familyMembers property and member_id control
        if (!f31.includes('this.familyMembers')) {
            f31 = f31.replace('this.shoepass = false;', 'this.shoepass = false;\n        this.familyMembers = [];');
            f31 = f31.replace("category: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required]],", "category: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__[\"f\" /* Validators */].required]],\n            member_id: [''],");
        }

        // Store members in checknumber callback
        const oldCheckNumberCallback = `if (res.status == 200) {
                    _this.shoepass = true;`;
        const newCheckNumberCallback = `if (res.status == 200) {
                    _this.shoepass = true;
                    _this.familyMembers = res.members || res.data || [];
                    if (_this.familyMembers.length > 0) {
                        _this.passloginform.patchValue({ member_id: _this.familyMembers[0].id });
                    }`;

        if (f31.includes(oldCheckNumberCallback)) {
            f31 = f31.replace(oldCheckNumberCallback, newCheckNumberCallback);
            console.log('  [OK] 31.js updated to store and select familyMembers');
        }

        // In template of 31.js, add Doctor option and member dropdown
        if (!f31.includes('<option value="8">')) {
            f31 = f31.replace('<option value="7">పాస్టర్ల అసోసియేషన్</option>', '<option value="7">పాస్టర్ల అసోసియేషన్</option>\\n        <option value="8">డాక్టర్ / కౌన్సిలర్ (Doctor / Counsellor)</option>');
        }

        const memberSelectIn31 = `\\n    <div *ngIf="shoepass && familyMembers && familyMembers.length > 1">\\n      <h4 class="offer1">కుటుంబ సభ్యుడిని ఎంచుకోండి (Select Family Member)</h4>\\n      <select class="input" formControlName="member_id" style="background:#f0fdf4; border:1.5px solid #16a34a; font-weight:bold;">\\n        <option *ngFor="let m of familyMembers" [value]="m.id">\\n          {{ m.name }} (ID: {{ m.id }})\\n        </option>\\n      </select>\\n      <br><br>\\n    </div>`;

        if (!f31.includes('formControlName=\\"member_id\\"')) {
            f31 = f31.replace('<div *ngIf="shoepass">', '<div *ngIf="shoepass">' + memberSelectIn31);
            console.log('  [OK] Added family member dropdown to 31.js template');
        }

        new vm.Script(f31);
        fs.writeFileSync(thirtyOnePath, f31, 'utf8');
        console.log('  [OK] 31.js verified and saved');
    }
}

console.log('\n=== ALL RUNTIME BUNDLES (WWW & PLATFORMS/ANDROID) PATCHED & SYNTAX VERIFIED! ===\n');
