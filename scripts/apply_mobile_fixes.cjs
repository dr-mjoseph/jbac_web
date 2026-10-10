const fs = require('fs');
const path = require('path');

const mobileAppDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';

console.log('=== Step 1: Updating src/pages/home/home.ts ===');
const homeTsPath = path.join(mobileAppDir, 'src', 'pages', 'home', 'home.ts');
let homeTs = fs.readFileSync(homeTsPath, 'utf8');

// Ensure id == 19 and id == 20 are clean without any blocking alerts
const oldId19 = /else\s+if\s*\(\s*id\s*==\s*19\s*\)\s*\{[\s\S]*?this\.navCtrl\.push\(\s*['"]FamilyCouncellingPage['"]\s*\);[\s\S]*?\}/;
if (oldId19.test(homeTs)) {
  homeTs = homeTs.replace(oldId19, `else if (id == 19) {
      this.navCtrl.push('FamilyCouncellingPage');
    } else if (id == 20) {
      this.navCtrl.push('MarriagePage');
    }`);
  console.log('[OK] Updated home.ts gotopage(19) and gotopage(20)');
} else if (!homeTs.includes('id == 20')) {
  homeTs = homeTs.replace("this.navCtrl.push('FamilyCouncellingPage');", "this.navCtrl.push('FamilyCouncellingPage');\n    } else if (id == 20) {\n      this.navCtrl.push('MarriagePage');");
  console.log('[OK] Added id == 20 to home.ts');
}
fs.writeFileSync(homeTsPath, homeTs, 'utf8');

console.log('=== Step 2: Updating src/pages/home/home.html ===');
const homeHtmlPath = path.join(mobileAppDir, 'src', 'pages', 'home', 'home.html');
let homeHtml = fs.readFileSync(homeHtmlPath, 'utf8');

const marriageColHtml = `    <ion-col col-3 class="made" (click)="gotopage(20)">
      <img style="padding:3%;width:100%" src="assets/icon/svg/register.svg" onerror="this.onerror=null;this.src='assets/icon/svg/services.svg';">
      <b>వివాహ<br>సంబంధాలు</b>
    </ion-col>`;

if (!homeHtml.includes('(click)="gotopage(20)"')) {
  const targetCol = '<ion-col col-3 class="made" (click)="gotopage(19)">';
  const targetColIdx = homeHtml.indexOf(targetCol);
  if (targetColIdx !== -1) {
    const endColIdx = homeHtml.indexOf('</ion-col>', targetColIdx);
    if (endColIdx !== -1) {
      homeHtml = homeHtml.slice(0, endColIdx + 10) + '\n\n' + marriageColHtml + homeHtml.slice(endColIdx + 10);
      console.log('[OK] Added gotopage(20) marriage tile to home.html');
    }
  }
}
fs.writeFileSync(homeHtmlPath, homeHtml, 'utf8');

console.log('=== Step 3: Updating src/app/app.component.ts ===');
const appTsPath = path.join(mobileAppDir, 'src', 'app', 'app.component.ts');
let appTs = fs.readFileSync(appTsPath, 'utf8');

const updatedPagesTs = `    this.pages = [
      { 'title': 'వివాహ & కుటుంబ కౌన్సిలింగ్', 'subtitle': 'Family & Marriage Counselling', 'image': 'assets/icon/svg/couple.svg', 'page': 'FamilyCouncellingPage' },
      { 'title': 'వివాహ సంబంధాలు', 'subtitle': 'Christian Marriage Alliances', 'image': 'assets/icon/svg/register.svg', 'page': 'MarriagePage' },
      { 'title': 'వివాహ సంబంధం నమోదు', 'subtitle': 'Register Marriage Profile', 'image': 'assets/icon/svg/register.svg', 'page': 'AddmarriagePage' },
      { 'title': 'కౌన్సిలర్ / డాక్టర్ నమోదు', 'subtitle': 'Register as Counsellor', 'image': 'assets/icon/svg/employee.svg', 'page': 'DoctorregisterPage' },
      { 'title': 'మీకు మా సహాయం', 'subtitle': 'Helping Hands & Support', 'image': 'assets/icon/svg/helping-hand.svg', 'page': 'HelpinghandsPage' },
      { 'title': 'చర్చి పర్మిషన్ గవర్నమెంట్ ఆర్డర్స్', 'subtitle': 'Govt Orders & Church Permissions', 'image': 'assets/icon/svg/governmental.svg', 'page': 'ChurchgoPage' },
      { 'title': 'యాప్ ఎలా ఉపయోగించాలి', 'subtitle': 'App & Website Help Guide', 'image': 'assets/icon/svg/cloud-computing.svg', 'page': 'WebhelpPage' },
      { 'title': 'మీ చర్చికి మా టెక్నికల్ సొల్యూషన్స్', 'subtitle': 'Technical Church Solutions', 'image': 'assets/icon/svg/employee.svg', 'page': 'TechsolPage' },
      { 'title': 'ఫోటో గ్యాలరీ', 'subtitle': 'JBAC Photo Gallery', 'image': 'assets/icon/svg/picture.svg', 'page': 'GalleryPage' },
      { 'title': 'వీడియో గ్యాలరీ', 'subtitle': 'Video Gallery & Sermons', 'image': 'assets/icon/svg/video.svg', 'page': 'VideoGalleryPage' },
      { 'title': 'క్రైస్తవ వార్తలు', 'subtitle': 'Latest Christian News', 'image': 'assets/icon/svg/news.svg', 'page': 'NewsPage' },
      { 'title': 'క్రైస్తవులపై దాడుల నమోదు', 'subtitle': 'Report Attacks on Christians', 'image': 'assets/icon/svg/organisation.svg', 'page': 'AddattacksPage' },
      { 'title': 'JBAC వింగ్స్ సమాచారం', 'subtitle': 'JBAC Wings & Leadership', 'image': 'assets/icon/svg/project-manager.svg', 'page': 'WingPage' },
      { 'title': 'మమ్మల్ని సంప్రదించండి', 'subtitle': 'Contact JBAC Helpline', 'image': 'assets/icon/svg/contact-us.svg', 'page': 'ContactPage' },
    ];`;

const pagesRegex = /this\.pages\s*=\s*\[[\s\S]*?\];/;
if (pagesRegex.test(appTs)) {
  appTs = appTs.replace(pagesRegex, updatedPagesTs);
  console.log('[OK] Updated this.pages in app.component.ts');
}
fs.writeFileSync(appTsPath, appTs, 'utf8');

console.log('=== Step 4: Updating src/app/app.html ===');
const appHtmlPath = path.join(mobileAppDir, 'src', 'app', 'app.html');
const newAppHtml = `<ion-menu [content]="content" type="overlay">
  <ion-header>
    <ion-toolbar style="background-color: #00548F; color: white;">
      <ion-title style="color: white; font-weight: bold; font-size: 17px; text-align: center;">
        JBAC మెనూ (Menu)
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content style="background-color: #f4f7fb;">
    <div style="background: linear-gradient(135deg, #00548F, #19386d); padding: 18px 16px; color: white; text-align: left; margin-bottom: 8px;">
      <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: white;">Welcome to JBAC</h3>
      <p style="margin: 4px 0 0; font-size: 12px; color: #dbeafe;">జీసస్ బిలీవర్స్ అసోసియేషన్, ఆంధ్ర ప్రదేశ్</p>
    </div>

    <ion-list no-lines style="margin: 0; padding: 0 4px 24px 4px;">
      <button ion-item *ngFor="let a of pages" (click)="openPage(a.page)" menuToggle class="jbac-menu-item">
        <ion-avatar item-start class="jbac-menu-avatar">
          <img [src]="a.image">
        </ion-avatar>
        <ion-label class="jbac-menu-label">
          <div class="jbac-menu-title">{{a.title}}</div>
          <div *ngIf="a.subtitle" class="jbac-menu-sub">{{a.subtitle}}</div>
        </ion-label>
        <ion-icon name="ios-arrow-forward" item-end class="jbac-menu-arrow"></ion-icon>
      </button>
    </ion-list>
  </ion-content>
</ion-menu>

<!-- Disable swipe-to-go-back because it's poor UX to combine STGB with side menus -->
<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>
`;
fs.writeFileSync(appHtmlPath, newAppHtml, 'utf8');
console.log('[OK] Updated src/app/app.html with clean layout');

console.log('=== Step 5: Updating src/app/app.scss ===');
const appScssPath = path.join(mobileAppDir, 'src', 'app', 'app.scss');
let appScss = fs.readFileSync(appScssPath, 'utf8');

const oldMenuInner = /\.menu-inner\s*\{[\s\S]*?width:\s*35%\s*!important;[\s\S]*?\}/;
const newMenuInnerStyles = `.menu-inner {
    border-radius: 0px 20px 20px 0px;
    width: 310px !important;
    max-width: 85vw !important;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25) !important;
}

.jbac-menu-item {
    background: #ffffff !important;
    border-radius: 10px !important;
    margin: 5px 8px !important;
    padding: 6px 12px !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03) !important;
}

.jbac-menu-avatar {
    min-width: 40px !important;
    width: 40px !important;
    height: 40px !important;
    margin: 4px 12px 4px 0 !important;
    background: #eef5fb !important;
    border-radius: 10px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 6px !important;

    img {
        width: 26px !important;
        height: 26px !important;
        object-fit: contain !important;
    }
}

.jbac-menu-label {
    margin: 6px 0 !important;
    white-space: normal !important;
    overflow: visible !important;
}

.jbac-menu-title {
    font-size: 14px !important;
    font-weight: 700 !important;
    color: #1e293b !important;
    line-height: 1.4 !important;
    word-break: break-word !important;
    font-family: 'Ramabhadra', sans-serif !important;
}

.jbac-menu-sub {
    font-size: 11.5px !important;
    color: #64748b !important;
    margin-top: 2px !important;
    line-height: 1.25 !important;
}

.jbac-menu-arrow {
    font-size: 16px !important;
    color: #94a3b8 !important;
    margin-left: 6px !important;
}`;

if (oldMenuInner.test(appScss)) {
  appScss = appScss.replace(oldMenuInner, newMenuInnerStyles);
  console.log('[OK] Replaced 35% width in app.scss with 310px and clean menu item styles');
} else {
  appScss += '\n\n' + newMenuInnerStyles;
  console.log('[OK] Appended new menu styles to app.scss');
}
fs.writeFileSync(appScssPath, appScss, 'utf8');

console.log('=== Mobile source files successfully updated! ===');
