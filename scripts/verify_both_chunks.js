const fs = require('fs');

console.log('--- Testing 52.js in assets ---');
const c52 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/52.js', 'utf8');

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
  console.log('52.js Module 513 loaded successfully:', !!mockExports513.DoctorregisterPageModule);
  console.log('52.js Module 514 loaded successfully:', !!mockExports514.a);
  const PageClass = mockExports514.a;
  const mockFb = new (mockRequire(21).a)();
  const pageInst = new PageClass({}, mockFb, {}, {}, {}, {});
  console.log('DoctorregisterPage instantiated successfully!');
} catch (e) {
  console.error('52.js FAILED:', e);
}

console.log('\n--- Testing 51.js in assets ---');
const c51 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/51.js', 'utf8');
let modules51 = {};
global.webpackJsonp = function(chunkIds, moreModules) {
  Object.assign(modules51, moreModules);
};
eval(c51);
const mockExports511 = {};
const mockExports512 = {};
const mockRequire51 = function(id) {
  if (id === 0) return { I: (d) => (cls) => cls, m: (d) => (cls) => cls };
  if (id === 24) return {
    n: { forChild: (c) => ({ ngModule: c, providers: [] }) },
    r: class NavController {},
    s: class NavParams {},
    b: class AlertController {
      create(opts) { return { present: () => {}, dismiss: () => {} }; }
    },
    o: class LoadingController {},
    v: class ToastController {}
  };
  if (id === 512) {
    modules51[512]({}, mockExports512, mockRequire51);
    return mockExports512;
  }
  if (id === 128) return {
    a: class ServiceProvider {
      getcouncellingdoctors() { return { subscribe: () => {} }; }
      getcouncellingappointments() { return { subscribe: () => {} }; }
    }
  };
  return {};
};
mockRequire51.d = mockRequire.d;

try {
  modules51[511]({}, mockExports511, mockRequire51);
  console.log('51.js Module 511 loaded successfully:', !!mockExports511.FamilyCouncellingPageModule);
  console.log('51.js Module 512 loaded successfully:', !!mockExports512.a);
  const FCPage = mockExports512.a;
  const pageInst = new FCPage({}, {}, new (mockRequire51(24).b)(), {}, {}, new (mockRequire51(128).a)());
  console.log('FamilyCouncellingPage instantiated successfully!');
  
  // Test guest user trying to open booking
  pageInst.isLoggedIn = false;
  pageInst.openBookingForm({ id: 1 });
  console.log('Guest openBookingForm test: viewMode is', pageInst.viewMode, '(should be browse)');
  
  // Test tab switching
  pageInst.onTabChange('my_bookings');
  console.log('onTabChange test: viewMode is', pageInst.viewMode);
  pageInst.switchTab('browse');
  console.log('switchTab test: viewMode is', pageInst.viewMode);
} catch (e) {
  console.error('51.js FAILED:', e);
}
