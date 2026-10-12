const fs = require('fs');
const vm = require('vm');

let registeredModules = null;
const fakeWindow = {
  webpackJsonp: function(chunkIds, modules) {
    console.log('webpackJsonp called with chunkIds:', chunkIds);
    registeredModules = modules;
  }
};

const context = vm.createContext({
  window: fakeWindow,
  webpackJsonp: fakeWindow.webpackJsonp,
  console: console
});

const code = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

try {
  vm.runInContext(code, context);
  console.log('Evaluation succeeded! Registered modules:', Object.keys(registeredModules));
} catch (e) {
  console.error('Evaluation FAILED:', e);
}
