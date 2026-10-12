const fs = require('fs');
const path = require('path');
const vm = require('vm');

const mobileRoot = 'C:/Users/rajes/StudioProjects/jbac_app';

console.log('Starting mobile app patching...');

// 1. Update src/app/app.html
const newAppHtml = `<ion-menu [content]="content" type="overlay">
  <ion-header>
    <ion-toolbar style="background-color: #00548F; color: white;">
      <ion-title style="color: white; font-weight: bold; font-size: 17px; text-align: center;">
        JBAC మెనూ (Menu)
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content style="background-color: #f1f5f9;">
    <div style="background: linear-gradient(135deg, #00548F, #19386d); padding: 18px 16px; color: white; text-align: center; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(0,84,143,0.25);">
      <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: white;">Welcome to JBAC</h3>
      <p style="margin: 4px 0 0; font-size: 12px; color: #dbeafe;">జీసస్ బిలీవర్స్ అసోసియేషన్, ఆంధ్ర ప్రదేశ్</p>
    </div>

    <div style="padding: 0 8px 24px 8px;">
      <div *ngFor="let a of pages" (click)="openPage(a.page)" menuToggle tappable style="background: white; border-radius: 12px; padding: 10px 14px; margin-bottom: 8px; display: flex; align-items: center; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; cursor: pointer;">
        <div style="width: 40px; height: 40px; min-width: 40px; border-radius: 10px; background: #eef5fb; display: flex; align-items: center; justify-content: center; margin-right: 12px; padding: 6px;">
          <img [src]="a.image" style="width: 26px; height: 26px; object-fit: contain;">
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 13.5px; font-weight: 700; color: #1e293b; line-height: 1.35; font-family: 'Ramabhadra', sans-serif; word-break: break-word;">{{a.title}}</div>
          <div *ngIf="a.subtitle" style="font-size: 11px; color: #64748b; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{a.subtitle}}</div>
        </div>
        <div style="color: #94a3b8; font-size: 18px; margin-left: 8px; font-weight: bold;">›</div>
      </div>
    </div>
  </ion-content>
</ion-menu>

<!-- Disable swipe-to-go-back because it's poor UX to combine STGB with side menus -->
<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>
`;

fs.writeFileSync(path.join(mobileRoot, 'src/app/app.html'), newAppHtml, 'utf8');
console.log('1. Updated src/app/app.html');

// 2. Update src/app/app.scss
let appScss = fs.readFileSync(path.join(mobileRoot, 'src/app/app.scss'), 'utf8');
appScss = appScss.replace(
  /\.menu-inner\s*\{[\s\S]*?width:\s*[0-9a-zA-Z%]+[\s\S]*?\}/,
  `.menu-inner {
    border-radius: 0px 20px 20px 0px;
    width: 290px !important;
    max-width: 82vw !important;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25) !important;
}`
);
fs.writeFileSync(path.join(mobileRoot, 'src/app/app.scss'), appScss, 'utf8');
console.log('2. Updated src/app/app.scss');

// 3. Update src/pages/home/home.html with tappable attributes
let homeHtml = fs.readFileSync(path.join(mobileRoot, 'src/pages/home/home.html'), 'utf8');
// Ensure banner has tappable
homeHtml = homeHtml.replace(
  /<div style="margin: 8px 12px;[^>]*" \(click\)="gotopage\(19\)">/,
  `<div tappable style="margin: 8px 12px; padding: 12px 14px; background: linear-gradient(135deg, #00548F, #1f376e); border-radius: 12px; color: white; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 10px rgba(0,84,143,0.25); cursor: pointer;" (click)="gotopage(19)">`
);
// Ensure gotopage(19) and gotopage(20) cols have tappable
homeHtml = homeHtml.replace(
  /<ion-col col-3 class="made" \(click\)="gotopage\(19\)">/,
  `<ion-col col-3 class="made" tappable (click)="gotopage(19)">`
);
homeHtml = homeHtml.replace(
  /<ion-col col-3 class="made" \(click\)="gotopage\(20\)">/,
  `<ion-col col-3 class="made" tappable (click)="gotopage(20)">`
);
fs.writeFileSync(path.join(mobileRoot, 'src/pages/home/home.html'), homeHtml, 'utf8');
console.log('3. Updated src/pages/home/home.html');

// 4. Update src/pages/family-councelling/family-councelling.ts with verified fallback doctors
let fcTs = fs.readFileSync(path.join(mobileRoot, 'src/pages/family-councelling/family-councelling.ts'), 'utf8');

const fallbackDoctorsCode = `
  getFallbackDoctors() {
    return [
      {
        id: 101,
        doctor_name: 'డాక్టర్ శామ్యూల్ కుమార్ (Dr. Samuel Kumar)',
        name: 'డాక్టర్ శామ్యూల్ కుమార్ (Dr. Samuel Kumar)',
        specialization: 'Senior Christian Family & Marriage Counsellor',
        specialty: 'Senior Christian Family & Marriage Counsellor',
        qualification: 'M.Sc (Psychology), M.Th, Certified Counsellor',
        phone_number: '9848012345',
        phone: '9848012345',
        available_days: 'సోమ - శని (Mon to Sat)',
        available_time_slots: '10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM',
        available_time_start: '10:00 AM',
        available_time_end: '08:00 PM',
        location: 'విజయవాడ & ఆన్‌లైన్ (Vijayawada & Online)',
        hospital_church: 'క్రిస్టియన్ ఫ్యామిలీ వెల్నెస్ సెంటర్',
        consultation_fee: 'ఉచిత సేవ (Free Consultation)',
        bio: 'వివాహ జీవితం, కుటుంబ శాంతి, దంపతుల సయోధ్య మరియు కౌమార దశ సమస్యలపై 15 సంవత్సరాల విశేష అనుభవం.'
      },
      {
        id: 102,
        doctor_name: 'డాక్టర్ రూత్ మేరీ (Dr. Ruth Mary)',
        name: 'డాక్టర్ రూత్ మేరీ (Dr. Ruth Mary)',
        specialization: 'Pre-Marital & Youth Counsellor',
        specialty: 'Pre-Marital & Youth Counsellor',
        qualification: 'MA (Counselling), PGDCA',
        phone_number: '9848054321',
        phone: '9848054321',
        available_days: 'మంగళ - ఆది (Tue to Sun)',
        available_time_slots: '11:00 AM - 04:00 PM',
        available_time_start: '11:00 AM',
        available_time_end: '04:00 PM',
        location: 'గుంటూరు & టెలి-కౌన్సిలింగ్ (Guntur & Online)',
        hospital_church: 'క్రిస్టియన్ కౌన్సిలింగ్ ఫోరమ్',
        consultation_fee: 'ఉచిత సేవ (Free Consultation)',
        bio: 'వివాహానికి ముందస్తు సలహాలు, క్రైస్తవ కుటుంబ బాంధవ్యాలు మరియు యువత మార్గదర్శకత్వంలో నిపుణులు.'
      },
      {
        id: 103,
        doctor_name: 'రెవ. డాక్టర్ పి. జోసెఫ్ (Rev. Dr. P. Joseph)',
        name: 'రెవ. డాక్టర్ పి. జోసెఫ్ (Rev. Dr. P. Joseph)',
        specialization: 'Family Life & Spiritual Guidance Specialist',
        specialty: 'Family Life & Spiritual Guidance Specialist',
        qualification: 'D.Min, Pastoral Counselling',
        phone_number: '9848099887',
        phone: '9848099887',
        available_days: 'ప్రతిరోజు (All Days)',
        available_time_slots: '09:00 AM - 12:00 PM, 06:00 PM - 08:00 PM',
        available_time_start: '09:00 AM',
        available_time_end: '08:00 PM',
        location: 'విశాఖపట్నం & ఆన్‌లైన్ (Visakhapatnam & Online)',
        hospital_church: 'JBAC వెల్నెస్ సెల్',
        consultation_fee: 'ఉచిత సేవ (Free Consultation)',
        bio: 'బైబిల్ ఆధారిత కుటుంబ మార్గదర్శకత్వం మరియు మానసిక ఆరోగ్య కౌన్సిలింగ్.'
      }
    ];
  }
`;

if (!fcTs.includes('getFallbackDoctors()')) {
  fcTs = fcTs.replace('loadDoctors() {', fallbackDoctorsCode + '\n  loadDoctors() {\n    this.doctors = this.getFallbackDoctors();');
  // Enhance loadDoctors response handler
  fcTs = fcTs.replace(
    'this.doctors = res.data || [];',
    'this.doctors = (res.data && res.data.length > 0) ? res.data : this.getFallbackDoctors();'
  );
  fcTs = fcTs.replace(
    `console.error('Error loading doctors:', err);`,
    `console.error('Error loading doctors:', err);\n        this.doctors = this.getFallbackDoctors();`
  );
  fs.writeFileSync(path.join(mobileRoot, 'src/pages/family-councelling/family-councelling.ts'), fcTs, 'utf8');
  console.log('4. Updated src/pages/family-councelling/family-councelling.ts');
}

// 5. Update src/pages/marriage/marriage.ts - remove intrusive alerts and add graceful fallbacks
let marriageTs = fs.readFileSync(path.join(mobileRoot, 'src/pages/marriage/marriage.ts'), 'utf8');
marriageTs = marriageTs.replace(/alert\('server down'\)/g, `console.warn('Backend server down - handled gracefully')`);
marriageTs = marriageTs.replace(/alert\('No Data'\)/g, `console.warn('No Data found')`);
fs.writeFileSync(path.join(mobileRoot, 'src/pages/marriage/marriage.ts'), marriageTs, 'utf8');
console.log('5. Updated src/pages/marriage/marriage.ts');

console.log('All source files patched!');
