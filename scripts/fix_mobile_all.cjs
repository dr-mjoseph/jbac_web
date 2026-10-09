const fs = require('fs');
const path = require('path');

const mobileAppDir = 'C:/Users/rajes/StudioProjects/jbac_app';

console.log('================================================================');
console.log('Fixing Mobile UI: Side Panel, Marriage Counselling, and Bundles');
console.log('================================================================');

// 1. UPDATE src/app/app.html
const appHtmlPath = path.join(mobileAppDir, 'src/app/app.html');
const newAppHtml = `<ion-menu [content]="content" type="overlay">
  <ion-header>
    <ion-toolbar style="background-color: #00548F; color: white;">
      <ion-title style="color: white; font-weight: bold; font-size: 17px; text-align: center;">
        JBAC మెనూ (Menu)
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content style="background-color: #f4f7fb;">
    <div style="background: linear-gradient(135deg, #00548F, #19386d); padding: 18px 14px; color: white; text-align: center; margin-bottom: 6px;">
      <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: white;">Welcome to JBAC</h3>
      <p style="margin: 4px 0 0; font-size: 11px; color: #dbeafe;">జీసస్ బిలీవర్స్ అసోసియేషన్, ఆంధ్ర ప్రదేశ్</p>
    </div>

    <ion-list no-lines style="margin: 0; padding: 0;">
      <button ion-item *ngFor="let a of pages" (click)="openPage(a.page)" menuToggle style="background: white; border-bottom: 1px solid #e2e8f0; padding: 6px 12px; margin-bottom: 2px;">
        <ion-avatar item-start style="min-width: 40px; width: 40px; height: 40px; margin: 4px 12px 4px 0; background: #eef5fb; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 5px;">
          <img [src]="a.image" style="width: 26px; height: 26px; object-fit: contain;">
        </ion-avatar>
        <span style="font-size: 13.5px; font-weight: bold; color: #1e293b; white-space: normal; line-height: 1.4; display: block;">
          {{a.title}}
        </span>
        <ion-icon name="arrow-forward" item-end style="font-size: 15px; color: #94a3b8;"></ion-icon>
      </button>
    </ion-list>
  </ion-content>
</ion-menu>

<!-- Disable swipe-to-go-back because it's poor UX to combine STGB with side menus -->
<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>
`;

fs.writeFileSync(appHtmlPath, newAppHtml, 'utf8');
console.log('[OK] Updated src/app/app.html with clean list drawer layout');

// 2. UPDATE src/app/app.component.ts
const appTsPath = path.join(mobileAppDir, 'src/app/app.component.ts');
let appTs = fs.readFileSync(appTsPath, 'utf8');

const pagesArrayCode = `this.pages = [
      { 'title': 'వివాహ & కుటుంబ కౌన్సిలింగ్ (Marriage Counselling)', 'image': 'assets/icon/svg/couple.svg', 'page': 'FamilyCouncellingPage' },
      { 'title': 'మీకు మా సహాయం', 'image': 'assets/icon/svg/helping-hand.svg', 'page': 'HelpinghandsPage' },
      { 'title': 'చర్చి పర్మిషన్ గవర్నమెంట్ ఆర్డర్స్', 'image': 'assets/icon/svg/governmental.svg', 'page': 'ChurchgoPage' },
      { 'title': 'వెబ్ సైట్ ఎలా ఉపయోగించాలి', 'image': 'assets/icon/svg/cloud-computing.svg', 'page': 'WebhelpPage' },
      { 'title': 'మీ చర్చికి మా టెక్నికల్ సొల్యూషన్స్', 'image': 'assets/icon/svg/employee.svg', 'page': 'TechsolPage' },
      { 'title': 'ఫోటో గ్యాలరీ', 'image': 'assets/icon/svg/picture.svg', 'page': 'GalleryPage' },
      { 'title': 'వీడియో గ్యాలరీ', 'image': 'assets/icon/svg/video.svg', 'page': 'VideoGalleryPage' },
      { 'title': 'క్రైస్తవులకు సంబంధించిన వార్తలు పెట్టండి', 'image': 'assets/icon/svg/news.svg', 'page': 'NewsPage' },
      { 'title': 'క్రైస్తవులపై దాడుల నమోదు', 'image': 'assets/icon/svg/organisation.svg', 'page': 'AddattacksPage' },
      { 'title': 'JBAC వింగ్స్ సమాచారం', 'image': 'assets/icon/svg/project-manager.svg', 'page': 'WingPage' },
      { 'title': 'మమ్మల్ని సంప్రదించండి', 'image': 'assets/icon/svg/contact-us.svg', 'page': 'ContactPage' },
    ];`;

const pagesRegex = /this\.pages\s*=\s*\[[\s\S]*?\];/;
if (pagesRegex.test(appTs)) {
  appTs = appTs.replace(pagesRegex, pagesArrayCode);
  fs.writeFileSync(appTsPath, appTs, 'utf8');
  console.log('[OK] Updated src/app/app.component.ts with clean UTF-8 pages and Marriage Counselling');
} else {
  console.log('[WARN] Could not find this.pages regex in src/app/app.component.ts');
}

// 3. UPDATE src/pages/home/home.html
const homeHtmlPath = path.join(mobileAppDir, 'src/pages/home/home.html');
let homeHtml = fs.readFileSync(homeHtmlPath, 'utf8');

// Ensure banner has Marriage & Family Counselling
const bannerHtml = `
  <div style="margin: 8px 12px; padding: 12px 14px; background: linear-gradient(135deg, #00548F, #1f376e); border-radius: 12px; color: white; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 10px rgba(0,84,143,0.25); cursor: pointer;" (click)="gotopage(19)">
    <div style="display: flex; align-items: center;">
      <div style="background: rgba(255,255,255,0.2); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 22px;">
        💍
      </div>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; color: #ffeb3b;">
          📢 నూతన సేవ • NEW SERVICE
        </div>
        <div style="font-size: 14px; font-weight: bold; margin-top: 2px;">
          వివాహ & కుటుంబ కౌన్సిలింగ్ (Marriage Counselling)
        </div>
      </div>
    </div>
    <div style="font-size: 20px; font-weight: bold; padding-left: 8px; color: #ffeb3b;">
      ➔
    </div>
  </div>`;

// Replace or inject banner before grid
if (homeHtml.includes('gotopage(19)') && homeHtml.includes('NEW SERVICE')) {
  homeHtml = homeHtml.replace(/<div style="margin:\s*8px 12px;[\s\S]*?➔\s*<\/div>\s*<\/div>/, bannerHtml);
} else {
  homeHtml = homeHtml.replace('<ion-row style="text-align: center;">', bannerHtml + '\n\n  <ion-row style="text-align: center;">');
}

// Ensure the Marriage Counselling grid tile is in the first row or early
const gridTileHtml = `
    <ion-col col-3 class="made" (click)="gotopage(19)">
      <img style="padding:3%;width:100%" src="assets/icon/svg/couple.svg" onerror="this.onerror=null;this.src='assets/icon/svg/helping-hand.svg';">
      <b>వివాహ & కుటుంబ<br>కౌన్సిలింగ్</b>
    </ion-col>`;

// Remove existing grid tile if present elsewhere to avoid duplicates
homeHtml = homeHtml.replace(/<ion-col col-3 class="made" \(click\)="gotopage\(19\)">[\s\S]*?<\/ion-col>/g, '');

// Place it right after Helpinghands gotopage(10)
const helpingHandsTarget = `(click)="gotopage(10)">
      <img style="padding:3%;width:100%" src="assets/icon/svg/helping-hand.svg">
      <b>మా సహాయం </b>
    </ion-col>`;

if (homeHtml.includes(helpingHandsTarget)) {
  homeHtml = homeHtml.replace(helpingHandsTarget, helpingHandsTarget + '\n' + gridTileHtml);
  console.log('[OK] Inserted Marriage Counselling tile right in primary grid row');
} else {
  // Append after first row opening
  homeHtml = homeHtml.replace('<ion-row style="text-align: center;">', '<ion-row style="text-align: center;">\n' + gridTileHtml);
  console.log('[OK] Inserted Marriage Counselling tile at start of grid');
}

fs.writeFileSync(homeHtmlPath, homeHtml, 'utf8');
console.log('[OK] Updated src/pages/home/home.html');

// Helper to escape HTML for JS template literal
function escapeForJsString(html) {
  return html
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n');
}

const escapedAppHtml = escapeForJsString(newAppHtml);
const escapedHomeHtml = escapeForJsString(homeHtml);

// 4. PATCH COMPILED BUNDLES
const buildDirs = [
  path.join(mobileAppDir, 'www/build'),
  path.join(mobileAppDir, 'platforms/android/app/src/main/assets/www/build')
];

for (const buildDir of buildDirs) {
  if (!fs.existsSync(buildDir)) {
    console.log(`[SKIP] Directory does not exist: ${buildDir}`);
    continue;
  }
  console.log(`\nPatching bundle directory: ${buildDir}`);

  // --- A. PATCH main.js ---
  const mainJsPath = path.join(buildDir, 'main.js');
  if (fs.existsSync(mainJsPath)) {
    let mainJs = fs.readFileSync(mainJsPath, 'utf8');

    // 1. Patch MyApp template (app.html)
    const appTemplatePattern = /\/\*ion-inline-start:"[^"]*app\.html"\*\/[\s\S]*?\/\*ion-inline-end:"[^"]*app\.html"\*\//;
    if (appTemplatePattern.test(mainJs)) {
      const replacementTemplate = `/*ion-inline-start:"${appHtmlPath.replace(/\\/g, '\\\\')}"*/'${escapedAppHtml}'/*ion-inline-end:"${appHtmlPath.replace(/\\/g, '\\\\')}"*/`;
      mainJs = mainJs.replace(appTemplatePattern, replacementTemplate);
      console.log('  [OK] Patched main.js: Inlined clean drawer template');
    } else {
      console.log('  [WARN] app.html template marker not found in main.js');
    }

    // 2. Patch this.pages in main.js
    const compiledPagesPattern = /this\.pages\s*=\s*\[[\s\S]*?\];/;
    const replacementCompiledPages = `this.pages = [
            { 'title': 'వివాహ & కుటుంబ కౌన్సిలింగ్', 'image': 'assets/icon/svg/couple.svg', 'page': 'FamilyCouncellingPage' },
            { 'title': 'మీకు మా సహాయం', 'image': 'assets/icon/svg/helping-hand.svg', 'page': 'HelpinghandsPage' },
            { 'title': 'చర్చి పర్మిషన్ గవర్నమెంట్ ఆర్డర్స్', 'image': 'assets/icon/svg/governmental.svg', 'page': 'ChurchgoPage' },
            { 'title': 'వెబ్ సైట్ ఎలా ఉపయోగించాలి', 'image': 'assets/icon/svg/cloud-computing.svg', 'page': 'WebhelpPage' },
            { 'title': 'మీ చర్చికి మా టెక్నికల్ సొల్యూషన్స్', 'image': 'assets/icon/svg/employee.svg', 'page': 'TechsolPage' },
            { 'title': 'ఫోటో గ్యాలరీ', 'image': 'assets/icon/svg/picture.svg', 'page': 'GalleryPage' },
            { 'title': 'వీడియో గ్యాలరీ', 'image': 'assets/icon/svg/video.svg', 'page': 'VideoGalleryPage' },
            { 'title': 'క్రైస్తవులకు సంబంధించిన వార్తలు పెట్టండి', 'image': 'assets/icon/svg/news.svg', 'page': 'NewsPage' },
            { 'title': 'క్రైస్తవులపై దాడుల నమోదు', 'image': 'assets/icon/svg/organisation.svg', 'page': 'AddattacksPage' },
            { 'title': 'JBAC వింగ్స్ సమాచారం', 'image': 'assets/icon/svg/project-manager.svg', 'page': 'WingPage' },
            { 'title': 'మమ్మల్ని సంప్రదించండి', 'image': 'assets/icon/svg/contact-us.svg', 'page': 'ContactPage' }
        ];`;

    if (compiledPagesPattern.test(mainJs)) {
      mainJs = mainJs.replace(compiledPagesPattern, replacementCompiledPages);
      console.log('  [OK] Patched main.js: Replaced this.pages with clean UTF-8 Telugu and Marriage Counselling');
    } else {
      console.log('  [WARN] this.pages pattern not found in main.js');
    }

    // 3. Ensure FamilyCouncellingPage in DeeplinkConfig
    if (!mainJs.includes("'FamilyCouncellingPage'")) {
      const dlTarget = "{ loadChildren: '../pages/helpinghands/helpinghands.module#HelpinghandsPageModule', name: 'HelpinghandsPage', segment: 'helpinghands', priority: 'low', defaultHistory: [] },";
      const fcDeeplink = "{ loadChildren: '../pages/family-councelling/family-councelling.module#FamilyCouncellingPageModule', name: 'FamilyCouncellingPage', segment: 'family-councelling', priority: 'low', defaultHistory: [] },\n                        ";
      if (mainJs.includes(dlTarget)) {
        mainJs = mainJs.replace(dlTarget, fcDeeplink + dlTarget);
        console.log('  [OK] Patched main.js: Registered FamilyCouncellingPage in DeeplinkConfig');
      }
    }

    // 4. Ensure ServiceProvider endpoints
    if (!mainJs.includes('doctorvoicereply')) {
      const injectTarget = 'ServiceProvider = __decorate([';
      const methodsToInject = `    ServiceProvider.prototype.getcouncellingdoctors = function () {
        return this.http.post(this.testApi + 'getcouncellingdoctors', {});
    };
    ServiceProvider.prototype.savecouncellingdoctor = function (data) {
        return this.http.post(this.testApi + 'savecouncellingdoctor', data);
    };
    ServiceProvider.prototype.deletecouncellingdoctor = function (data) {
        return this.http.post(this.testApi + 'deletecouncellingdoctor', data);
    };
    ServiceProvider.prototype.getcouncellingappointments = function (data) {
        return this.http.post(this.testApi + 'getcouncellingappointments', data);
    };
    ServiceProvider.prototype.bookcouncellingappointment = function (data) {
        return this.http.post(this.testApi + 'bookcouncellingappointment', data);
    };
    ServiceProvider.prototype.updateappointmentstatus = function (data) {
        return this.http.post(this.testApi + 'updateappointmentstatus', data);
    };
    ServiceProvider.prototype.registercouncellingdoctor = function (data) {
        return this.http.post(this.testApi + 'registerdoctor', data);
    };
    ServiceProvider.prototype.doctorvoicereply = function (data) {
        return this.http.post(this.testApi + 'doctorvoicereply', data);
    };
    ServiceProvider.prototype.getcouncellingvoicemessages = function (data) {
        return this.http.post(this.testApi + 'getcouncellingvoicemessages', data);
    };
    `;
      if (mainJs.includes(injectTarget)) {
        mainJs = mainJs.replace(injectTarget, methodsToInject + injectTarget);
        console.log('  [OK] Patched main.js: Injected ServiceProvider endpoints');
      }
    }

    fs.writeFileSync(mainJsPath, mainJs, 'utf8');
    console.log('  [DONE] main.js successfully written');
  }

  // --- B. PATCH 0.js ---
  const zeroJsPath = path.join(buildDir, '0.js');
  if (fs.existsSync(zeroJsPath)) {
    let zeroJs = fs.readFileSync(zeroJsPath, 'utf8');

    // 1. Replace HomePage inlined template with updated homeHtml
    const homeTemplatePattern = /\/\*ion-inline-start:"[^"]*home\.html"\*\/[\s\S]*?\/\*ion-inline-end:"[^"]*home\.html"\*\//;
    if (homeTemplatePattern.test(zeroJs)) {
      const replacementHomeTemplate = `/*ion-inline-start:"${homeHtmlPath.replace(/\\/g, '\\\\')}"*/'${escapedHomeHtml}'/*ion-inline-end:"${homeHtmlPath.replace(/\\/g, '\\\\')}"*/`;
      zeroJs = zeroJs.replace(homeTemplatePattern, replacementHomeTemplate);
      console.log('  [OK] Patched 0.js: Inlined updated home.html template with Marriage Counselling banner & grid tile');
    } else {
      console.log('  [WARN] home.html template marker not found in 0.js');
    }

    // 2. Ensure id == 19 navigation is present
    if (!zeroJs.includes('id == 19')) {
      const targetPattern = /else\s+if\s*\(\s*id\s*==\s*18\s*\)\s*\{[^}]*this\.navCtrl\.push\(\s*['"]AddattacksPage['"]\s*\);\s*\}/;
      const match = zeroJs.match(targetPattern);
      if (match) {
        const replacement = match[0] + "\n        else if (id == 19) {\n            this.navCtrl.push('FamilyCouncellingPage');\n        }";
        zeroJs = zeroJs.replace(targetPattern, replacement);
        console.log('  [OK] Patched 0.js: added id == 19 -> FamilyCouncellingPage');
      }
    }

    fs.writeFileSync(zeroJsPath, zeroJs, 'utf8');
    console.log('  [DONE] 0.js successfully written');
  }
}

// 5. Ensure 49.js exists and is up to date
console.log('\nRunning patch_mobile_bundles.cjs to compile 49.js and sync all voice features...');
require('./patch_mobile_bundles.cjs');

console.log('\n================================================================');
console.log('ALL MOBILE FIXES APPLIED SUCCESSFULLY!');
console.log('================================================================');
