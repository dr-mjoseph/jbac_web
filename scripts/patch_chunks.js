const fs = require('fs');

const dirs = [
  'C:/Users/rajes/StudioProjects/jbac_app/www/build/',
  'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/'
];

for (const dir of dirs) {
  console.log(`\n=== Processing ${dir} ===`);

  // ----------------------------------------------------
  // 1. PATCH 52.js and 50.js (DoctorregisterPage)
  // ----------------------------------------------------
  for (const chunkName of ['52.js', '50.js']) {
    const chunkPath = dir + chunkName;
    if (!fs.existsSync(chunkPath)) continue;
    let content = fs.readFileSync(chunkPath, 'utf8');

    // Remove the invalid IonicPage() decorator line completely (handling two underscores at the end)
    content = content.replace(/\s*Object\(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__\["m"[^\]]*\]\)\(\),?\r?\n?/g, '\n');
    content = content.replace(/\s*Object\(__WEBPACK_IMPORTED_MODULE_1_ionic_angular\["m"[^\]]*\]\)\(\),?\r?\n?/g, '\n');

    // Replace invalid ComponentFactory ["n"] with Component ["m"] on module 0
    content = content.replace(/__WEBPACK_IMPORTED_MODULE_0__angular_core__\["n"\s*\/\*\s*Component\s*\*\/\]/g, '__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */]');
    content = content.replace(/__WEBPACK_IMPORTED_MODULE_0__angular_core__\["n"\]/g, '__WEBPACK_IMPORTED_MODULE_0__angular_core__["m"]');

    // Replace any remaining ["d" /* Validators */] with ["f" /* Validators */] on module 21
    content = content.replace(/__WEBPACK_IMPORTED_MODULE_2__angular_forms__\["d"\s*\/\*\s*Validators\s*\*\/\]/g, '__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */]');
    content = content.replace(/__WEBPACK_IMPORTED_MODULE_2__angular_forms__\["d"\]/g, '__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f"]');

    fs.writeFileSync(chunkPath, content, 'utf8');
    console.log(`[OK] Patched ${chunkName} in ${dir}`);
  }
}
