const fs = require('fs');
const s = fs.readFileSync('src/app/jesus/service.service.ts', 'utf8');

const methods = [
  'getconsistencys',
  'getmandals',
  'gepanchayatis',
  'getmdistrict',
  'getmconsistencys',
  'getpastorassci',
  'getservices',
  'getbelivers'
];

methods.forEach(m => {
  const idx = s.indexOf(m + '(');
  if (idx !== -1) {
    console.log(`=== Method ${m} ===`);
    console.log(s.substring(idx, idx + 300));
  } else {
    console.log(`=== Method ${m} NOT FOUND ===`);
  }
});
