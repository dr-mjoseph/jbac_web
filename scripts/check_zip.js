// Let us inspect the zip contents or see what was packaged
const fs = require('fs');
const stat = fs.statSync('c:/Users/rajes/Documents/jbac_web/backend/backend-deploy.zip');
console.log('Zip size:', stat.size, 'bytes, modified:', stat.mtime);
