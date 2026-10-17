const fs = require('fs');
const path = require('path');
const sdk = 'C:\\Users\\rajes\\AppData\\Local\\Android\\Sdk';

['cmdline-tools', 'tools', 'platform-tools'].forEach(d => {
    const p = path.join(sdk, d);
    console.log(d, 'exists:', fs.existsSync(p));
    if (fs.existsSync(p)) {
        console.log(' ', fs.readdirSync(p));
    }
});
