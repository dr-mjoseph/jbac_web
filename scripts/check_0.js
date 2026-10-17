const fs = require('fs');
for (const p of [
  'C:/Users/rajes/StudioProjects/jbac_app/www/build/0.js',
  'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/0.js'
]) {
  const c = fs.readFileSync(p, 'utf8');
  console.log(p, 'has gotodoctorregister:', c.includes('gotodoctorregister'));
}
