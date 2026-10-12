const fs = require('fs');
const sTs = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/src/providers/service/service.ts', 'utf8');
const mainJs = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/main.js', 'utf8');

console.log('service.ts has getcouncellingdoctors:', sTs.includes('getcouncellingdoctors'));
console.log('service.ts has getcouncellingappointments:', sTs.includes('getcouncellingappointments'));

console.log('main.js has getcouncellingdoctors:', mainJs.includes('getcouncellingdoctors'));
console.log('main.js has getcouncellingappointments:', mainJs.includes('getcouncellingappointments'));
