const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';

const wwwBuild = path.join(mobilePath, 'www', 'build');
if (fs.existsSync(wwwBuild)) {
  console.log('=== www/build files ===');
  console.log(fs.readdirSync(wwwBuild).join(', '));
}

const androidBuild = path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build');
if (fs.existsSync(androidBuild)) {
  console.log('\n=== android/www/build files ===');
  console.log(fs.readdirSync(androidBuild).join(', '));
}
