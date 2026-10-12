const https = require('https');
const fs = require('fs');

const baseUrl = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';

async function fetchJson(ep) {
  return new Promise((resolve) => {
    const url = new URL(baseUrl + ep);
    const req = https.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.data || []);
        } catch (e) {
          resolve([]);
        }
      });
    });
    req.write(JSON.stringify({}));
    req.end();
  });
}

async function run() {
  const districts = await fetchJson('getdistricts');
  const denominations = await fetchJson('denomations');
  const wings = await fetchJson('getwing');
  const leaderlevels = await fetchJson('leaderlevels');
  const educationalq = await fetchJson('educationalq');
  const pattern = await fetchJson('pattern');
  const ministries = await fetchJson('getministry');
  const pastors = await fetchJson('getpastor');
  const churches = await fetchJson('getchurch');

  const validMinistries = ministries.filter(m => m && (m.ministryname || m.name) && (m.ministryname || m.name).trim() !== '').map(m => ({ id: m.id, ministryname: (m.ministryname || m.name).trim() }));
  const validPastors = pastors.filter(p => p && (p.pastorname || p.name) && (p.pastorname || p.name).trim() !== '').map(p => ({ id: p.id, pastorname: (p.pastorname || p.name).trim(), name: (p.pastorname || p.name).trim(), district_id: p.district_id, constituency_id: p.constituency_id, mandal_id: p.mandal_id }));
  const validChurches = churches.filter(c => c && c.church_name && c.church_name.trim() !== '').map(c => ({ id: c.id, church_name: c.church_name.trim(), district_id: c.district_id, constituency_id: c.constituency_id, mandal_id: c.mandal_id }));

  const bundle = {
    districts,
    denominations,
    wings,
    leaderlevels,
    educationalq,
    pattern,
    ministries: validMinistries,
    pastors: validPastors,
    churches: validChurches
  };

  fs.writeFileSync('src/app/jesus/dropdown_fallback_data.json', JSON.stringify(bundle, null, 2), 'utf8');
  console.log('Saved dropdown_fallback_data.json:');
  console.log(`Districts: ${districts.length}, Denominations: ${denominations.length}, Wings: ${wings.length}, Ministries: ${validMinistries.length}, Pastors: ${validPastors.length}, Churches: ${validChurches.length}`);
}

run();
