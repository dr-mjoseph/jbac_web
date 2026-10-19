const fs = require('fs');

['C:/Users/rajes/StudioProjects/jbac_app/www/build/35.js', 'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/35.js'].forEach(p => {
  let c = fs.readFileSync(p, 'utf8');
  const idx = c.indexOf('village_name:');
  const end = c.indexOf('});', idx);
  console.log('Original slice:', JSON.stringify(c.substring(idx, end + 3)));
  
  // Replace the closing of formBuilder.group after village_name
  c = c.substring(0, end) + "term: [true],\n        });" + c.substring(end + 3);
  fs.writeFileSync(p, c, 'utf8');
  console.log('Patched 35.js at:', p);
});
