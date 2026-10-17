const fs = require('fs');

// Fix server.js
let js = fs.readFileSync('backend/server.js', 'utf8');
js = js.replace(/const url_1 = require\("url"\);[\r\n]+const __filename = \(0, url_1\.fileURLToPath\)\(import\.meta\.url\);[\r\n]+const __dirname = path_1\.default\.dirname\(__filename\);[\r\n]+/, '');
fs.writeFileSync('backend/server.js', js);
console.log('Fixed backend/server.js');

// Fix server.ts
let ts = fs.readFileSync('backend/server.ts', 'utf8');
ts = ts.replace(/import { fileURLToPath } from 'url';[\r\n]+const __filename = fileURLToPath\(import\.meta\.url\);[\r\n]+const __dirname = path\.dirname\(__filename\);[\r\n]+/, '');
fs.writeFileSync('backend/server.ts', ts);
console.log('Fixed backend/server.ts');
