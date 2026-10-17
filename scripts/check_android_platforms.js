const fs = require('fs');
const platformsDir = 'C:\\Users\\rajes\\AppData\\Local\\Android\\Sdk\\platforms';
if (fs.existsSync(platformsDir)) {
    console.log('Installed Android SDK platforms:', fs.readdirSync(platformsDir));
}
