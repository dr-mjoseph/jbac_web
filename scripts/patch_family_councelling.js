const fs = require('fs');

// 1. Update family-councelling.ts
const tsPath = 'C:/Users/rajes/StudioProjects/jbac_app/src/pages/family-councelling/family-councelling.ts';
let ts = fs.readFileSync(tsPath, 'utf8');

// Replace ionViewWillEnter
const oldIonViewWillEnter = `  ionViewWillEnter() {
    const storedUsrId = localStorage.getItem('usr_id');
    const isDocFlag = localStorage.getItem('is_doctor');
    const catId = localStorage.getItem('category_id');
    const cat = (localStorage.getItem('category') || '').toLowerCase();
    const aortId = localStorage.getItem('aort_id');
    this.role = localStorage.getItem('role') || 'user';

    if (storedUsrId && storedUsrId.trim() !== '' && storedUsrId !== 'null' && !storedUsrId.startsWith('guest_')) {
      this.isLoggedIn = true;
      this.usr_id = storedUsrId;
      this.user_name = localStorage.getItem('name') || '';
      this.user_phone = localStorage.getItem('phone') || localStorage.getItem('mobile_number') || '';
      this.user_email = localStorage.getItem('email') || '';

      if (this.role === 'admin' || aortId === '1' || aortId === '2') {
        this.isAdmin = true;
      }
      if (catId === '8' || isDocFlag === '1' || cat.includes('doctor') || cat.includes('councellor') || this.role === 'doctor') {
        this.isDoctor = true;
      }
    } else {
      this.isLoggedIn = false;
      this.usr_id = null;
      this.isDoctor = false;
      this.isAdmin = false;
    }

    if (!this.isLoggedIn) {
      if (this.viewMode !== 'book_now') {
        this.viewMode = 'browse';
      }
    } else if (this.isDoctor) {
      if (this.viewMode === 'browse') {
        this.viewMode = 'doctor_schedule';
      }
    }

    this.loadDoctors();
    this.loadAppointments();
    this.checkSpeechSupport();
  }`;

const newIonViewWillEnter = `  ionViewWillEnter() {
    const storedUsrId = localStorage.getItem('usr_id');
    const isDocFlag = localStorage.getItem('is_doctor');
    const catId = localStorage.getItem('category_id');
    const cat = (localStorage.getItem('category') || '').toLowerCase().trim();
    const role = (localStorage.getItem('role') || '').toLowerCase().trim();

    if (storedUsrId && storedUsrId.trim() !== '' && storedUsrId !== 'null' && !storedUsrId.startsWith('guest_')) {
      this.isLoggedIn = true;
      this.usr_id = storedUsrId;
      this.user_name = localStorage.getItem('name') || '';
      this.user_phone = localStorage.getItem('phone') || localStorage.getItem('mobile_number') || '';
      this.user_email = localStorage.getItem('email') || '';

      this.isDoctor = (catId === '8' || isDocFlag === '1' || cat === 'doctor' || role === 'doctor');
      this.isAdmin = (role === 'admin' || cat === 'admin');
    } else {
      this.isLoggedIn = false;
      this.usr_id = null;
      this.isDoctor = false;
      this.isAdmin = false;
    }

    if (!this.isLoggedIn) {
      if (this.viewMode !== 'book_now') {
        this.viewMode = 'browse';
      }
    } else if (this.isDoctor) {
      if (this.viewMode === 'browse') {
        this.viewMode = 'doctor_schedule';
      }
    } else {
      // Normal user logged in
      if (this.viewMode === 'doctor_schedule' || this.viewMode === 'doctor_profile') {
        this.viewMode = 'browse';
      }
    }

    this.loadDoctors();
    this.loadAppointments();
    this.checkSpeechSupport();
  }

  switchTab(tab: string) {
    this.viewMode = tab;
    if (tab === 'my_bookings' || tab === 'doctor_schedule') {
      this.loadAppointments();
    }
  }

  onTabChange(tab: string) {
    this.switchTab(tab);
  }`;

ts = ts.replace(/\r\n/g, '\n');
if (ts.includes('ionViewWillEnter() {')) {
  const p1 = ts.indexOf('ionViewWillEnter() {');
  const p2 = ts.indexOf('gotohome()', p1);
  const before = ts.substring(0, ts.lastIndexOf('  ionViewWillEnter', p1));
  const after = ts.substring(p2);
  ts = before + newIonViewWillEnter + '\n\n  ' + after;
  console.log('Updated ionViewWillEnter and tab methods');
}

// Replace openBookingForm
const oldBookingForm = `  openBookingForm(doc: any) {
    this.selectedDoctor = doc;
    this.bookingData.doc_id = doc.id;
    this.clearUserVoiceRecording();
    this.viewMode = 'book_now';
  }`;

const newBookingForm = `  openBookingForm(doc: any) {
    if (!this.isLoggedIn) {
      const alert = this.alertCtrl.create({
        title: 'లాగిన్ అవ్వండి (Login Required)',
        message: 'కౌన్సిలింగ్ అపాయింట్‌మెంట్ బుక్ చేసుకోవడానికి దయచేసి ముందుగా లాగిన్ అవ్వండి.',
        buttons: [
          { text: 'రద్దు (Cancel)', role: 'cancel' },
          {
            text: 'లాగిన్ అవ్వండి (Login)',
            handler: () => {
              this.navCtrl.push('LoginPage', { redirect: 'FamilyCouncellingPage' });
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

if (ts.includes('openBookingForm(doc: any) {')) {
  const p1 = ts.indexOf('openBookingForm(doc: any) {');
  const p2 = ts.indexOf('cancelBooking()', p1);
  const before = ts.substring(0, ts.lastIndexOf('  openBookingForm', p1));
  const after = ts.substring(p2);
  ts = before + newBookingForm + '\n\n  ' + after;
  console.log('Updated openBookingForm with auth alert');
}

fs.writeFileSync(tsPath, ts, 'utf8');
console.log('Saved family-councelling.ts');

// 2. Update family-councelling.html
const htmlPath = 'C:/Users/rajes/StudioProjects/jbac_app/src/pages/family-councelling/family-councelling.html';
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/\r\n/g, '\n');

// Update segment buttons with (click)="switchTab(...)"
const oldSegment = `<ion-segment [(ngModel)]="viewMode" (ionChange)="onTabChange(viewMode)" color="primary">
      <ion-segment-button tappable value="browse">
        కౌన్సిలర్లు
      </ion-segment-button>
      <ion-segment-button tappable value="my_bookings" *ngIf="isLoggedIn && !isDoctor">
        నా బుకింగ్స్
      </ion-segment-button>
      <ion-segment-button tappable value="doctor_schedule" *ngIf="isLoggedIn && (isDoctor || isAdmin)">
        షెడ్యూల్
      </ion-segment-button>
      <ion-segment-button tappable value="doctor_profile" *ngIf="isLoggedIn && (isDoctor || isAdmin)">
        ప్రొఫైల్ అప్డేట్
      </ion-segment-button>
    </ion-segment>`;

const newSegment = `<ion-segment [(ngModel)]="viewMode" (ionChange)="onTabChange(viewMode)" color="primary">
      <ion-segment-button tappable value="browse" (click)="switchTab('browse')">
        కౌన్సిలర్లు
      </ion-segment-button>
      <ion-segment-button tappable value="my_bookings" *ngIf="isLoggedIn && !isDoctor" (click)="switchTab('my_bookings')">
        నా బుకింగ్స్
      </ion-segment-button>
      <ion-segment-button tappable value="doctor_schedule" *ngIf="isLoggedIn && (isDoctor || isAdmin)" (click)="switchTab('doctor_schedule')">
        షెడ్యూల్
      </ion-segment-button>
      <ion-segment-button tappable value="doctor_profile" *ngIf="isLoggedIn && (isDoctor || isAdmin)" (click)="switchTab('doctor_profile')">
        ప్రొఫైల్ అప్డేట్
      </ion-segment-button>
    </ion-segment>`;

if (html.includes('<ion-segment')) {
  const p1 = html.indexOf('<ion-segment');
  const p2 = html.indexOf('</ion-segment>', p1) + '</ion-segment>'.length;
  html = html.substring(0, p1) + newSegment + html.substring(p2);
  console.log('Updated ion-segment in HTML');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Saved family-councelling.html');
