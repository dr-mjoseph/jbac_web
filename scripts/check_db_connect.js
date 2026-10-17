const fs = require('fs');
// Let's use backend/server.js's database connection or check how backend connects to mysql
const serverContent = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/backend/server.js', 'utf8');
const lines = serverContent.split('\n');
lines.slice(0, 50).forEach(l => console.log(l));
