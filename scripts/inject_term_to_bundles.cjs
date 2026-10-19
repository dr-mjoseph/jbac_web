const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appRoot = 'C:/Users/rajes/StudioProjects/jbac_app';
const buildDirs = [
  path.join(appRoot, 'www/build'),
  path.join(appRoot, 'platforms/android/app/src/main/assets/www/build')
];

buildDirs.forEach(dir => {
  // 35.js (Church)
  const f35 = path.join(dir, '35.js');
  let c35 = fs.readFileSync(f35, 'utf8');
  
  // Replace village_name line and closing of formBuilder.group
  const oldChurchPattern = /village_name:\s*\['',\s*\[__WEBPACK_IMPORTED_MODULE_1__angular_forms__["']f["']\s*\/\*\s*Validators\s*\*\/\s*\.required\]\]\s*,?\s*(?:term:\s*\[true\],?\s*)?\}\);/;
  const newChurchTarget = `village_name: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]],\n            term: [true],\n        });`;
  
  c35 = c35.replace(oldChurchPattern, newChurchTarget);
  new vm.Script(c35);
  fs.writeFileSync(f35, c35, 'utf8');
  console.log('Successfully injected term into 35.js in', dir);

  // 21.js (Ministry)
  const f21 = path.join(dir, '21.js');
  let c21 = fs.readFileSync(f21, 'utf8');

  const oldMinPattern = /description:\s*\[''\]\s*,?\s*(?:term:\s*\[true\],?\s*)?\}\);/;
  const newMinTarget = `description: [''],\n            term: [true],\n        });`;

  c21 = c21.replace(oldMinPattern, newMinTarget);
  new vm.Script(c21);
  fs.writeFileSync(f21, c21, 'utf8');
  console.log('Successfully injected term into 21.js in', dir);
});
