const fs = require('fs');

const dirs = [
  'C:/Users/rajes/StudioProjects/jbac_app/www/build/0.js',
  'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/0.js'
];

for (const p of dirs) {
  let content = fs.readFileSync(p, 'utf8');

  // 1. Update <select> options in 0.js template
  const targetOption6 = '<option value="6">క్రిస్టియన్ ఆర్గనైజెషన్ / కంపెనీ</option>';
  const doctorOption = '\n\n          <option value="8">డాక్టర్ / కౌన్సిలర్ (Doctor / Counsellor)</option>';

  if (content.includes(targetOption6) && !content.includes('value="8"')) {
    content = content.replace(targetOption6, targetOption6 + doctorOption);
    console.log(`[OK] Added doctor option to template in ${p}`);
  } else if (content.includes('value="8"')) {
    console.log(`[INFO] Doctor option already in template in ${p}`);
  } else {
    console.log(`[WARN] targetOption6 not found in ${p}`);
  }

  // 2. Update passlogin() category 8 handling and redirection in 0.js
  const targetCat7 = "else if (_this.passloginform.value.category == 7) {\n                                localStorage.setItem('category', 'Pastors Association ');\n                            }";
  const doctorLogic = `else if (_this.passloginform.value.category == 7) {
                                localStorage.setItem('category', 'Pastors Association ');
                            }
                            else if (_this.passloginform.value.category == 8) {
                                localStorage.setItem('category', 'Doctor');
                                localStorage.setItem('is_doctor', '1');
                            }`;

  if (content.includes(targetCat7) && !content.includes('value.category == 8')) {
    content = content.replace(targetCat7, doctorLogic);
    console.log(`[OK] Added category 8 handling to passlogin in ${p}`);
  } else if (content.includes('value.category == 8')) {
    console.log(`[INFO] Category 8 handling already in passlogin in ${p}`);
  } else {
    // Try regex replacement
    const regCat7 = /else if \(_this\.passloginform\.value\.category == 7\) \{[\s\S]*?localStorage\.setItem\('category', 'Pastors Association '\);[\s\S]*?\}/;
    if (regCat7.test(content) && !content.includes('value.category == 8')) {
      content = content.replace(regCat7, doctorLogic);
      console.log(`[OK] Added category 8 handling via regex in ${p}`);
    } else {
      console.log(`[WARN] targetCat7 not matched in ${p}`);
    }
  }

  // Update redirect logic if category == 8
  const oldRedirect = `_this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);`;
  const newRedirect = `var redirect = _this.navParams.get('redirect');
                            if (redirect === 'FamilyCouncellingPage' || redirect === 'family-councelling' || _this.passloginform.value.category == 8) {
                                _this.navCtrl.setRoot('FamilyCouncellingPage');
                            } else {
                                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);
                            }`;

  if (content.includes(oldRedirect) && !content.includes("redirect === 'FamilyCouncellingPage'")) {
    content = content.replace(oldRedirect, newRedirect);
    console.log(`[OK] Added doctor / family counselling redirect in ${p}`);
  }

  fs.writeFileSync(p, content, 'utf8');
}
