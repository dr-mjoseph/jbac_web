const fs = require('fs');
const s = fs.readFileSync('src/app/jesus/service.service.ts', 'utf8');

const list = ['getconsistencys', 'getmandals', 'gepanchayatis', 'getmdistrict', 'getmconsistencys', 'getpastorassci', 'getservices', 'getbelivers'];
list.forEach(m => {
  const idx = s.indexOf(m + '(');
  if (idx !== -1) {
    console.log(`\n================== ${m} ==================`);
    console.log(s.substring(idx, idx + 500));
  }
});
