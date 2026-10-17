const fs = require('fs');

const paths = [
  'C:/Users/rajes/StudioProjects/jbac_app/www/build/50.js',
  'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/50.js',
  'C:/Users/rajes/StudioProjects/jbac_app/www/build/52.js',
  'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/52.js'
];

for (const p of paths) {
  if (fs.existsSync(p)) {
    let code = fs.readFileSync(p, 'utf8');
    const target = '__WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* Validators */]';
    const replacement = '__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */]';
    const count = code.split(target).length - 1;
    console.log(p + ' had ' + count + ' occurrences');
    if (count > 0) {
      code = code.split(target).join(replacement);
      fs.writeFileSync(p, code, 'utf8');
      console.log('Successfully replaced in ' + p);
    }
  }
}
