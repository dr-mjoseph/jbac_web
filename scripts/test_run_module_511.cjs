const fs = require('fs');
const vm = require('vm');

let modules = {};

const fakeWindow = {
  webpackJsonp: function(chunkIds, moreModules) {
    Object.assign(modules, moreModules);
  }
};

const code = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

const ctx = vm.createContext({
  window: fakeWindow,
  webpackJsonp: fakeWindow.webpackJsonp,
  console: console,
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  }
});

vm.runInContext(code, ctx);

console.log('Modules defined:', Object.keys(modules));

const installedModules = {};

function webpack_require(moduleId) {
  if (installedModules[moduleId]) return installedModules[moduleId].exports;
  const mod = installedModules[moduleId] = { exports: {} };

  if (moduleId === 0) {
    mod.exports = {
      NgModule: (obj) => (cls) => cls,
      Component: (obj) => (cls) => cls,
      ViewChild: () => () => {},
      InjectionToken: function(n) { this.name = n; },
      I: (obj) => (cls) => cls,
      m: (obj) => (cls) => cls
    };
    return mod.exports;
  }

  if (moduleId === 24) {
    const fn = function() {};
    mod.exports = {
      IonicPageModule: {
        forChild: (page) => ({ ngModule: 'IonicPageModule', page })
      },
      NavController: fn,
      NavParams: fn,
      AlertController: fn,
      ToastController: fn,
      LoadingController: fn,
      r: fn,
      s: fn,
      b: fn,
      v: fn,
      o: fn,
      n: { forChild: (page) => ({ ngModule: 'IonicPageModule', page }) }
    };
    return mod.exports;
  }

  if (moduleId === 128) {
    const ServiceProvider = function() {
      this.getcouncellingdoctors = () => ({ subscribe: (succ, err) => succ({ status: 200, data: [] }) });
      this.getcouncellingappointments = () => ({ subscribe: (succ, err) => succ({ status: 200, data: [] }) });
    };
    mod.exports = {
      ServiceProvider: ServiceProvider,
      a: ServiceProvider
    };
    return mod.exports;
  }

  if (modules[moduleId]) {
    modules[moduleId].call(mod.exports, mod, mod.exports, webpack_require);
    return mod.exports;
  }

  throw new Error('Unknown module ' + moduleId);
}

webpack_require.d = function(exports, name, getter) {
  Object.defineProperty(exports, name, { enumerable: true, get: getter });
};

try {
  console.log('Loading module 511...');
  const mod511 = webpack_require(511);
  console.log('Module 511 loaded successfully:', !!mod511.FamilyCouncellingPageModule);

  console.log('Loading module 512...');
  const mod512 = webpack_require(512);
  console.log('Module 512 loaded successfully:', !!mod512.a);

  console.log('Instantiating FamilyCouncellingPage...');
  const navCtrl = new (webpack_require(24).NavController)();
  const navParams = new (webpack_require(24).NavParams)();
  const alertCtrl = new (webpack_require(24).AlertController)();
  const toastCtrl = new (webpack_require(24).ToastController)();
  const loadingCtrl = new (webpack_require(24).LoadingController)();
  const service = new (webpack_require(128).ServiceProvider)();

  const instance = new mod512.a(navCtrl, navParams, alertCtrl, toastCtrl, loadingCtrl, service);
  console.log('Instance created successfully!');
  console.log('Testing ionViewWillEnter...');
  instance.ionViewWillEnter();
  console.log('ionViewWillEnter completed! Doctors count:', instance.doctors.length);
} catch (e) {
  console.error('ERROR in execution:', e);
}
