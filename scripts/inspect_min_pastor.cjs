const https = require('https');

const baseUrl = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';

async function inspect(ep) {
  return new Promise((resolve) => {
    const url = new URL(baseUrl + ep);
    const req = https.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        resolve(json.data || []);
      });
    });
    req.write(JSON.stringify({}));
    req.end();
  });
}

async function run() {
  const ministries = await inspect('getministry');
  const validMin = ministries.filter(m => m.ministryname && m.ministryname.trim().length > 0);
  console.log(`Ministries: Total ${ministries.length}, with valid ministryname: ${validMin.length}`);
  console.log('Sample valid ministries:', validMin.slice(0, 3).map(m => ({ id: m.id, name: m.ministryname })));

  const pastors = await inspect('getpastor');
  const validPastors = pastors.filter(p => (p.pastorname && p.pastorname.trim().length > 0) || (p.name && p.name.trim().length > 0));
  console.log(`Pastors: Total ${pastors.length}, with valid name: ${validPastors.length}`);
  console.log('Sample valid pastors:', validPastors.slice(0, 3).map(p => ({ id: p.id, name: p.pastorname || p.name })));
}

run();
