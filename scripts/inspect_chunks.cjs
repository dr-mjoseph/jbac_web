const fs = require('fs');
const main = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/main.js', 'utf8');

const regex = /"([^"]+)":\s*\[\s*(\d+),\s*0\s*\]/g;
let m;
while ((m = regex.exec(main)) !== null) {
  console.log('Chunk 0 maps module:', m[1], 'id:', m[2]);
}

const regex1 = /"([^"]+)":\s*\[\s*(\d+),\s*1\s*\]/g;
while ((m = regex1.exec(main)) !== null) {
  console.log('Chunk 1 maps module:', m[1], 'id:', m[2]);
}
