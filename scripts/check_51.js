const fs = require('fs');
const c51 = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/51.js', 'utf8');
const pWillEnter = c51.indexOf('ionViewWillEnter');
console.log('ionViewWillEnter in 51.js:');
console.log(c51.substring(pWillEnter, pWillEnter + 1200));

const pOpenBooking = c51.indexOf('openBookingForm');
console.log('openBookingForm in 51.js:');
console.log(c51.substring(pOpenBooking, pOpenBooking + 500));
