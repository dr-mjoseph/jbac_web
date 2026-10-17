const fs = require('fs');
const path = require('path');

const appRoot = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';

console.log('=== STARTING MOBILE CODE & CONFIGURATION UPDATES ===');

// -------------------------------------------------------------
// 1. UPDATE config.xml
// -------------------------------------------------------------
const configXmlPath = path.join(appRoot, 'config.xml');
if (fs.existsSync(configXmlPath)) {
    let configXml = fs.readFileSync(configXmlPath, 'utf8');
    configXml = configXml.replace(/version="0\.0\.\d+"/g, 'version="0.0.30"');
    configXml = configXml.replace(/android-versionCode="\d+"/g, 'android-versionCode="30"');
    configXml = configXml.replace(/name="android-targetSdkVersion" value="\d+"/g, 'name="android-targetSdkVersion" value="35"');
    configXml = configXml.replace(/name="android-compileSdkVersion" value="\d+"/g, 'name="android-compileSdkVersion" value="35"');
    fs.writeFileSync(configXmlPath, configXml, 'utf8');
    console.log('[SUCCESS] Updated config.xml -> versionCode 30, targetSdkVersion 35, compileSdkVersion 35');
}

// -------------------------------------------------------------
// 2. UPDATE AndroidManifest.xml
// -------------------------------------------------------------
const manifestPath = path.join(appRoot, 'platforms', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, 'utf8');
    manifest = manifest.replace(/android:versionCode="\d+"/g, 'android:versionCode="30"');
    manifest = manifest.replace(/android:versionName="[^"]+"/g, 'android:versionName="0.0.30"');
    fs.writeFileSync(manifestPath, manifest, 'utf8');
    console.log('[SUCCESS] Updated AndroidManifest.xml -> versionCode 30, versionName 0.0.30');
}

// -------------------------------------------------------------
// 3. UPDATE project.properties
// -------------------------------------------------------------
const propsPath = path.join(appRoot, 'platforms', 'android', 'project.properties');
if (fs.existsSync(propsPath)) {
    let props = fs.readFileSync(propsPath, 'utf8');
    props = props.replace(/target=android-\d+/g, 'target=android-35');
    fs.writeFileSync(propsPath, props, 'utf8');
    console.log('[SUCCESS] Updated project.properties -> target=android-35');
}

// -------------------------------------------------------------
// 4. UPDATE cdv-gradle-config.json
// -------------------------------------------------------------
const cdvConfigPath = path.join(appRoot, 'platforms', 'android', 'cdv-gradle-config.json');
if (fs.existsSync(cdvConfigPath)) {
    let cdv = fs.readFileSync(cdvConfigPath, 'utf8');
    cdv = cdv.replace(/"SDK_VERSION":\s*\d+/g, '"SDK_VERSION": 35');
    fs.writeFileSync(cdvConfigPath, cdv, 'utf8');
    console.log('[SUCCESS] Updated cdv-gradle-config.json -> SDK_VERSION 35');
}

// -------------------------------------------------------------
// 5. UPDATE app/build.gradle & CordovaLib/build.gradle
// -------------------------------------------------------------
const appGradlePath = path.join(appRoot, 'platforms', 'android', 'app', 'build.gradle');
if (fs.existsSync(appGradlePath)) {
    let gradle = fs.readFileSync(appGradlePath, 'utf8');
    gradle = gradle.replace(/targetSdkVersion \d+/g, 'targetSdkVersion 35');
    gradle = gradle.replace(/compileSdkVersion \d+/g, 'compileSdkVersion 35');
    gradle = gradle.replace(/compileSdkVersion cordovaConfig\.SDK_VERSION/g, 'compileSdkVersion 35');
    fs.writeFileSync(appGradlePath, gradle, 'utf8');
    console.log('[SUCCESS] Updated app/build.gradle -> targetSdkVersion 35, compileSdkVersion 35');
}

const libGradlePath = path.join(appRoot, 'platforms', 'android', 'CordovaLib', 'build.gradle');
if (fs.existsSync(libGradlePath)) {
    let libGradle = fs.readFileSync(libGradlePath, 'utf8');
    libGradle = libGradle.replace(/compileSdkVersion cordovaConfig\.SDK_VERSION/g, 'compileSdkVersion 35');
    libGradle = libGradle.replace(/compileSdkVersion \d+/g, 'compileSdkVersion 35');
    fs.writeFileSync(libGradlePath, libGradle, 'utf8');
    console.log('[SUCCESS] Updated CordovaLib/build.gradle -> compileSdkVersion 35');
}

// -------------------------------------------------------------
// 6. UPDATE entry-form.ts SUCCESS ALERT
// -------------------------------------------------------------
const entryTsPath = path.join(appRoot, 'src', 'pages', 'entry-form', 'entry-form.ts');
if (fs.existsSync(entryTsPath)) {
    let entryTs = fs.readFileSync(entryTsPath, 'utf8');
    const oldMsgTarget = `message: 'యాప్ ఆక్టివేట్ అయినది, ఫోన్ నెంబర్ పాస్వర్డ్ తో లాగిన్ అవ్వండి',`;
    const newMsg = `title: 'రిజిస్ట్రేషన్ విజయవంతం! (Registration Successful)',
            message: 'registered successfully, you can login with username and password with the same mobile number and if you want to change you can change while login or by clicking forgot password.\\n\\nనమోదు విజయవంతంగా పూర్తయింది. మీరు అదే మొబైల్ నంబరును యూజర్‌నేమ్ మరియు పాస్‌వర్డ్‌గా ఉపయోగించి లాగిన్ అవ్వవచ్చు. పాస్‌వర్డ్ మార్చుకోవాలనుకుంటే లాగిన్ సమయంలో లేదా Forgot Password ద్వారా మార్చుకోవచ్చు.',`;
    
    if (entryTs.includes(oldMsgTarget)) {
        entryTs = entryTs.replace(oldMsgTarget, newMsg);
        fs.writeFileSync(entryTsPath, entryTs, 'utf8');
        console.log('[SUCCESS] Updated entry-form.ts success alert with exact requested instructions');
    } else {
        console.log('[INFO] Checking alternative pattern in entry-form.ts');
    }
}

// -------------------------------------------------------------
// 7. UPDATE family-councelling.ts
// -------------------------------------------------------------
const fcTsPath = path.join(appRoot, 'src', 'pages', 'family-councelling', 'family-councelling.ts');
if (fs.existsSync(fcTsPath)) {
    let fcTs = fs.readFileSync(fcTsPath, 'utf8');

    // 7a. Remove fallback test doctors
    const fallbackStart = fcTs.indexOf('getFallbackDoctors() {');
    if (fallbackStart !== -1) {
        const fallbackEnd = fcTs.indexOf('loadDoctors()', fallbackStart);
        if (fallbackEnd !== -1) {
            const cleanFallback = `getFallbackDoctors() {
    return [];
  }

  `;
            fcTs = fcTs.slice(0, fallbackStart) + cleanFallback + fcTs.slice(fallbackEnd);
            console.log('[SUCCESS] Removed test dummy doctors from getFallbackDoctors()');
        }
    }

    // 7b. Update loadDoctors to only take active real doctors
    const loadDocOld = `this.doctors = (res.data && res.data.length > 0) ? res.data : this.getFallbackDoctors();`;
    const loadDocNew = `this.doctors = (res.data && res.data.length > 0) ? res.data.filter((d: any) => d.d_in === 0 || d.d_in === '0' || d.d_in === undefined) : [];`;
    if (fcTs.includes(loadDocOld)) {
        fcTs = fcTs.replace(loadDocOld, loadDocNew);
        console.log('[SUCCESS] Updated loadDoctors() to filter only active doctors');
    }

    // 7c. Enforce login in openBookingForm
    const openBookingOld = `openBookingForm(doc: any) {
    this.selectedDoctor = doc;
    this.bookingData.doc_id = doc.id;
    this.clearUserVoiceRecording();
    this.viewMode = 'book_now';
  }`;

    const openBookingNew = `openBookingForm(doc: any) {
    if (!this.isLoggedIn) {
      const alert = this.alertCtrl.create({
        mode: 'ios',
        title: 'లాగిన్ అవసరం (Login Required)',
        message: 'డాక్టర్ అపాయింట్‌మెంట్ బుక్ చేయడానికి ముందుగా దయచేసి లాగిన్ అవ్వండి.\\n(Please login first to book an appointment.)',
        buttons: [
          {
            text: 'రద్దు (Cancel)',
            role: 'cancel'
          },
          {
            text: 'రిజిస్టర్ (Register)',
            handler: () => {
              this.gotoUserRegister();
            }
          },
          {
            text: 'లాగిన్ (Login)',
            handler: () => {
              this.goToLogin();
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
  }`;

    if (fcTs.includes(openBookingOld)) {
        fcTs = fcTs.replace(openBookingOld, openBookingNew);
        console.log('[SUCCESS] Enforced login check in openBookingForm()');
    }

    // 7d. Add onTabChange to enforce login for private tabs
    if (!fcTs.includes('onTabChange(')) {
        const insertAfterCheckSpeech = `  checkSpeechSupport() {
    const SpeechRec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.isSpeechSupported = !!SpeechRec;
  }

  onTabChange(tab: string) {
    if ((tab === 'my_bookings' || tab === 'doctor_profile' || tab === 'doctor_schedule') && !this.isLoggedIn) {
      const alert = this.alertCtrl.create({
        mode: 'ios',
        title: 'లాగిన్ అవసరం (Login Required)',
        message: 'మీ అపాయింట్‌మెంట్లు లేదా ప్రొఫైల్ చూడటానికి దయచేసి లాగిన్ అవ్వండి.\\n(Please login first to view bookings or dashboard.)',
        buttons: [
          {
            text: 'రద్దు (Cancel)',
            role: 'cancel',
            handler: () => {
              this.viewMode = 'browse';
            }
          },
          {
            text: 'లాగిన్ చేయండి (Login)',
            handler: () => {
              this.goToLogin();
            }
          }
        ]
      });
      alert.present();
      this.viewMode = 'browse';
      return;
    }
    this.viewMode = tab;
  }

  gotoUserRegister() {
    this.navCtrl.push('EntryFormPage');
  }`;

        fcTs = fcTs.replace(`  checkSpeechSupport() {
    const SpeechRec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.isSpeechSupported = !!SpeechRec;
  }`, insertAfterCheckSpeech);
        console.log('[SUCCESS] Added onTabChange() and gotoUserRegister() in family-councelling.ts');
    }

    fs.writeFileSync(fcTsPath, fcTs, 'utf8');
}

// -------------------------------------------------------------
// 8. UPDATE family-councelling.html
// -------------------------------------------------------------
const fcHtmlPath = path.join(appRoot, 'src', 'pages', 'family-councelling', 'family-councelling.html');
if (fs.existsSync(fcHtmlPath)) {
    let fcHtml = fs.readFileSync(fcHtmlPath, 'utf8');

    // Update segment to bind onTabChange
    fcHtml = fcHtml.replace('<ion-segment [(ngModel)]="viewMode" color="primary">', '<ion-segment [(ngModel)]="viewMode" (ionChange)="onTabChange(viewMode)" color="primary">');

    // Replace guest banner with responsive User Registration & Doctor Registration & Login buttons with tappable
    const oldBanner = `  <!-- TOP BANNER FOR GUESTS: PROMINENT DOCTOR REGISTER & LOGIN BUTTONS -->
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

    const newBanner = `  <!-- TOP BANNER FOR GUESTS: RESPONSIVE USER & DOCTOR REGISTER + LOGIN -->
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

    if (fcHtml.includes(oldBanner)) {
        fcHtml = fcHtml.replace(oldBanner, newBanner);
        console.log('[SUCCESS] Replaced guest banner with responsive User/Doctor Register & Login buttons in family-councelling.html');
    }

    // Add tappable to all buttons inside family-councelling.html
    fcHtml = fcHtml.replace(/<button ion-button (?!.*tappable)/g, '<button ion-button tappable ');
    fcHtml = fcHtml.replace(/<ion-segment-button (?!.*tappable)/g, '<ion-segment-button tappable ');

    fs.writeFileSync(fcHtmlPath, fcHtml, 'utf8');
}

// -------------------------------------------------------------
// 9. UPDATE forgot-password.ts & forgot-password.html
// -------------------------------------------------------------
const fpTsPath = path.join(appRoot, 'src', 'pages', 'forgot-password', 'forgot-password.ts');
if (fs.existsSync(fpTsPath)) {
    let fpTs = fs.readFileSync(fpTsPath, 'utf8');

    // Add familyMembers: any[] = [] and member_id control
    if (!fpTs.includes('familyMembers: any[]')) {
        fpTs = fpTs.replace("shoepass: boolean = false", "shoepass: boolean = false;\n  familyMembers: any[] = [];");
        fpTs = fpTs.replace("category: ['', [Validators.required]],", "category: ['', [Validators.required]],\n      member_id: [''],");
    }

    // In checknumber(), capture res.members
    const checkNumOld = `this.service.checknumberpassword(this.passloginform.value).subscribe((res: any) => {
        if (res.status == 200) {
          this.shoepass = true;`;

    const checkNumNew = `this.service.checknumberpassword(this.passloginform.value).subscribe((res: any) => {
        if (res.status == 200) {
          this.shoepass = true;
          this.familyMembers = res.members || res.data || [];
          if (this.familyMembers.length > 0) {
            this.passloginform.patchValue({ member_id: this.familyMembers[0].id });
          }`;

    if (fpTs.includes(checkNumOld)) {
        fpTs = fpTs.replace(checkNumOld, checkNumNew);
        console.log('[SUCCESS] Updated checknumber() in forgot-password.ts to handle familyMembers');
    }

    // Also handle category 8 (Doctor)
    if (!fpTs.includes("this.category = 'డాక్టర్ / కౌన్సిలర్'")) {
        fpTs = fpTs.replace("this.category = 'పాస్టర్ల అసోసియేషన్';", "this.category = 'పాస్టర్ల అసోసియేషన్';\n      } else if (this.passloginform.value.category == 8) {\n        this.category = 'డాక్టర్ / కౌన్సిలర్';");
    }

    fs.writeFileSync(fpTsPath, fpTs, 'utf8');
}

const fpHtmlPath = path.join(appRoot, 'src', 'pages', 'forgot-password', 'forgot-password.html');
if (fs.existsSync(fpHtmlPath)) {
    let fpHtml = fs.readFileSync(fpHtmlPath, 'utf8');

    // Add category 8 option
    if (!fpHtml.includes('<option value="8">')) {
        fpHtml = fpHtml.replace('<option value="7">పాస్టర్ల అసోసియేషన్</option>', '<option value="7">పాస్టర్ల అసోసియేషన్</option>\n        <option value="8">డాక్టర్ / కౌన్సిలర్ (Doctor / Counsellor)</option>');
    }

    // Add family member selection dropdown when shoepass is true
    const memberSelectHtml = `    <div *ngIf="shoepass && familyMembers && familyMembers.length > 1">
      <h4 class="offer1">కుటుంబ సభ్యుడిని ఎంచుకోండి (Select Family Member)</h4>
      <select class="input" formControlName="member_id" style="background:#f0fdf4; border:1.5px solid #16a34a; font-weight:bold;">
        <option *ngFor="let m of familyMembers" [value]="m.id">
          {{ m.name }} (ID: {{ m.id }})
        </option>
      </select>
      <br><br>
    </div>`;

    if (!fpHtml.includes('formControlName="member_id"')) {
        fpHtml = fpHtml.replace('<div *ngIf="shoepass">', '<div *ngIf="shoepass">\n' + memberSelectHtml);
        console.log('[SUCCESS] Added family member selection dropdown to forgot-password.html');
    }

    fs.writeFileSync(fpHtmlPath, fpHtml, 'utf8');
}

// -------------------------------------------------------------
// 10. UPDATE login.ts
// -------------------------------------------------------------
const loginTsPath = path.join(appRoot, 'src', 'pages', 'login', 'login.ts');
if (fs.existsSync(loginTsPath)) {
    let loginTs = fs.readFileSync(loginTsPath, 'utf8');

    // Support redirect to FamilyCouncellingPage on success
    const navRootOld = `this.navCtrl.setRoot(HomePage);`;
    const navRootNew = `const redirect = this.navParams.get('redirect');
          if (redirect === 'FamilyCouncellingPage' || redirect === 'family-councelling') {
            this.navCtrl.setRoot('FamilyCouncellingPage');
          } else {
            this.navCtrl.setRoot(HomePage);
          }`;

    if (loginTs.includes(navRootOld) && !loginTs.includes('redirect === \'FamilyCouncellingPage\'')) {
        loginTs = loginTs.replace(navRootOld, navRootNew);
        console.log('[SUCCESS] Updated login.ts to handle returnUrl/redirect navigation');
    }

    fs.writeFileSync(loginTsPath, loginTs, 'utf8');
}

console.log('=== ALL MOBILE CODE & CONFIGURATION UPDATES COMPLETED SUCCESSFULLY ===');
