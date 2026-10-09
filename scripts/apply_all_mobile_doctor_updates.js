const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
console.log('>>> Applying Complete Doctor Portal & Registration Updates to Mobile App at:', mobilePath);

if (!fs.existsSync(mobilePath)) {
  console.error('[ERROR] Mobile path does not exist:', mobilePath);
  process.exit(1);
}

// ============================================================================
// 1. Update src/providers/service/service.ts (Add registercouncellingdoctor)
// ============================================================================
const serviceTsPath = path.join(mobilePath, 'src', 'providers', 'service', 'service.ts');
if (fs.existsSync(serviceTsPath)) {
  let serviceContent = fs.readFileSync(serviceTsPath, 'utf8');
  if (!serviceContent.includes('registercouncellingdoctor')) {
    const registerMethod = `
  registercouncellingdoctor(data: any) {
    return this.http.post(this.testApi + 'registerdoctor', data);
  }
`;
    // Add before the last closing brace
    const lastBrace = serviceContent.lastIndexOf('}');
    if (lastBrace !== -1) {
      serviceContent = serviceContent.substring(0, lastBrace) + registerMethod + '\n}\n';
      fs.writeFileSync(serviceTsPath, serviceContent, 'utf8');
      console.log('[OK] Added registercouncellingdoctor to mobile service.ts');
    }
  } else {
    console.log('[INFO] registercouncellingdoctor already in mobile service.ts');
  }
}

// ============================================================================
// 2. Create src/pages/doctorregister/ in jbac_app
// ============================================================================
const docRegDir = path.join(mobilePath, 'src', 'pages', 'doctorregister');
if (!fs.existsSync(docRegDir)) {
  fs.mkdirSync(docRegDir, { recursive: true });
}

// 2.1 doctorregister.module.ts
const docRegModule = `import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoctorregisterPage } from './doctorregister';

@NgModule({
  declarations: [
    DoctorregisterPage,
  ],
  imports: [
    IonicPageModule.forChild(DoctorregisterPage),
  ],
})
export class DoctorregisterPageModule {}
`;
fs.writeFileSync(path.join(docRegDir, 'doctorregister.module.ts'), docRegModule, 'utf8');

// 2.2 doctorregister.scss
const docRegScss = `page-doctorregister {
  .pagecss {
    background-color: #f1f5f9;
  }
  .form-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    margin: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }
  .header-box {
    text-align: center;
    padding: 16px 12px 10px 12px;
    background: linear-gradient(135deg, #00548F, #00365c);
    color: white;
    border-radius: 12px;
    margin-bottom: 16px;
  }
  .custom-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 10px;
    padding-left: 8px;
  }
  .custom-item ion-label {
    font-size: 13px !important;
    font-weight: bold;
    color: #475569;
  }
  .custom-item ion-input,
  .custom-item ion-select,
  .custom-item ion-textarea {
    font-size: 14px;
    color: #0f172a;
  }
}
`;
fs.writeFileSync(path.join(docRegDir, 'doctorregister.scss'), docRegScss, 'utf8');

// 2.3 doctorregister.html
const docRegHtml = `<ion-header>
  <ion-navbar color="primary">
    <ion-title style="text-align: center; font-size: 16px;">
      <b>డాక్టర్ రిజిస్ట్రేషన్ (Doctor Register)</b>
    </ion-title>
    <ion-buttons end>
      <button ion-button icon-only (click)="gotohome()">
        <ion-icon name="home"></ion-icon>
      </button>
    </ion-buttons>
  </ion-navbar>
</ion-header>

<ion-content class="pagecss">
  <div class="form-card">
    <div class="header-box">
      <div style="font-size: 32px; margin-bottom: 6px;">🩺</div>
      <h3 style="margin: 0; font-size: 17px; font-weight: bold;">క్రైస్తవ వైద్యులు & కౌన్సిలర్ల నమోదు</h3>
      <p style="margin: 4px 0 0 0; font-size: 11.5px; opacity: 0.9;">
        JBAC ఫ్యామిలీ కౌన్సిలింగ్ నెట్‌వర్క్‌లో చేరి క్రైస్తవ కుటుంబాలకు సహాయపడండి
      </p>
    </div>

    <form [formGroup]="doctorForm" (ngSubmit)="submitDoctor()">
      <ion-item class="custom-item">
        <ion-label floating>డాక్టర్ పూర్తి పేరు (Doctor Full Name) *</ion-label>
        <ion-input type="text" formControlName="doctor_name" placeholder="ఉదా: Dr. Mary Grace, M.D."></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>మెడికల్ కౌన్సిల్ లైసెన్స్ నంబర్ (License No) *</ion-label>
        <ion-input type="text" formControlName="license_number" placeholder="ఉదా: APMC-2015-88421"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>స్పెషలైజేషన్ (Specialization) *</ion-label>
        <ion-select formControlName="specialization">
          <ion-option value="Family Counsellor & Clinical Psychologist">Family Counsellor & Clinical Psychologist</ion-option>
          <ion-option value="Marriage & Relationship Counsellor">Marriage & Relationship Counsellor</ion-option>
          <ion-option value="Youth & Family Mental Wellness Counsellor">Youth & Family Mental Wellness Counsellor</ion-option>
          <ion-option value="Parent-Child Dynamics Specialist">Parent-Child Dynamics Specialist</ion-option>
          <ion-option value="Christian Spiritual & Emotional Healing">Christian Spiritual & Emotional Healing</ion-option>
          <ion-option value="Addiction & Behavioral Therapy">Addiction & Behavioral Therapy</ion-option>
          <ion-option value="General Family Physician & Counsellor">General Family Physician & Counsellor</ion-option>
        </ion-select>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>విద్యార్హతలు (Qualifications) *</ion-label>
        <ion-input type="text" formControlName="qualification" placeholder="ఉదా: MBBS, M.D., M.Sc Psychology"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>అనుభవం (Years of Experience) *</ion-label>
        <ion-input type="text" formControlName="experience_years" placeholder="ఉదా: 8 Years"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>10 అంకెల మొబైల్ నంబర్ (Mobile Number) *</ion-label>
        <ion-input type="tel" maxlength="10" formControlName="phone_number" placeholder="10-digit mobile"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>ఈమెయిల్ (Email Address)</ion-label>
        <ion-input type="email" formControlName="email" placeholder="doctor@jbac.in"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>పాస్‌వర్డ్ (Password - కనీసం 6 అక్షరాలు) *</ion-label>
        <ion-input type="password" maxlength="16" formControlName="password" placeholder="లాగిన్ పాస్‌వర్డ్"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>కన్సల్టేషన్ ఫీజు (Consultation Fee)</ion-label>
        <ion-input type="text" formControlName="consultation_fee" placeholder="Free / Volunteer Service"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>అందుబాటులో ఉండే రోజులు (Available Days) *</ion-label>
        <ion-input type="text" formControlName="available_days" placeholder="Monday to Saturday"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>ప్రారంభ సమయం (Start Time) *</ion-label>
        <ion-input type="text" formControlName="available_time_start" placeholder="10:00 AM"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>ముగింపు సమయం (End Time) *</ion-label>
        <ion-input type="text" formControlName="available_time_end" placeholder="05:00 PM"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>ప్రాంతం & కౌన్సిలింగ్ విధానం (Location) *</ion-label>
        <ion-input type="text" formControlName="location" placeholder="ఉదా: Vijayawada & Online"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>పూర్తి క్లినిక్ / చర్చి చిరునామా (Address) *</ion-label>
        <ion-input type="text" formControlName="address" placeholder="క్లినిక్ లేదా ఆసుపత్రి చిరునామా"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>డాక్టర్ గురించిన సంక్షిప్త వివరణ (Bio) *</ion-label>
        <ion-textarea rows="3" formControlName="bio" placeholder="మీ అనుభవం, కౌన్సిలింగ్ పద్ధతులు మరియు సేవా సంకల్పం..."></ion-textarea>
      </ion-item>

      <div style="margin-top: 16px;">
        <button ion-button block color="primary" type="submit" [disabled]="showSpinner" style="border-radius: 8px; font-weight: bold; height: 44px;">
          <ion-spinner *ngIf="showSpinner" name="crescent" style="margin-right: 8px;"></ion-spinner>
          డాక్టర్ రిజిస్ట్రేషన్ పూర్తి చేయండి (Submit)
        </button>
      </div>

      <div style="text-align: center; margin-top: 14px;">
        <span style="font-size: 13px; color: #64748b;">ఇప్పటికే అకౌంట్ ఉందా?</span>
        <button ion-button clear small color="primary" type="button" (click)="goToLogin()">
          <b>ఇక్కడ లాగిన్ అవ్వండి (Login)</b>
        </button>
      </div>
    </form>
  </div>
</ion-content>
`;
fs.writeFileSync(path.join(docRegDir, 'doctorregister.html'), docRegHtml, 'utf8');

// 2.4 doctorregister.ts
const docRegTs = `import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-doctorregister',
  templateUrl: 'doctorregister.html',
})
export class DoctorregisterPage {
  doctorForm: FormGroup;
  showSpinner: boolean = false;

  constructor(
    public navCtrl: NavController,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public service: ServiceProvider
  ) {
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

  gotohome() {
    this.navCtrl.setRoot('HomePage');
  }

  goToLogin() {
    this.navCtrl.push('LoginPage');
  }

  submitDoctor() {
    if (this.doctorForm.invalid) {
      const alert = this.alertCtrl.create({
        title: 'వివరాలు అసంపూర్ణం',
        subTitle: 'దయచేసి పేరు, లైసెన్స్ నంబర్, మొబైల్ నంబర్ మరియు పాస్‌వర్డ్ మొదలైన తప్పనిసరి వివరాలను పూరించండి.',
        buttons: ['Ok']
      });
      alert.present();
      return;
    }

    this.showSpinner = true;
    const payload = Object.assign({}, this.doctorForm.value, {
      category_id: 8,
      category: 'Doctor'
    });

    this.service.registercouncellingdoctor(payload).subscribe(
      (res: any) => {
        this.showSpinner = false;
        if (res && res.status === 200) {
          const alert = this.alertCtrl.create({
            title: 'రిజిస్ట్రేషన్ విజయవంతమైంది! 🎉',
            subTitle: 'స్వాగతం, ' + payload.doctor_name + '! మీరు ఇప్పుడు మీ మొబైల్ నంబర్ ' + payload.phone_number + ' తో లాగిన్ అయి మీ అపాయింట్‌మెంట్స్ చూడవచ్చు.',
            buttons: [{
              text: 'లాగిన్ అవ్వండి (Login)',
              handler: () => {
                this.navCtrl.setRoot('LoginPage');
              }
            }]
          });
          alert.present();
        } else if (res && res.status === 300) {
          const alert = this.alertCtrl.create({
            title: 'మొబైల్ నంబర్ ఇప్పటికే ఉంది',
            subTitle: res.message || 'ఈ మొబైల్ నంబర్‌తో ఇప్పటికే డాక్టర్ అకౌంట్ ఉంది. దయచేసి నేరుగా లాగిన్ అవ్వండి.',
            buttons: [{
              text: 'లాగిన్ పేజీకి వెళ్లండి',
              handler: () => {
                this.navCtrl.setRoot('LoginPage');
              }
            }]
          });
          alert.present();
        } else {
          const alert = this.alertCtrl.create({
            title: 'లోపం సంభవించింది',
            subTitle: res?.message || 'రిజిస్ట్రేషన్ పూర్తి కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
            buttons: ['Ok']
          });
          alert.present();
        }
      },
      err => {
        this.showSpinner = false;
        const alert = this.alertCtrl.create({
          title: 'సర్వర్ సమస్య',
          subTitle: 'నెట్‌వర్క్ లోపం సంభవించింది. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ను పరిశీలించి మళ్లీ ప్రయత్నించండి.',
          buttons: ['Ok']
        });
        alert.present();
      }
    );
  }
}
`;
fs.writeFileSync(path.join(docRegDir, 'doctorregister.ts'), docRegTs, 'utf8');
console.log('[OK] Created mobile DoctorregisterPage files in src/pages/doctorregister/');

// ============================================================================
// 3. Update src/pages/forms/forms.html and forms.ts (Add Doctor Register Card)
// ============================================================================
const formsHtmlPath = path.join(mobilePath, 'src', 'pages', 'forms', 'forms.html');
if (fs.existsSync(formsHtmlPath)) {
  let fHtml = fs.readFileSync(formsHtmlPath, 'utf8');
  if (!fHtml.includes('gotopage(8)')) {
    const docCard = `  <ion-card class="hesd" (click)="gotopage(8)" style="border-left: 5px solid #00548F; background: linear-gradient(135deg, #e0f2fe, #ffffff);">
    <ion-card-header style="color: #00548F; font-weight: bold;">
      🩺 డాక్టర్ / కౌన్సిలర్ రిజిస్టర్ (Doctor Register)
    </ion-card-header>
  </ion-card>
</ion-content>`;
    fHtml = fHtml.replace('</ion-content>', docCard);
    fs.writeFileSync(formsHtmlPath, fHtml, 'utf8');
    console.log('[OK] Added Doctor Register option to mobile forms.html');
  }
}

const formsTsPath = path.join(mobilePath, 'src', 'pages', 'forms', 'forms.ts');
if (fs.existsSync(formsTsPath)) {
  let fTs = fs.readFileSync(formsTsPath, 'utf8');
  if (!fTs.includes("this.navCtrl.push('DoctorregisterPage')")) {
    fTs = fTs.replace(
      "this.navCtrl.push('AssociationPage');",
      "this.navCtrl.push('AssociationPage');\n    } else if (id == 8) {\n      this.navCtrl.push('DoctorregisterPage');"
    );
    fs.writeFileSync(formsTsPath, fTs, 'utf8');
    console.log('[OK] Added DoctorregisterPage routing to mobile forms.ts');
  }
}

// ============================================================================
// 4. Update src/pages/login/login.html and login.ts (Category 8 Doctor Support)
// ============================================================================
const loginHtmlPath = path.join(mobilePath, 'src', 'pages', 'login', 'login.html');
if (fs.existsSync(loginHtmlPath)) {
  let lHtml = fs.readFileSync(loginHtmlPath, 'utf8');
  if (!lHtml.includes('value="8"')) {
    lHtml = lHtml.replace(
      '<option value="6">క్రిస్టియన్ ఆర్గనైజెషన్ / కంపెనీ</option>',
      '<option value="6">క్రిస్టియన్ ఆర్గనైజెషన్ / కంపెనీ</option>\n          <option value="8">డాక్టర్ / కౌన్సిలర్ (Doctor / Counsellor)</option>'
    );
    fs.writeFileSync(loginHtmlPath, lHtml, 'utf8');
    console.log('[OK] Added Category 8 (Doctor) to mobile login.html select options');
  }
}

const loginTsPath = path.join(mobilePath, 'src', 'pages', 'login', 'login.ts');
if (fs.existsSync(loginTsPath)) {
  let lTs = fs.readFileSync(loginTsPath, 'utf8');
  if (!lTs.includes("category == 8")) {
    const targetMatch = "localStorage.setItem('category', 'Pastors Association ');\r\n          }";
    const targetMatchUnix = "localStorage.setItem('category', 'Pastors Association ');\n          }";
    const addition = "localStorage.setItem('category', 'Pastors Association ');\n          } else if (this.passloginform.value.category == 8) {\n            localStorage.setItem('category', 'Doctor');\n            localStorage.setItem('is_doctor', '1');\n          }";
    
    if (lTs.includes(targetMatch)) {
      lTs = lTs.replace(targetMatch, addition);
    } else if (lTs.includes(targetMatchUnix)) {
      lTs = lTs.replace(targetMatchUnix, addition);
    } else {
      // Regex replace
      lTs = lTs.replace(/localStorage\.setItem\('category',\s*'Pastors Association '\);\s*\}/, addition);
    }
    fs.writeFileSync(loginTsPath, lTs, 'utf8');
    console.log('[OK] Added Category 8 storage handling to mobile login.ts');
  }
}

// ============================================================================
// 5. Update src/pages/family-councelling/family-councelling.html
//    (Exclusively restrict doctor profile & schedule to doctors/admins)
// ============================================================================
const fcHtmlPath = path.join(mobilePath, 'src', 'pages', 'family-councelling', 'family-councelling.html');
if (fs.existsSync(fcHtmlPath)) {
  let fcHtml = fs.readFileSync(fcHtmlPath, 'utf8');

  // Ensure segment buttons for doctor_profile and doctor_schedule have *ngIf="isDoctor || isAdmin"
  fcHtml = fcHtml.replace(
    /<ion-segment-button value="doctor_profile">[\s\S]*?<\/ion-segment-button>/,
    `<ion-segment-button value="doctor_profile" *ngIf="isDoctor || isAdmin">\n        డాక్టర్ ప్రొఫైల్\n      </ion-segment-button>`
  );

  // Guard Tab 3 container with && (isDoctor || isAdmin)
  fcHtml = fcHtml.replace(
    /\*ngIf="viewMode === 'doctor_profile'"/,
    `*ngIf="viewMode === 'doctor_profile' && (isDoctor || isAdmin)"`
  );

  // Add prominent Doctor Workspace Banner when isDoctor || isAdmin is true at top of content
  if (!fcHtml.includes('doctor-workspace-mobile-banner')) {
    const doctorWorkspaceBanner = `
  <!-- DOCTOR WORKSPACE QUICK ACTION BANNER (Exclusively for Registered Doctors & Admins) -->
  <div *ngIf="isDoctor || isAdmin" class="doctor-workspace-mobile-banner" style="background: linear-gradient(135deg, #00548F, #00365c); color: white; margin: 10px; padding: 12px 14px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,84,143,0.25);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
      <span style="font-size: 13px; font-weight: bold; color: #ffeb3b;">
        🩺 డాక్టర్ కార్యస్థలం (Doctor Workspace)
      </span>
      <span style="background: rgba(255,255,255,0.2); font-size: 10px; padding: 2px 6px; border-radius: 6px;">
        DOCTOR PORTAL
      </span>
    </div>
    <p style="margin: 0 0 10px 0; font-size: 11.5px; opacity: 0.9; line-height: 1.4;">
      మీ ప్రొఫైల్ సెటప్ చేసుకోవచ్చు & మీ రోగుల అపాయింట్‌మెంట్లను ఇక్కడ సులభంగా పరిశీలించవచ్చు.
    </p>
    <div style="display: flex; gap: 8px;">
      <button ion-button small style="background-color: #10b981; font-weight: bold; margin: 0; flex: 1; border-radius: 6px;" (click)="viewMode = 'doctor_schedule'">
        అపాయింట్‌మెంట్లు ({{ appointments.length }})
      </button>
      <button ion-button small outline style="border-color: white; color: white; font-weight: bold; margin: 0; flex: 1; border-radius: 6px;" (click)="viewMode = 'doctor_profile'">
        ప్రొఫైల్ సెట్టింగ్
      </button>
    </div>
  </div>

  <!-- DOCTOR REGISTRATION CTA FOR NON-DOCTORS -->
  <div *ngIf="!isDoctor && !isAdmin" style="background: #f0fdf4; border: 1px solid #86efac; margin: 10px; padding: 10px 12px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <div style="font-size: 12px; font-weight: bold; color: #166534;">మీరు డాక్టరా లేదా కౌన్సిలరా?</div>
      <div style="font-size: 11px; color: #15803d;">నెట్‌వర్క్‌లో చేరడానికి ఇక్కడ నమోదు అవ్వండి</div>
    </div>
    <button ion-button small outline color="secondary" style="margin: 0; border-radius: 6px; font-weight: bold;" (click)="gotoDoctorRegister()">
      డాక్టర్ రిజిస్టర్
    </button>
  </div>
`;
    fcHtml = fcHtml.replace('<ion-content class="pagecss">', '<ion-content class="pagecss">' + doctorWorkspaceBanner);
  }

  fs.writeFileSync(fcHtmlPath, fcHtml, 'utf8');
  console.log('[OK] Updated mobile family-councelling.html with strict doctor isolation and workspace banner');
}

// ============================================================================
// 6. Update src/pages/family-councelling/family-councelling.ts
//    (Role detection, doctor isolation, gotoDoctorRegister)
// ============================================================================
const fcTsPath = path.join(mobilePath, 'src', 'pages', 'family-councelling', 'family-councelling.ts');
if (fs.existsSync(fcTsPath)) {
  let fcTs = fs.readFileSync(fcTsPath, 'utf8');

  // Enhance role detection in ionViewWillEnter
  if (!fcTs.includes("categoryId === '8'")) {
    const roleDetectionTarget = "if (this.role === 'admin' || aortId === '1' || aortId === '2') {\r\n      this.isAdmin = true;\r\n    }";
    const roleDetectionTargetUnix = "if (this.role === 'admin' || aortId === '1' || aortId === '2') {\n      this.isAdmin = true;\n    }";
    const roleDetectionReplacement = `const categoryId = localStorage.getItem('category_id');
    const isDoctorStorage = localStorage.getItem('is_doctor');
    const category = (localStorage.getItem('category') || '').toLowerCase();

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
    }`;

    if (fcTs.includes(roleDetectionTarget)) {
      fcTs = fcTs.replace(roleDetectionTarget, roleDetectionReplacement);
    } else if (fcTs.includes(roleDetectionTargetUnix)) {
      fcTs = fcTs.replace(roleDetectionTargetUnix, roleDetectionReplacement);
    } else {
      fcTs = fcTs.replace(/if\s*\(this\.role\s*===\s*'admin'[\s\S]*?this\.isAdmin\s*=\s*true;\s*\}/, roleDetectionReplacement);
    }
  }

  // Add gotoDoctorRegister method if missing
  if (!fcTs.includes('gotoDoctorRegister')) {
    const methodToAdd = `
  gotoDoctorRegister() {
    this.navCtrl.push('DoctorregisterPage');
  }
`;
    const lastBrace = fcTs.lastIndexOf('}');
    if (lastBrace !== -1) {
      fcTs = fcTs.substring(0, lastBrace) + methodToAdd + '\n}\n';
    }
  }

  fs.writeFileSync(fcTsPath, fcTs, 'utf8');
  console.log('[OK] Updated mobile family-councelling.ts with doctor detection and route guards');
}

// ============================================================================
// 7. Update src/pages/home/home.html
//    (Conform gotopage(19) to default icon system, clean border)
// ============================================================================
const homeHtmlPath = path.join(mobilePath, 'src', 'pages', 'home', 'home.html');
if (fs.existsSync(homeHtmlPath)) {
  let hHtml = fs.readFileSync(homeHtmlPath, 'utf8');

  // Remove custom border and ensure clean default icon system:
  // <ion-col col-3 class="made" (click)="gotopage(19)">
  //   <img style="padding:3%;width:100%" src="assets/icon/svg/couple.svg" onerror="this.onerror=null;this.src='assets/icon/svg/helping-hand.svg';">
  //   <b> ఫ్యామిలీ<br>కౌన్సిలింగ్ </b>
  // </ion-col>
  const targetOldColRegex = /<ion-col col-3 class="made" \(click\)="gotopage\(19\)"[^>]*>[\s\S]*?<\/ion-col>/;
  const newCol = `<ion-col col-3 class="made" (click)="gotopage(19)">
      <img style="padding:3%;width:100%" src="assets/icon/svg/couple.svg" onerror="this.onerror=null;this.src='assets/icon/svg/helping-hand.svg';">
      <b> ఫ్యామిలీ<br>కౌన్సిలింగ్ </b>
    </ion-col>`;

  if (targetOldColRegex.test(hHtml)) {
    hHtml = hHtml.replace(targetOldColRegex, newCol);
    fs.writeFileSync(homeHtmlPath, hHtml, 'utf8');
    console.log('[OK] Conformed Family Counselling tile in mobile home.html to default icon system');
  }
}

// ============================================================================
// 8. Ensure couple.svg is in all asset paths
// ============================================================================
const srcSvgDir = path.join(mobilePath, 'src', 'assets', 'icon', 'svg');
const wwwSvgDir = path.join(mobilePath, 'www', 'assets', 'icon', 'svg');
const androidSvgDir = path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'assets', 'icon', 'svg');

const coupleSvgSource = path.join(srcSvgDir, 'couple.svg');
if (fs.existsSync(coupleSvgSource)) {
  if (fs.existsSync(wwwSvgDir)) {
    fs.copyFileSync(coupleSvgSource, path.join(wwwSvgDir, 'couple.svg'));
  }
  if (fs.existsSync(androidSvgDir)) {
    fs.copyFileSync(coupleSvgSource, path.join(androidSvgDir, 'couple.svg'));
  }
  console.log('[OK] Verified couple.svg across src, www, and platforms/android assets');
}

console.log('>>> ALL Mobile App Updates Applied Successfully! <<<');
