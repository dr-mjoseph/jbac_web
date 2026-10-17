const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appRoot = 'C:/Users/rajes/StudioProjects/jbac_app';

console.log('=== Patching Family Counselling in Mobile App ===');

// 1. Update src/pages/family-councelling/family-councelling.html
const srcHtmlPath = path.join(appRoot, 'src/pages/family-councelling/family-councelling.html');
if (fs.existsSync(srcHtmlPath)) {
  let html = fs.readFileSync(srcHtmlPath, 'utf8');

  // Replace segment toolbar
  const oldSegRegex = /<ion-segment\s+\[\(ngModel\)\]="viewMode"[\s\S]*?<\/ion-segment>/;
  const newSeg = `<ion-segment [(ngModel)]="viewMode" (ionChange)="onTabChange(viewMode)" color="primary">
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

  if (oldSegRegex.test(html)) {
    html = html.replace(oldSegRegex, newSeg);
    console.log('[OK] Updated segment in src family-councelling.html');
  }

  // Doctor workspace banner: strictly require isLoggedIn && (isDoctor || isAdmin)
  html = html.replace(
    /\*ngIf="\(isDoctor \|\| isAdmin\) && viewMode !== 'book_now'"/g,
    `*ngIf="isLoggedIn && (isDoctor || isAdmin) && viewMode !== 'book_now'"`
  );

  // Guest banner: Ensure button is clear and responsive
  html = html.replace(
    /రిజిస్టర్ అవ్వండి<\/button>/g,
    `రిజిస్టర్ చేసుకోండి (Register Here)</button>`
  );

  // Guard tab content containers
  html = html.replace(
    /\*ngIf="viewMode === 'my_bookings'"/g,
    `*ngIf="viewMode === 'my_bookings' && isLoggedIn"`
  );
  html = html.replace(
    /\*ngIf="viewMode === 'doctor_profile' && \(isDoctor \|\| isAdmin\)"/g,
    `*ngIf="viewMode === 'doctor_profile' && isLoggedIn && (isDoctor || isAdmin)"`
  );
  html = html.replace(
    /\*ngIf="viewMode === 'doctor_schedule' && \(isDoctor \|\| isAdmin\)"/g,
    `*ngIf="viewMode === 'doctor_schedule' && isLoggedIn && (isDoctor || isAdmin)"`
  );

  fs.writeFileSync(srcHtmlPath, html, 'utf8');
  console.log('[OK] Saved src family-councelling.html');
}

// 2. Update src/pages/family-councelling/family-councelling.ts
const srcTsPath = path.join(appRoot, 'src/pages/family-councelling/family-councelling.ts');
if (fs.existsSync(srcTsPath)) {
  let ts = fs.readFileSync(srcTsPath, 'utf8');

  // Replace ionViewWillEnter implementation
  const enterRegex = /ionViewWillEnter\(\)\s*\{[\s\S]*?this\.loadDoctors\(\);/;
  const newEnter = `ionViewWillEnter() {
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

    this.loadDoctors();`;

  if (enterRegex.test(ts)) {
    ts = ts.replace(enterRegex, newEnter);
    console.log('[OK] Updated ionViewWillEnter in src family-councelling.ts');
  }

  // Update onTabChange method
  const tabChangeRegex = /onTabChange\s*\(\s*tab[^)]*\)\s*\{[\s\S]*?if\s*\(tab\s*===\s*'my_bookings'\)/;
  const newTabChange = `onTabChange(tab: any) {
    if (!this.isLoggedIn && (tab === 'my_bookings' || tab === 'doctor_profile' || tab === 'doctor_schedule')) {
      this.viewMode = 'browse';
      const alert = this.alertCtrl.create({
        title: 'లాగిన్ అవ్వండి (Login Required)',
        subTitle: 'ఈ వివరాలు చూడడానికి దయచేసి ముందుగా లాగిన్ అవ్వండి.',
        buttons: [
          { text: 'రద్దు (Cancel)', role: 'cancel' },
          {
            text: 'లాగిన్ (Login)',
            handler: () => {
              this.navCtrl.push('LoginPage', { redirect: 'FamilyCouncellingPage' });
            }
          }
        ]
      });
      alert.present();
      return;
    }
    if (tab === 'my_bookings')`;

  if (tabChangeRegex.test(ts)) {
    ts = ts.replace(tabChangeRegex, newTabChange);
    console.log('[OK] Updated onTabChange in src family-councelling.ts');
  }

  fs.writeFileSync(srcTsPath, ts, 'utf8');
  console.log('[OK] Saved src family-councelling.ts');
}

// 3. Patch both compiled bundles: 51.js and 49.js in both www and platforms/android assets
const targetChunks = [
  path.join(appRoot, 'www/build/51.js'),
  path.join(appRoot, 'platforms/android/app/src/main/assets/www/build/51.js'),
  path.join(appRoot, 'www/build/49.js'),
  path.join(appRoot, 'platforms/android/app/src/main/assets/www/build/49.js')
];

for (const chunkPath of targetChunks) {
  if (!fs.existsSync(chunkPath)) continue;
  let code = fs.readFileSync(chunkPath, 'utf8');

  // Update segment toolbar in compiled template
  const compiledSegRegex = /<ion-segment\s+\[\(ngModel\)\]="viewMode"[\s\S]*?<\/ion-segment>/;
  const newCompiledSeg = `<ion-segment [(ngModel)]="viewMode" (ionChange)="onTabChange(viewMode)" color="primary">\\n      <ion-segment-button value="browse">\\n        కౌన్సిలర్లు\\n      </ion-segment-button>\\n      <ion-segment-button value="my_bookings" *ngIf="isLoggedIn && !isDoctor">\\n        నా బుకింగ్స్\\n      </ion-segment-button>\\n      <ion-segment-button value="doctor_schedule" *ngIf="isLoggedIn && (isDoctor || isAdmin)">\\n        షెడ్యూల్\\n      </ion-segment-button>\\n      <ion-segment-button value="doctor_profile" *ngIf="isLoggedIn && (isDoctor || isAdmin)">\\n        ప్రొఫైల్ అప్డేట్\\n      </ion-segment-button>\\n    </ion-segment>`;

  if (compiledSegRegex.test(code)) {
    code = code.replace(compiledSegRegex, newCompiledSeg);
  }

  // Doctor workspace banner: require isLoggedIn
  code = code.replace(
    /\*ngIf="\(isDoctor \|\| isAdmin\) && viewMode !== 'book_now'"/g,
    `*ngIf="isLoggedIn && (isDoctor || isAdmin) && viewMode !== 'book_now'"`
  );

  // Guest banner: Ensure button is clear and responsive
  code = code.replace(
    /రిజిస్టర్ అవ్వండి<\/button>/g,
    `రిజిస్టర్ చేసుకోండి (Register Here)</button>`
  );

  // Tab content container guards
  code = code.replace(
    /\*ngIf="viewMode === 'my_bookings'"/g,
    `*ngIf="viewMode === 'my_bookings' && isLoggedIn"`
  );
  code = code.replace(
    /\*ngIf="viewMode === 'doctor_profile' && \(isDoctor \|\| isAdmin\)"/g,
    `*ngIf="viewMode === 'doctor_profile' && isLoggedIn && (isDoctor || isAdmin)"`
  );
  code = code.replace(
    /\*ngIf="viewMode === 'doctor_schedule' && \(isDoctor \|\| isAdmin\)"/g,
    `*ngIf="viewMode === 'doctor_schedule' && isLoggedIn && (isDoctor || isAdmin)"`
  );

  // Update ionViewWillEnter in JS logic
  const jsEnterRegex = /FamilyCouncellingPage\.prototype\.ionViewWillEnter\s*=\s*function\s*\(\)\s*\{[\s\S]*?this\.loadDoctors\(\);/;
  const newJsEnter = `FamilyCouncellingPage.prototype.ionViewWillEnter = function () {
        var storedUsrId = localStorage.getItem('usr_id');
        var isDocFlag = localStorage.getItem('is_doctor');
        var catId = localStorage.getItem('category_id');
        var cat = (localStorage.getItem('category') || '').toLowerCase();
        var aortId = localStorage.getItem('aort_id');
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

        this.loadDoctors();`;

  if (jsEnterRegex.test(code)) {
    code = code.replace(jsEnterRegex, newJsEnter);
  }

  // Update onTabChange in JS logic
  const jsTabRegex = /FamilyCouncellingPage\.prototype\.onTabChange\s*=\s*function\s*\(\s*tab\s*\)\s*\{[\s\S]*?if\s*\(tab\s*===\s*'my_bookings'\)/;
  const newJsTab = `FamilyCouncellingPage.prototype.onTabChange = function (tab) {
        var _this = this;
        if (!this.isLoggedIn && (tab === 'my_bookings' || tab === 'doctor_profile' || tab === 'doctor_schedule')) {
            this.viewMode = 'browse';
            var alert_guest = this.alertCtrl.create({
                title: 'లాగిన్ అవ్వండి (Login Required)',
                subTitle: 'ఈ వివరాలు చూడడానికి దయచేసి ముందుగా లాగిన్ అవ్వండి.',
                buttons: [
                    { text: 'రద్దు (Cancel)', role: 'cancel' },
                    {
                        text: 'లాగిన్ (Login)',
                        handler: function () {
                            _this.navCtrl.push('LoginPage', { redirect: 'FamilyCouncellingPage' });
                        }
                    }
                ]
            });
            alert_guest.present();
            return;
        }
        if (tab === 'my_bookings')`;

  if (jsTabRegex.test(code)) {
    code = code.replace(jsTabRegex, newJsTab);
  }

  // Verify syntax with vm.Script before writing
  try {
    new vm.Script(code);
    fs.writeFileSync(chunkPath, code, 'utf8');
    console.log('[OK] Patched and verified syntax for:', chunkPath);
  } catch (err) {
    console.error('[ERROR] Syntax error in ' + chunkPath + ':', err.message);
  }
}

// 4. Update main.css in both www and platforms/android assets
const cssPaths = [
  path.join(appRoot, 'www/build/main.css'),
  path.join(appRoot, 'platforms/android/app/src/main/assets/www/build/main.css')
];

for (const cPath of cssPaths) {
  if (fs.existsSync(cPath)) {
    let css = fs.readFileSync(cPath, 'utf8');
    if (!css.includes('ion-segment-button[hidden]')) {
      css += '\n\nion-segment-button[hidden] { display: none !important; }\n';
      fs.writeFileSync(cPath, css, 'utf8');
      console.log('[OK] Added hidden rule to:', cPath);
    }
  }
}

console.log('=== Family Counselling Patch Completed! ===');
