const fs = require('fs');
const js = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/49.js', 'utf8');

console.log('49.js length:', js.length);

// Check what happens in FamilyCouncellingPage methods
const methods = ['ionViewWillEnter', 'loadDoctors', 'loadAppointments', 'openBookingForm', 'openPage'];
methods.forEach(m => {
  const idx = js.indexOf(m);
  console.log(`Method ${m} at: ${idx}`);
  if (idx !== -1) {
    console.log(js.substring(idx, idx + 400));
    console.log('---');
  }
});
