const fs = require('fs');
const d = 'C:\\Users\\rajes\\AppData\\Local\\Android\\Sdk\\build-tools';
if (fs.existsSync(d)) {
    console.log(fs.readdirSync(d));
}
