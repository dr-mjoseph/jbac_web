const fs = require('fs');

let c52 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/52.js', 'utf8');

// Replace wrong IonicPage and Component
// In 52.js:
// Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* IonicPage */])(),
// Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
c52 = c52.replace('Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* IonicPage */])(),', '');
c52 = c52.replace('__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */]', '__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */]');

console.log('Modified 52.js snippet around Component:');
const pComp = c52.indexOf('Component');
console.log(c52.substring(pComp - 50, pComp + 100));

// Now run real check
let modules = {};
global.webpackJsonp = function(chunkIds, moreModules) {
  Object.assign(modules, moreModules);
};
global.Reflect = Reflect;
eval(c52);

const mockExports513 = {};
const mockExports514 = {};
const mockRequire = function(id) {
  if (id === 0) return {
    I: (def) => (cls) => cls,
    m: (def) => (cls) => cls
  };
  if (id === 24) return {
    n: { forChild: (c) => ({ ngModule: c, providers: [] }) },
    r: class NavController {},
    b: class AlertController {},
    o: class LoadingController {},
    v: class ToastController {}
  };
  if (id === 514) {
    modules[514]({}, mockExports514, mockRequire);
    return mockExports514;
  }
  if (id === 21) {
    return {
      f: {
        required: () => {},
        minLength: () => {},
        pattern: () => {},
        email: () => {}
      },
      a: class FormBuilder {
        group(defs) { return { value: defs, invalid: false }; }
      }
    };
  }
  if (id === 128) return { a: class ServiceProvider {} };
  return {};
};
mockRequire.d = function(exports, name, getter) {
  Object.defineProperty(exports, name, { enumerable: true, get: getter });
};

try {
  modules[513]({}, mockExports513, mockRequire);
  console.log('DoctorregisterPageModule SUCCESS:', !!mockExports513.DoctorregisterPageModule);
  console.log('DoctorregisterPage class SUCCESS:', !!mockExports514.a);
  const PageClass = mockExports514.a;
  const mockFb = new (mockRequire(21).a)();
  const pageInst = new PageClass({}, mockFb, {}, {}, {}, {});
  console.log('DoctorregisterPage INSTANCE SUCCESS! Form initialized with controls:', Object.keys(pageInst.doctorForm.value));
} catch(err) {
  console.error('ERROR:', err);
}
