const fs = require('fs');

const newHtml = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/src/pages/doctorregister/doctorregister.html', 'utf8');

// Escaped string for JS template:
const escapedTemplate = JSON.stringify(newHtml);

const dirs = [
  'C:/Users/rajes/StudioProjects/jbac_app/www/build/',
  'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/'
];

for (const dir of dirs) {
  for (const chunk of ['52.js', '50.js']) {
    const chunkPath = dir + chunk;
    if (!fs.existsSync(chunkPath)) continue;
    let content = fs.readFileSync(chunkPath, 'utf8');

    // Find template: /*ion-inline-start:"...doctorregister.html"*/.../*ion-inline-end:"...doctorregister.html"*/
    const tStart = content.indexOf('template: /*ion-inline-start:');
    if (tStart !== -1) {
      const tEnd = content.indexOf('/*ion-inline-end:', tStart);
      const afterEnd = content.indexOf('*/', tEnd) + 2;

      // New template property:
      const newTemplateProp = 'template: /*ion-inline-start:"C:\\\\Users\\\\rajes\\\\StudioProjects\\\\jbac_app\\\\src\\\\pages\\\\doctorregister\\\\doctorregister.html"*/' +
        escapedTemplate +
        '/*ion-inline-end:"C:\\\\Users\\\\rajes\\\\StudioProjects\\\\jbac_app\\\\src\\\\pages\\\\doctorregister\\\\doctorregister.html"*/';

      content = content.substring(0, tStart) + newTemplateProp + content.substring(afterEnd);
      fs.writeFileSync(chunkPath, content, 'utf8');
      console.log(`[OK] Updated template in ${chunkPath}`);
    } else {
      console.log(`[WARN] Template start marker not found in ${chunkPath}`);
    }
  }
}
