const fs = require('fs');
const path = require('path');

const mobileAppDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const targetDirs = [
  path.join(mobileAppDir, 'www', 'build'),
  path.join(mobileAppDir, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build')
];

for (const buildDir of targetDirs) {
  if (!fs.existsSync(buildDir)) {
    console.log('[SKIP] Directory does not exist:', buildDir);
    continue;
  }
  console.log('\n=== Patching bundles in:', buildDir, '===');

  // 1. PATCH 1.js (HomePage)
  const oneJsPath = path.join(buildDir, '1.js');
  if (fs.existsSync(oneJsPath)) {
    let oneJs = fs.readFileSync(oneJsPath, 'utf8');

    // Check syntax of current 1.js; if invalid or corrupted, restore from git baseline
    const vm = require('vm');
    let isValid = false;
    try {
      new vm.Script(oneJs);
      isValid = true;
    } catch (e) {
      isValid = false;
    }

    if (!isValid) {
      console.log('  [RESTORE] Restoring clean 1.js from git baseline (was corrupted)...');
      const { execSync } = require('child_process');
      oneJs = execSync('git show 9f14c30:www/build/1.js', { cwd: mobileAppDir, maxBuffer: 10 * 1024 * 1024 }).toString();
    }

    // Replace the blocking confirm_19 check in 1.js
    const old19Pattern = /else\s+if\s*\(\s*id\s*==\s*19\s*\)\s*\{[\s\S]*?var\s+confirm_19[\s\S]*?this\.navCtrl\.push\(\s*['"]FamilyCouncellingPage['"]\s*\);\s*\}\s*\}/;
    if (old19Pattern.test(oneJs)) {
      oneJs = oneJs.replace(old19Pattern, `else if (id == 19) {
            this.navCtrl.push('FamilyCouncellingPage');
        }
        else if (id == 20) {
            this.navCtrl.push('MarriagePage');
        }`);
      console.log('  [OK] Removed blocking alert on id == 19 and added id == 20 in 1.js');
    } else if (oneJs.includes('id == 19') && !oneJs.includes('id == 20')) {
      oneJs = oneJs.replace("this.navCtrl.push('FamilyCouncellingPage');", "this.navCtrl.push('FamilyCouncellingPage');\n        }\n        else if (id == 20) {\n            this.navCtrl.push('MarriagePage');");
      console.log('  [OK] Added id == 20 in 1.js');
    }

    // Add gotopage(20) tile into the inlined template in 1.js if missing
    if (!oneJs.includes('gotopage(20)')) {
      const normalTargetCol = '<ion-col col-3 class="made" (click)="gotopage(19)">';
      const newColNormal = '\\n\\n    <ion-col col-3 class="made" (click)="gotopage(20)">\\n      <img style="padding:3%;width:100%" src="assets/icon/svg/register.svg">\\n      <b>వివాహ<br>సంబంధాలు</b>\\n    </ion-col>';

      if (oneJs.includes(normalTargetCol)) {
        const idx = oneJs.indexOf(normalTargetCol);
        const endColIdx = oneJs.indexOf('</ion-col>', idx);
        if (endColIdx !== -1) {
          oneJs = oneJs.slice(0, endColIdx + 10) + newColNormal + oneJs.slice(endColIdx + 10);
          console.log('  [OK] Injected gotopage(20) marriage tile into 1.js template');
        }
      }
    }

    // Verify syntax before writing
    try {
      new vm.Script(oneJs);
      fs.writeFileSync(oneJsPath, oneJs, 'utf8');
      console.log('  [OK] 1.js syntax verified and written successfully');
    } catch (err) {
      throw new Error('1.js syntax verification failed: ' + err.message);
    }
  }

  // 2. PATCH 0.js (LoginPage or fallback chunk)
  const zeroJsPath = path.join(buildDir, '0.js');
  if (fs.existsSync(zeroJsPath)) {
    let zeroJs = fs.readFileSync(zeroJsPath, 'utf8');
    const old19InZero = /else\s+if\s*\(\s*id\s*==\s*19\s*\)\s*\{[\s\S]*?var\s+confirm_19[\s\S]*?this\.navCtrl\.push\(\s*['"]FamilyCouncellingPage['"]\s*\);\s*\}\s*\}/;
    if (old19InZero.test(zeroJs)) {
      zeroJs = zeroJs.replace(old19InZero, `else if (id == 19) {
            this.navCtrl.push('FamilyCouncellingPage');
        }
        else if (id == 20) {
            this.navCtrl.push('MarriagePage');
        }`);
      console.log('  [OK] Cleaned id == 19 in 0.js');
    } else if (!zeroJs.includes('id == 20') && zeroJs.includes('id == 19')) {
      zeroJs = zeroJs.replace("this.navCtrl.push('FamilyCouncellingPage');", "this.navCtrl.push('FamilyCouncellingPage');\n        }\n        else if (id == 20) {\n            this.navCtrl.push('MarriagePage');");
      console.log('  [OK] Added id == 20 to 0.js');
    }
    const vm = require('vm');
    new vm.Script(zeroJs);
    fs.writeFileSync(zeroJsPath, zeroJs, 'utf8');
    console.log('  [OK] 0.js syntax verified and written successfully');
  }

  // 3. PATCH main.js (MyApp pages & inlined app.html template)
  const mainJsPath = path.join(buildDir, 'main.js');
  if (fs.existsSync(mainJsPath)) {
    let mainJs = fs.readFileSync(mainJsPath, 'utf8');

    const vm = require('vm');
    let isMainValid = false;
    try {
      new vm.Script(mainJs);
      isMainValid = true;
    } catch (e) {
      isMainValid = false;
    }

    if (!isMainValid) {
      console.log('  [RESTORE] Restoring clean main.js from git baseline (was corrupted)...');
      const { execSync } = require('child_process');
      mainJs = execSync('git show 9f14c30:www/build/main.js', { cwd: mobileAppDir, maxBuffer: 10 * 1024 * 1024 }).toString();
    }

    // Replace this.pages array in main.js
    const pagesPattern = /this\.pages\s*=\s*\[[\s\S]*?\];/;
    const newPagesBundle = `this.pages = [
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
            { 'title': 'మమ్మల్ని సంప్రదించండి', 'subtitle': 'Contact JBAC Helpline', 'image': 'assets/icon/svg/contact-us.svg', 'page': 'ContactPage' }
        ];`;

    if (pagesPattern.test(mainJs)) {
      mainJs = mainJs.replace(pagesPattern, newPagesBundle);
      console.log('  [OK] Replaced this.pages array in main.js');
    }

    // Replace inlined app.html template in main.js
    const appHtmlTemplatePattern = /<ion-menu\s+\[content\]="content"[\s\S]*?<\/ion-nav>/;
    const newInlinedAppHtml = `<ion-menu [content]="content" type="overlay">\\n  <ion-header>\\n    <ion-toolbar style="background-color: #00548F; color: white;">\\n      <ion-title style="color: white; font-weight: bold; font-size: 17px; text-align: center;">\\n        JBAC మెనూ (Menu)\\n      </ion-title>\\n    </ion-toolbar>\\n  </ion-header>\\n\\n  <ion-content style="background-color: #f4f7fb;">\\n    <div style="background: linear-gradient(135deg, #00548F, #19386d); padding: 18px 16px; color: white; text-align: left; margin-bottom: 8px;">\\n      <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: white;">Welcome to JBAC</h3>\\n      <p style="margin: 4px 0 0; font-size: 12px; color: #dbeafe;">జీసస్ బిలీవర్స్ అసోసియేషన్, ఆంధ్ర ప్రదేశ్</p>\\n    </div>\\n\\n    <ion-list no-lines style="margin: 0; padding: 0 4px 24px 4px;">\\n      <button ion-item *ngFor="let a of pages" (click)="openPage(a.page)" menuToggle class="jbac-menu-item">\\n        <ion-avatar item-start class="jbac-menu-avatar">\\n          <img [src]="a.image">\\n        </ion-avatar>\\n        <ion-label class="jbac-menu-label">\\n          <div class="jbac-menu-title">{{a.title}}</div>\\n          <div *ngIf="a.subtitle" class="jbac-menu-sub">{{a.subtitle}}</div>\\n        </ion-label>\\n        <ion-icon name="ios-arrow-forward" item-end class="jbac-menu-arrow"></ion-icon>\\n      </button>\\n    </ion-list>\\n  </ion-content>\\n</ion-menu>\\n\\n<!-- Disable swipe-to-go-back because it is poor UX to combine STGB with side menus -->\\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>`;

    if (appHtmlTemplatePattern.test(mainJs)) {
      mainJs = mainJs.replace(appHtmlTemplatePattern, newInlinedAppHtml);
      console.log('  [OK] Replaced inlined app.html template in main.js');
    }

    try {
      new vm.Script(mainJs);
      fs.writeFileSync(mainJsPath, mainJs, 'utf8');
      console.log('  [OK] main.js syntax verified and written successfully');
    } catch (err) {
      throw new Error('main.js syntax verification failed: ' + err.message);
    }
  }

  // 4. PATCH main.css (Side drawer width and typography styles)
  const mainCssPath = path.join(buildDir, 'main.css');
  if (fs.existsSync(mainCssPath)) {
    let mainCss = fs.readFileSync(mainCssPath, 'utf8');

    // If mainCss was accidentally truncated previously, restore original from git
    if (mainCss.length < 500000) {
      console.log('  [RESTORE] Restoring full original main.css from git baseline (was truncated)...');
      const { execSync } = require('child_process');
      mainCss = execSync('git show 9f14c30:www/build/main.css', { cwd: mobileAppDir, maxBuffer: 10 * 1024 * 1024 }).toString();
    }

    const exactOldBlockLF = '.menu-inner {\n  border-radius: 0px 20px 20px 0px;\n  width: 35% !important;\n}';
    const exactOldBlockCRLF = '.menu-inner {\r\n  border-radius: 0px 20px 20px 0px;\r\n  width: 35% !important;\r\n}';

    const newMenuCss = `.menu-inner {
  border-radius: 0px 20px 20px 0px;
  width: 310px !important;
  max-width: 85vw !important;
  -webkit-box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25) !important;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25) !important;
}

.jbac-menu-item {
  background: #ffffff !important;
  border-radius: 10px !important;
  margin: 5px 8px !important;
  padding: 6px 12px !important;
  border: 1px solid #e2e8f0 !important;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03) !important;
}

.jbac-menu-avatar {
  min-width: 40px !important;
  width: 40px !important;
  height: 40px !important;
  margin: 4px 12px 4px 0 !important;
  background: #eef5fb !important;
  border-radius: 10px !important;
  display: -webkit-box !important;
  display: -webkit-flex !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-box-align: center !important;
  -webkit-align-items: center !important;
  -ms-flex-align: center !important;
  align-items: center !important;
  -webkit-box-pack: center !important;
  -webkit-justify-content: center !important;
  -ms-flex-pack: center !important;
  justify-content: center !important;
  padding: 6px !important;
}

.jbac-menu-avatar img {
  width: 26px !important;
  height: 26px !important;
  object-fit: contain !important;
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
  font-family: "Ramabhadra", sans-serif !important;
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

    if (mainCss.includes(exactOldBlockLF)) {
      mainCss = mainCss.replace(exactOldBlockLF, newMenuCss);
      console.log('  [OK] Replaced 35% width in main.css with 310px and clean menu item styles (LF)');
    } else if (mainCss.includes(exactOldBlockCRLF)) {
      mainCss = mainCss.replace(exactOldBlockCRLF, newMenuCss);
      console.log('  [OK] Replaced 35% width in main.css with 310px and clean menu item styles (CRLF)');
    } else if (!mainCss.includes('.jbac-menu-item')) {
      mainCss += '\n\n' + newMenuCss;
      console.log('  [OK] Appended new menu styles to main.css');
    }

    if (!mainCss.includes('.made') || !mainCss.includes('.pagecss') || mainCss.length < 500000) {
      throw new Error('main.css integrity check failed: core classes missing or size under 500KB!');
    }

    fs.writeFileSync(mainCssPath, mainCss, 'utf8');
    console.log('  [OK] main.css written successfully with length:', mainCss.length);
  }
}

console.log('\n=== All mobile bundles successfully patched! ===');
