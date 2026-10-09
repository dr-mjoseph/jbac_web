const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
console.log('Applying Family Counselling changes to Mobile App at:', mobilePath);

if (!fs.existsSync(mobilePath)) {
  console.error('[ERROR] Mobile path does not exist:', mobilePath);
  process.exit(1);
}

// ========================================================
// 1. Update src/providers/service/service.ts
// ========================================================
const serviceTsPath = path.join(mobilePath, 'src', 'providers', 'service', 'service.ts');
if (fs.existsSync(serviceTsPath)) {
  let content = fs.readFileSync(serviceTsPath, 'utf8');

  if (!content.includes('getcouncellingdoctors')) {
    const methodsToAdd = `
  // <--------------------- Family Counselling Endpoints --------------------->
  getcouncellingdoctors() {
    return this.http.post(this.testApi + 'getcouncellingdoctors', {});
  }

  savecouncellingdoctor(data: any) {
    return this.http.post(this.testApi + 'savecouncellingdoctor', data);
  }

  deletecouncellingdoctor(data: any) {
    return this.http.post(this.testApi + 'deletecouncellingdoctor', data);
  }

  getcouncellingappointments(data: any) {
    return this.http.post(this.testApi + 'getcouncellingappointments', data);
  }

  bookcouncellingappointment(data: any) {
    return this.http.post(this.testApi + 'bookcouncellingappointment', data);
  }

  updateappointmentstatus(data: any) {
    return this.http.post(this.testApi + 'updateappointmentstatus', data);
  }
`;

    // Insert before the last closing brace
    const lastBraceIndex = content.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      content = content.substring(0, lastBraceIndex) + methodsToAdd + '\n}\n';
      fs.writeFileSync(serviceTsPath, content, 'utf8');
      console.log('[OK] Added Family Counselling methods to mobile service.ts');
    }
  } else {
    console.log('[INFO] Family Counselling methods already exist in mobile service.ts');
  }
}

// ========================================================
// 2. Update src/pages/forms2/forms2.html and forms2.ts
// ========================================================
const forms2HtmlPath = path.join(mobilePath, 'src', 'pages', 'forms2', 'forms2.html');
if (fs.existsSync(forms2HtmlPath)) {
  let html = fs.readFileSync(forms2HtmlPath, 'utf8');
  if (!html.includes('gotopage(8)')) {
    // Insert after Marriages card (gotopage(2))
    const marriageCard = `<ion-card  class="hesd" (click)="gotopage(2)">
    <ion-card-header >
      వివాహాలు
    </ion-card-header>
  </ion-card>`;

    const newCard = `<ion-card  class="hesd" (click)="gotopage(2)">
    <ion-card-header >
      వివాహాలు
    </ion-card-header>
  </ion-card>
  <ion-card class="hesd" (click)="gotopage(8)" style="background: linear-gradient(135deg, #e3f2fd, #ffffff); border-left: 5px solid #00548F;">
    <ion-card-header style="color: #00548F; font-weight: bold;">
      ఫ్యామిలీ కౌన్సిలింగ్ (Family Counselling)
    </ion-card-header>
  </ion-card>`;

    if (html.includes(marriageCard)) {
      html = html.replace(marriageCard, newCard);
    } else {
      // Fallback: insert before </ion-content>
      html = html.replace('</ion-content>', `  <ion-card class="hesd" (click)="gotopage(8)">
    <ion-card-header>
      ఫ్యామిలీ కౌన్సిలింగ్ (Family Counselling)
    </ion-card-header>
  </ion-card>\n</ion-content>`);
    }
    fs.writeFileSync(forms2HtmlPath, html, 'utf8');
    console.log('[OK] Updated mobile forms2.html with Family Counselling card');
  }
}

const forms2TsPath = path.join(mobilePath, 'src', 'pages', 'forms2', 'forms2.ts');
if (fs.existsSync(forms2TsPath)) {
  let ts = fs.readFileSync(forms2TsPath, 'utf8');
  if (!ts.includes('FamilyCouncellingPage')) {
    ts = ts.replace(
      /this\.navCtrl\.push\('SearchorganisationPage'\);\s*\}/,
      "this.navCtrl.push('SearchorganisationPage');\n    } else if (id == 8) {\n      this.navCtrl.push('FamilyCouncellingPage');\n    }"
    );
    fs.writeFileSync(forms2TsPath, ts, 'utf8');
    console.log('[OK] Updated mobile forms2.ts with FamilyCouncellingPage routing');
  }
}

// ========================================================
// 3. Update src/pages/home/home.html and home.ts
// ========================================================
const homeHtmlPath = path.join(mobilePath, 'src', 'pages', 'home', 'home.html');
if (fs.existsSync(homeHtmlPath)) {
  let html = fs.readFileSync(homeHtmlPath, 'utf8');
  
  // A. Add to marquee ticker
  if (!html.includes('gotopage(19)')) {
    const marqueeSearch = '<span style="color:red;font-weight:bolder;font-family: \'Ramabhadra\', sans-serif;"> News </span>\n      : ';
    const marqueeReplacement = '<span style="color:red;font-weight:bolder;font-family: \'Ramabhadra\', sans-serif;"> News </span>\n      : <span (click)="gotopage(19)" style="color:#00548F;cursor:pointer;font-weight:bold;">నూతన సేవ: ఫ్యామిలీ కౌన్సిలింగ్ (Family Counselling) .</span>\n      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n      ';
    if (html.includes(marqueeSearch)) {
      html = html.replace(marqueeSearch, marqueeReplacement);
    }
  }

  // B. Add announcement card banner on home page right below marquee
  if (!html.includes('councelling-mobile-banner')) {
    const bannerHtml = `
  <!-- NEW ANNOUNCEMENT BANNER: FAMILY COUNSELLING -->
  <ion-card class="councelling-mobile-banner" (click)="gotopage(19)" style="background: linear-gradient(135deg, #00548F, #0077c2); color: white; border-radius: 12px; margin: 10px; box-shadow: 0 4px 12px rgba(0,84,143,0.25);">
    <ion-card-content style="padding: 12px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="background: #e63946; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; letter-spacing: 0.5px;">📢 NEW ANNOUNCEMENT</span>
        <ion-icon name="arrow-forward" style="color: white; font-size: 16px;"></ion-icon>
      </div>
      <h3 style="color: white; font-weight: bold; font-size: 15px; margin: 6px 0 3px 0;">ఫ్యామిలీ కౌన్సిలింగ్ (Family Counselling)</h3>
      <p style="color: #e0f2fe; font-size: 11.5px; margin: 0; line-height: 1.4;">క్రైస్తవ డాక్టర్లు మరియు కౌన్సిలర్ల ద్వారా ప్రత్యేక సలహాలు, సంరక్షణ & అపాయింట్‌మెంట్స్</p>
    </ion-card-content>
  </ion-card>
`;
    html = html.replace('</div>\n\n  <ion-row style="text-align: center;">', '</div>\n' + bannerHtml + '\n  <ion-row style="text-align: center;">');
  }

  // C. Add Family Counselling to ion-row icons grid if not present
  if (!html.includes('<b>ఫ్యామిలీ<br>కౌన్సిలింగ్</b>')) {
    const targetCol = `<ion-col col-3 class="made" (click)="gotopage(4)">
      <img style="padding:3%;width:100%" src="assets/icon/svg/services.svg">
      <b> ఇతర సర్వీసెస్ చుడానికి </b>
    </ion-col>`;

    const newCol = `<ion-col col-3 class="made" (click)="gotopage(19)">
      <img style="padding:3%;width:100%" src="assets/icon/svg/helping-hand.svg">
      <b>ఫ్యామిలీ<br>కౌన్సిలింగ్</b>
    </ion-col>
    <ion-col col-3 class="made" (click)="gotopage(4)">
      <img style="padding:3%;width:100%" src="assets/icon/svg/services.svg">
      <b> ఇతర సర్వీసెస్ చుడానికి </b>
    </ion-col>`;

    if (html.includes(targetCol)) {
      html = html.replace(targetCol, newCol);
    }
  }

  fs.writeFileSync(homeHtmlPath, html, 'utf8');
  console.log('[OK] Updated mobile home.html with news announcement and service card');
}

const homeTsPath = path.join(mobilePath, 'src', 'pages', 'home', 'home.ts');
if (fs.existsSync(homeTsPath)) {
  let ts = fs.readFileSync(homeTsPath, 'utf8');
  if (!ts.includes('id == 19')) {
    const regex = /this\.navCtrl\.push\('AddattacksPage'\);\s*\}/;
    const addition = `this.navCtrl.push('AddattacksPage');
    } else if (id == 19) {
      if (localStorage.getItem("usr_id") == " " || localStorage.getItem("usr_id") == null || localStorage.getItem("usr_id") == undefined || localStorage.getItem("usr_id") == "") {
        const confirm = this.alertCtrl.create({
          mode: 'ios',
          title: 'దయచేసి లాగిన్ అవ్వండి',
          subTitle: 'ఫ్యామిలీ కౌన్సిలింగ్ సేవలను పొందడానికి దయచేసి లాగిన్ అవ్వండి (Login required)',
          buttons: ['Ok']
        });
        confirm.present();
        this.navCtrl.push('LoginPage');
      } else {
        this.navCtrl.push('FamilyCouncellingPage');
      }
    }`;

    if (regex.test(ts)) {
      ts = ts.replace(regex, addition);
      fs.writeFileSync(homeTsPath, ts, 'utf8');
      console.log('[OK] Updated mobile home.ts with gotopage(19) and login verification');
    } else {
      console.warn('[WARN] Could not match AddattacksPage in home.ts');
    }
  }
}

// ========================================================
// 4. Create src/pages/family-councelling/ in jbac_app
// ========================================================
const targetDir = path.join(mobilePath, 'src', 'pages', 'family-councelling');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 4.1 family-councelling.module.ts
const moduleTsContent = `import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyCouncellingPage } from './family-councelling';

@NgModule({
  declarations: [
    FamilyCouncellingPage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyCouncellingPage),
  ],
})
export class FamilyCouncellingPageModule {}
`;
fs.writeFileSync(path.join(targetDir, 'family-councelling.module.ts'), moduleTsContent, 'utf8');

// 4.2 family-councelling.scss
const scssContent = `page-family-councelling {
  .pagecss {
    background-color: #f4f7f6;
  }

  ion-segment {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  }

  .segment-button {
    font-size: 12px !important;
    font-weight: bold;
    border-bottom-width: 3px !important;
  }

  .doc-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    margin: 12px;
    background: white;
    overflow: hidden;
  }

  .doc-header {
    background: linear-gradient(135deg, #00548F, #0077c2);
    color: white;
    padding: 12px 16px;
    display: flex;
    align-items: center;
  }

  .doc-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: white;
    color: #00548F;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    margin-right: 12px;
  }

  .doc-title {
    font-size: 15px;
    font-weight: bold;
    margin: 0;
  }

  .doc-specialty {
    font-size: 12px;
    color: #e0f2fe;
    margin: 2px 0 0 0;
  }

  .doc-body {
    padding: 14px 16px;
  }

  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    font-size: 12.5px;
    color: #4b5563;
  }

  .detail-row ion-icon {
    font-size: 15px;
    color: #00548F;
    width: 22px;
  }

  .btn-book {
    margin-top: 10px;
    border-radius: 8px;
    font-weight: bold;
  }

  .booking-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    margin: 12px;
    background: white;
    padding: 14px;
  }

  .status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: bold;
  }

  .status-pending { background: #fef3c7; color: #b45309; }
  .status-confirmed { background: #d1fae5; color: #047857; }
  .status-completed { background: #e0f2fe; color: #0369a1; }
  .status-cancelled { background: #fee2e2; color: #b91c1c; }

  .form-card {
    border-radius: 12px;
    background: white;
    padding: 14px;
    margin: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }

  .form-title {
    font-size: 16px;
    font-weight: bold;
    color: #00548F;
    margin-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 6px;
  }

  .custom-item {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 0 8px;
  }
}
`;
fs.writeFileSync(path.join(targetDir, 'family-councelling.scss'), scssContent, 'utf8');

// 4.3 family-councelling.ts
const tsContent = `import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-family-councelling',
  templateUrl: 'family-councelling.html',
})
export class FamilyCouncellingPage {
  viewMode: string = 'browse'; // 'browse' | 'my_bookings' | 'doctor_profile' | 'doctor_schedule'
  usr_id: any;
  user_name: any;
  user_phone: any;
  user_email: any;
  role: any = 'user';
  isAdmin: boolean = false;
  isDoctor: boolean = false;

  doctors: any[] = [];
  appointments: any[] = [];
  selectedDoctor: any = null;
  loading: boolean = false;

  // Booking Form model
  bookingData: any = {
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
  doctorProfile: any = {
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

  timeSlots: string[] = [
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public service: ServiceProvider
  ) {}

  ionViewWillEnter() {
    this.usr_id = localStorage.getItem('usr_id');
    this.user_name = localStorage.getItem('name') || '';
    this.user_phone = localStorage.getItem('phone') || '';
    this.user_email = localStorage.getItem('email') || '';
    this.role = localStorage.getItem('role') || 'user';
    const aortId = localStorage.getItem('aort_id');

    if (!this.usr_id || this.usr_id === ' ' || this.usr_id === '') {
      const alert = this.alertCtrl.create({
        title: 'దయచేసి లాగిన్ అవ్వండి',
        subTitle: 'ఫ్యామిలీ కౌన్సిలింగ్ సేవలను పొందడానికి దయచేసి లాగిన్ అవ్వండి (Login required).',
        buttons: [{
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot('LoginPage');
          }
        }]
      });
      alert.present();
      return;
    }

    if (this.role === 'admin' || aortId === '1' || aortId === '2') {
      this.isAdmin = true;
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
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    this.bookingData.appointment_date = tmrw.toISOString().split('T')[0];

    this.loadDoctors();
    this.loadAppointments();
  }

  gotohome() {
    this.navCtrl.setRoot('HomePage');
  }

  showToast(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  loadDoctors() {
    this.service.getcouncellingdoctors().subscribe(
      (res: any) => {
        if (res && res.status === 200) {
          this.doctors = res.data || [];
          // Check if current user is one of the doctors
          const myDoc = this.doctors.find(d => String(d.usr_id) === String(this.usr_id));
          if (myDoc) {
            this.isDoctor = true;
            this.doctorProfile = Object.assign({}, myDoc);
          }
        }
      },
      err => {
        console.error('Error loading doctors:', err);
      }
    );
  }

  loadAppointments() {
    const payload = {
      usr_id: this.usr_id,
      role: (this.isAdmin || this.isDoctor) ? 'doctor' : 'user'
    };

    this.service.getcouncellingappointments(payload).subscribe(
      (res: any) => {
        if (res && res.status === 200) {
          this.appointments = res.data || [];
        }
      },
      err => {
        console.error('Error loading appointments:', err);
      }
    );
  }

  openBookingForm(doc: any) {
    this.selectedDoctor = doc;
    this.bookingData.doc_id = doc.id;
    this.viewMode = 'book_now';
  }

  cancelBooking() {
    this.selectedDoctor = null;
    this.viewMode = 'browse';
  }

  submitAppointment() {
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

    const loader = this.loadingCtrl.create({ content: 'అపాయింట్‌మెంట్ నమోదు అవుతోంది...' });
    loader.present();

    const payload = {
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

    this.service.bookcouncellingappointment(payload).subscribe(
      (res: any) => {
        loader.dismiss();
        if (res && res.status === 200) {
          const alert = this.alertCtrl.create({
            title: 'అభినందనలు! (Success)',
            subTitle: 'మీ అపాయింట్‌మెంట్ విజయవంతంగా నమోదైంది! డాక్టర్ గారి షెడ్యూల్ ప్రకారం మీకు సమాచారం అందుతుంది.',
            buttons: ['Ok']
          });
          alert.present();
          this.loadAppointments();
          this.viewMode = 'my_bookings';
        } else {
          this.showToast(res.message || 'అపాయింట్‌మెంట్ నమోదు కాలేదు.');
        }
      },
      err => {
        loader.dismiss();
        this.showToast('సర్వర్ సమస్య. దయచేసి మళ్లీ ప్రయత్నించండి.');
      }
    );
  }

  saveDoctorProfile() {
    if (!this.doctorProfile.doctor_name || !this.doctorProfile.phone) {
      this.showToast('దయచేసి డాక్టర్ పేరు మరియు ఫోన్ నంబర్ నమోదు చేయండి');
      return;
    }

    const loader = this.loadingCtrl.create({ content: 'డాక్టర్ ప్రొఫైల్ సేవ్ అవుతోంది...' });
    loader.present();

    this.service.savecouncellingdoctor(this.doctorProfile).subscribe(
      (res: any) => {
        loader.dismiss();
        if (res && res.status === 200) {
          this.isDoctor = true;
          this.showToast('డాక్టర్ ప్రొఫైల్ విజయవంతంగా సేవ్ అయ్యింది!');
          this.loadDoctors();
          this.viewMode = 'browse';
        } else {
          this.showToast(res.message || 'ప్రొఫైల్ సేవ్ కాలేదు');
        }
      },
      err => {
        loader.dismiss();
        this.showToast('సర్వర్ సమస్య.');
      }
    );
  }

  editDoctorAsAdmin(doc: any) {
    this.doctorProfile = Object.assign({}, doc);
    this.viewMode = 'doctor_profile';
    this.showToast('డాక్టర్ వివరాలు ఎడిట్ చేయడానికి లోడ్ అయ్యాయి');
  }

  updateStatus(appt: any, newStatus: string) {
    const confirm = this.alertCtrl.create({
      title: 'స్టేటస్ మార్పు',
      message: 'ఈ అపాయింట్‌మెంట్ స్టేటస్‌ను ' + newStatus + ' గా మార్చాలనుకుంటున్నారా?',
      buttons: [
        { text: 'రద్దు (Cancel)', role: 'cancel' },
        {
          text: 'సరే (Confirm)',
          handler: () => {
            this.service.updateappointmentstatus({ id: appt.id, status: newStatus }).subscribe(
              (res: any) => {
                if (res && res.status === 200) {
                  appt.status = newStatus;
                  this.showToast('అపాయింట్‌మెంట్ స్టేటస్ నవీకరించబడింది');
                }
              }
            );
          }
        }
      ]
    });
    confirm.present();
  }
}
`;
fs.writeFileSync(path.join(targetDir, 'family-councelling.ts'), tsContent, 'utf8');

// 4.4 family-councelling.html
const htmlContent = `<ion-header>
  <ion-navbar color="primary">
    <ion-title style="text-align: center; font-size: 16px;">
      <b>ఫ్యామిలీ కౌన్సిలింగ్ (Counselling)</b>
    </ion-title>
    <ion-buttons end>
      <button ion-button icon-only (click)="gotohome()">
        <ion-icon name="home"></ion-icon>
      </button>
    </ion-buttons>
  </ion-navbar>

  <ion-toolbar no-border-top>
    <ion-segment [(ngModel)]="viewMode" color="primary">
      <ion-segment-button value="browse">
        డాక్టర్లు
      </ion-segment-button>
      <ion-segment-button value="my_bookings">
        నా బుకింగ్స్
      </ion-segment-button>
      <ion-segment-button value="doctor_profile">
        డాక్టర్ ప్రొఫైల్
      </ion-segment-button>
      <ion-segment-button value="doctor_schedule" *ngIf="isDoctor || isAdmin">
        షెడ్యూల్
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>
</ion-header>

<ion-content class="pagecss">

  <!-- ==============================================
       TAB 1: BROWSE DOCTORS & COUNSELLORS
       ============================================== -->
  <div *ngIf="viewMode === 'browse'">
    <div style="background: #e0f2fe; padding: 10px 14px; margin: 10px; border-radius: 8px; color: #0369a1; font-size: 12.5px;">
      <b>🌟 Christian Family Care:</b> కుటుంబ సమస్యలు, ఆరోగ్యం మరియు మానసిక ప్రశాంతత కొరకు నైపుణ్యం కలిగిన క్రైస్తవ డాక్టర్లతో అపాయింట్‌మెంట్ బుక్ చేసుకోండి.
    </div>

    <div *ngFor="let doc of doctors" class="doc-card">
      <div class="doc-header">
        <div class="doc-avatar">
          <ion-icon name="medkit"></ion-icon>
        </div>
        <div>
          <h3 class="doc-title">{{doc.doctor_name}}</h3>
          <p class="doc-specialty">{{doc.specialty}} &bull; {{doc.qualification}}</p>
        </div>
      </div>
      <div class="doc-body">
        <div class="detail-row">
          <ion-icon name="calendar"></ion-icon>
          <span><b>రోజులు:</b> {{doc.available_days || 'Mon, Wed, Fri'}}</span>
        </div>
        <div class="detail-row">
          <ion-icon name="time"></ion-icon>
          <span><b>సమయం:</b> {{doc.available_time_slots || '10:00 AM - 01:00 PM'}}</span>
        </div>
        <div class="detail-row" *ngIf="doc.hospital_church">
          <ion-icon name="business"></ion-icon>
          <span><b>హాస్పిటల్ / మినిస్ట్రీ:</b> {{doc.hospital_church}}</span>
        </div>
        <div class="detail-row">
          <ion-icon name="cash"></ion-icon>
          <span><b>ఫీజు:</b> {{doc.consultation_fee > 0 ? ('₹ ' + doc.consultation_fee) : 'ఉచిత సేవ (Free Consultation)'}}</span>
        </div>
        <p *ngIf="doc.bio" style="font-size: 12px; color: #6b7280; margin: 8px 0;">
          {{doc.bio}}
        </p>

        <ion-row>
          <ion-col col-12>
            <button ion-button block color="primary" class="btn-book" (click)="openBookingForm(doc)">
              <ion-icon name="calendar" style="margin-right: 6px;"></ion-icon> అపాయింట్‌మెంట్ బుక్ చేసుకోండి
            </button>
          </ion-col>
          <ion-col col-12 *ngIf="isAdmin">
            <button ion-button block outline color="secondary" small (click)="editDoctorAsAdmin(doc)">
              <ion-icon name="create" style="margin-right: 6px;"></ion-icon> అడ్మిన్: ప్రొఫైల్ ఎడిట్ చేయండి
            </button>
          </ion-col>
        </ion-row>
      </div>
    </div>

    <div *ngIf="doctors.length === 0" style="text-align: center; padding: 40px 20px; color: #6b7280;">
      <ion-icon name="people" style="font-size: 48px; color: #cbd5e1;"></ion-icon>
      <p>ప్రస్తుతం డాక్టర్ల జాబితా లోడ్ అవుతోంది...</p>
    </div>
  </div>

  <!-- ==============================================
       BOOKING FORM SUB-PAGE (when doctor clicked)
       ============================================== -->
  <div *ngIf="viewMode === 'book_now' && selectedDoctor" class="booking-card">
    <div style="background: #eef6ff; padding: 10px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #00548F;">
      <h4 style="margin: 0; font-size: 14px; font-weight: bold; color: #00548F;">
        డాక్టర్: {{selectedDoctor.doctor_name}}
      </h4>
      <p style="margin: 2px 0 0 0; font-size: 12px; color: #4b5563;">
        {{selectedDoctor.specialty}}
      </p>
    </div>

    <ion-list no-lines>
      <ion-item class="custom-item">
        <ion-label floating>రోగి / కుటుంబ సభ్యుల పేరు *</ion-label>
        <ion-input type="text" [(ngModel)]="bookingData.patient_name"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>ఫోన్ నంబర్ *</ion-label>
        <ion-input type="tel" [(ngModel)]="bookingData.patient_phone"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>అపాయింట్‌మెంట్ తేదీ *</ion-label>
        <ion-datetime displayFormat="YYYY-MM-DD" pickerFormat="YYYY-MM-DD" [(ngModel)]="bookingData.appointment_date"></ion-datetime>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>సమయం (Time Slot) *</ion-label>
        <ion-select [(ngModel)]="bookingData.appointment_time">
          <ion-option *ngFor="let slot of timeSlots" [value]="slot">{{slot}}</ion-option>
        </ion-select>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>సమస్య / కౌన్సిలింగ్ అంశం</ion-label>
        <ion-textarea rows="2" [(ngModel)]="bookingData.reason" placeholder="ఉదా: కుటుంబ సలహా, వివాహ కౌన్సిలింగ్..."></ion-textarea>
      </ion-item>
    </ion-list>

    <ion-row>
      <ion-col col-6>
        <button ion-button block outline color="dark" (click)="cancelBooking()">
          రద్దు (Cancel)
        </button>
      </ion-col>
      <ion-col col-6>
        <button ion-button block color="primary" (click)="submitAppointment()">
          బుక్ చేయండి
        </button>
      </ion-col>
    </ion-row>
  </div>

  <!-- ==============================================
       TAB 2: MY BOOKINGS (Family view)
       ============================================== -->
  <div *ngIf="viewMode === 'my_bookings'">
    <div style="padding: 10px 14px 4px 14px;">
      <h4 style="font-size: 15px; font-weight: bold; color: #1e293b; margin: 0;">
        నా అపాయింట్‌మెంట్లు (My Appointments)
      </h4>
    </div>

    <div *ngFor="let appt of appointments" class="booking-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: bold; font-size: 14px; color: #00548F;">
          👨‍⚕️ {{appt.doctor_name || 'Dr. Christian Counsellor'}}
        </span>
        <span class="status-badge" [ngClass]="'status-' + (appt.status || 'pending').toLowerCase()">
          {{appt.status || 'Pending'}}
        </span>
      </div>

      <div class="detail-row">
        <ion-icon name="calendar"></ion-icon>
        <span><b>తేదీ:</b> {{appt.appointment_date}}</span>
      </div>
      <div class="detail-row">
        <ion-icon name="time"></ion-icon>
        <span><b>సమయం:</b> {{appt.appointment_time}}</span>
      </div>
      <div class="detail-row" *ngIf="appt.reason">
        <ion-icon name="document"></ion-icon>
        <span><b>కారణం:</b> {{appt.reason}}</span>
      </div>
      <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">
        నమోదైన తేదీ: {{appt.created_at ? (appt.created_at | slice:0:10) : 'Today'}}
      </div>
    </div>

    <div *ngIf="appointments.length === 0" style="text-align: center; padding: 40px 20px; color: #6b7280;">
      <ion-icon name="calendar" style="font-size: 48px; color: #cbd5e1;"></ion-icon>
      <p>మీరు ఇంకా ఎటువంటి అపాయింట్‌మెంట్లు బుక్ చేసుకోలేదు.</p>
      <button ion-button outline small color="primary" (click)="viewMode = 'browse'">
        డాక్టర్లను చూడండి
      </button>
    </div>
  </div>

  <!-- ==============================================
       TAB 3: DOCTOR / ADMIN PROFILE SETUP
       ============================================== -->
  <div *ngIf="viewMode === 'doctor_profile'" class="form-card">
    <div class="form-title">
      👨‍⚕️ డాక్టర్ ప్రొఫైల్ నమోదు & మార్పులు (Doctor Profile)
    </div>
    <p style="font-size: 12px; color: #64748b; margin-top: -6px; margin-bottom: 12px;">
      డాక్టర్లు లేదా అడ్మిన్లు ఈ ఫారమ్ ద్వారా డాక్టర్ వివరాలు, అందుబాటులో ఉండే రోజులు మరియు సమయాలు నమోదు చేయవచ్చు.
    </p>

    <!-- Admin on-behalf doctor selector -->
    <ion-item class="custom-item" *ngIf="isAdmin && doctors.length > 0">
      <ion-label floating>అడ్మిన్: ఎడిట్ చేయడానికి డాక్టర్‌ను ఎంచుకోండి</ion-label>
      <ion-select (ionChange)="editDoctorAsAdmin($event)">
        <ion-option *ngFor="let d of doctors" [value]="d">{{d.doctor_name}} ({{d.specialty}})</ion-option>
      </ion-select>
    </ion-item>

    <ion-list no-lines>
      <ion-item class="custom-item">
        <ion-label floating>డాక్టర్ పూర్తి పేరు *</ion-label>
        <ion-input type="text" [(ngModel)]="doctorProfile.doctor_name" placeholder="Dr. Name"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>విద్యార్హత (Qualification) *</ion-label>
        <ion-input type="text" [(ngModel)]="doctorProfile.qualification" placeholder="MBBS, MD / Counsellor"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>స్పెషలైజేషన్ (Specialty) *</ion-label>
        <ion-input type="text" [(ngModel)]="doctorProfile.specialty" placeholder="Family Counselling / Psychologist"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>సంప్రదింపు ఫోన్ నంబర్ *</ion-label>
        <ion-input type="tel" [(ngModel)]="doctorProfile.phone"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>ఈమెయిల్ (Email)</ion-label>
        <ion-input type="email" [(ngModel)]="doctorProfile.email"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>అందుబాటులో ఉండే రోజులు (Available Days)</ion-label>
        <ion-input type="text" [(ngModel)]="doctorProfile.available_days" placeholder="Mon, Wed, Fri, Sat"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>సమయాలు (Timing Slots)</ion-label>
        <ion-input type="text" [(ngModel)]="doctorProfile.available_time_slots" placeholder="10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>కన్సల్టేషన్ ఫీజు (₹ - ఉచితమైతే 0 నమోదు చేయండి)</ion-label>
        <ion-input type="number" [(ngModel)]="doctorProfile.consultation_fee"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>హాస్పిటల్ / మినిస్ట్రీ లేదా చర్చి వివరాలు</ion-label>
        <ion-input type="text" [(ngModel)]="doctorProfile.hospital_church"></ion-input>
      </ion-item>

      <ion-item class="custom-item">
        <ion-label floating>డాక్టర్ గురించిన వివరాలు (Bio)</ion-label>
        <ion-textarea rows="3" [(ngModel)]="doctorProfile.bio" placeholder="అనుభవం, సలహా విధానం..."></ion-textarea>
      </ion-item>
    </ion-list>

    <button ion-button block color="primary" (click)="saveDoctorProfile()" style="border-radius: 8px; font-weight: bold; margin-top: 14px;">
      <ion-icon name="checkmark-circle" style="margin-right: 6px;"></ion-icon> ప్రొఫైల్ సేవ్ చేయండి
    </button>
  </div>

  <!-- ==============================================
       TAB 4: DOCTOR APPOINTMENTS SCHEDULE
       ============================================== -->
  <div *ngIf="viewMode === 'doctor_schedule' && (isDoctor || isAdmin)">
    <div style="padding: 10px 14px 4px 14px;">
      <h4 style="font-size: 15px; font-weight: bold; color: #1e293b; margin: 0;">
        డాక్టర్ అపాయింట్‌మెంట్ల షెడ్యూల్ (Schedule & Patients)
      </h4>
    </div>

    <div *ngFor="let appt of appointments" class="booking-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: bold; font-size: 14px; color: #00548F;">
          👤 {{appt.patient_name}}
        </span>
        <span class="status-badge" [ngClass]="'status-' + (appt.status || 'pending').toLowerCase()">
          {{appt.status || 'Pending'}}
        </span>
      </div>

      <div class="detail-row">
        <ion-icon name="call"></ion-icon>
        <span><b>ఫోన్:</b> <a [href]="'tel:' + appt.patient_phone">{{appt.patient_phone}}</a></span>
      </div>
      <div class="detail-row">
        <ion-icon name="calendar"></ion-icon>
        <span><b>తేదీ:</b> {{appt.appointment_date}}</span>
      </div>
      <div class="detail-row">
        <ion-icon name="time"></ion-icon>
        <span><b>సమయం:</b> {{appt.appointment_time}}</span>
      </div>
      <div class="detail-row" *ngIf="appt.reason">
        <ion-icon name="document"></ion-icon>
        <span><b>విషయం:</b> {{appt.reason}}</span>
      </div>

      <!-- Quick status actions for doctor/admin -->
      <div style="margin-top: 10px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
        <ion-row>
          <ion-col col-4>
            <button ion-button block small color="secondary" (click)="updateStatus(appt, 'Confirmed')">
              Confirm
            </button>
          </ion-col>
          <ion-col col-4>
            <button ion-button block small color="primary" (click)="updateStatus(appt, 'Completed')">
              Done
            </button>
          </ion-col>
          <ion-col col-4>
            <button ion-button block small color="danger" outline (click)="updateStatus(appt, 'Cancelled')">
              Cancel
            </button>
          </ion-col>
        </ion-row>
      </div>
    </div>

    <div *ngIf="appointments.length === 0" style="text-align: center; padding: 40px 20px; color: #6b7280;">
      <ion-icon name="clock" style="font-size: 48px; color: #cbd5e1;"></ion-icon>
      <p>ప్రస్తుతం అపాయింట్‌మెంట్లు ఏవీ లేవు.</p>
    </div>
  </div>

</ion-content>
`;
fs.writeFileSync(path.join(targetDir, 'family-councelling.html'), htmlContent, 'utf8');
console.log('[OK] Created FamilyCouncellingPage component files in mobile app');

console.log('\n=== Mobile Family Counselling Integration Complete! ===');
