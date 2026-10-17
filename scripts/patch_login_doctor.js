const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appRoot = 'C:/Users/rajes/StudioProjects/jbac_app';

console.log('=== Adding Doctor Register direct link to LoginPage ===');

// 1. src/pages/login/login.html
const lHtmlPath = path.join(appRoot, 'src/pages/login/login.html');
if (fs.existsSync(lHtmlPath)) {
  let html = fs.readFileSync(lHtmlPath, 'utf8');
  if (!html.includes('gotodoctorregister()')) {
    const target = '<p class="signup-link" (click)="gotoformspage()">ఇంతకముందు రిజిస్టర్ కాకపోతే ? <a>రిజిస్టర్ </a></p>';
    const addition = target + '\n        <p class="signup-link" style="margin-top: 8px;" (click)="gotodoctorregister()">🩺 డాక్టర్ / కౌన్సిలర్ రిజిస్ట్రేషన్ ? <a>ఇక్కడ నమోదు చేయండి</a></p>';
    html = html.replace(target, addition);
    fs.writeFileSync(lHtmlPath, html, 'utf8');
    console.log('[OK] Added gotodoctorregister to src login.html');
  }
}

// 2. src/pages/login/login.ts
const lTsPath = path.join(appRoot, 'src/pages/login/login.ts');
if (fs.existsSync(lTsPath)) {
  let ts = fs.readFileSync(lTsPath, 'utf8');
  if (!ts.includes('gotodoctorregister()')) {
    const target = 'gotoformspage() {';
    const addition = `gotodoctorregister() {
    this.navCtrl.push('DoctorregisterPage');
  }

  gotoformspage() {`;
    ts = ts.replace(target, addition);
    fs.writeFileSync(lTsPath, ts, 'utf8');
    console.log('[OK] Added gotodoctorregister to src login.ts');
  }
}

// 3. Compiled 0.js in www and platforms/android assets
const zeroJsPaths = [
  path.join(appRoot, 'www/build/0.js'),
  path.join(appRoot, 'platforms/android/app/src/main/assets/www/build/0.js')
];

for (const zPath of zeroJsPaths) {
  if (fs.existsSync(zPath)) {
    let code = fs.readFileSync(zPath, 'utf8');
    
    // In template
    const tTarget = '<p class="signup-link" (click)="gotoformspage()">ఇంతకముందు రిజిస్టర్ కాకపోతే ? <a>రిజిస్టర్ </a></p>';
    const tAddition = '<p class="signup-link" (click)="gotoformspage()">ఇంతకముందు రిజిస్టర్ కాకపోతే ? <a>రిజిస్టర్ </a></p>\\n        <p class="signup-link" style="margin-top: 8px;" tappable (click)="gotodoctorregister()">🩺 డాక్టర్ / కౌన్సిలర్ రిజిస్ట్రేషన్ ? <a>ఇక్కడ నమోదు చేయండి</a></p>';
    if (code.includes(tTarget) && !code.includes('gotodoctorregister()')) {
      code = code.replace(tTarget, tAddition);
    }

    // In JS method
    const mTarget = 'LoginPage.prototype.gotoformspage = function () {';
    const mAddition = `LoginPage.prototype.gotodoctorregister = function () {
        this.navCtrl.push('DoctorregisterPage');
    };
    LoginPage.prototype.gotoformspage = function () {`;
    if (code.includes(mTarget) && !code.includes('LoginPage.prototype.gotodoctorregister')) {
      code = code.replace(mTarget, mAddition);
    }

    try {
      new vm.Script(code);
      fs.writeFileSync(zPath, code, 'utf8');
      console.log('[OK] Updated and verified 0.js at:', zPath);
    } catch (e) {
      console.error('[ERROR] 0.js syntax error:', e.message);
    }
  }
}
