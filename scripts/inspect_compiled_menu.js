const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJsPaths = [
  path.join(mobilePath, 'www', 'build', 'main.js'),
  path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', 'main.js')
];

for (const p of mainJsPaths) {
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    const idx = content.indexOf('VideoGalleryPage');
    if (idx !== -1) {
      console.log('Found VideoGalleryPage in', p);
      console.log(content.substring(idx - 300, idx + 400));
    } else {
      console.log('VideoGalleryPage not found in', p);
    }
  } else {
    console.log(p, 'does not exist');
  }
}
