const https = require('https');
const fs = require('fs');

const apiUrl = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';

function post(endpoint, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data || {});
    const url = new URL(apiUrl + endpoint);
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 15000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body, status: res.statusCode });
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('Fetching consistencies and mandals...');
  const [constRes, mandRes] = await Promise.all([
    post('getconsistencys', {}),
    post('getmandals', {})
  ]);

  const consistencies = (constRes.data || []).map(c => ({
    id: c.id,
    const_nm: c.const_nm || c.constituencyname || c.name,
    constituencyname: c.constituencyname || c.const_nm || c.name,
    name: c.name || c.const_nm || c.constituencyname,
    dstrct_id: Number(c.dstrct_id)
  }));

  const mandals = (mandRes.data || []).map(m => ({
    id: m.id,
    mndl_nm: m.mndl_nm || m.mandalname || m.name,
    mandalname: m.mandalname || m.mndl_nm || m.name,
    name: m.name || m.mndl_nm || m.mandalname,
    const_id: Number(m.const_id),
    dstrct_id: Number(m.dstrct_id)
  }));

  console.log(`Fetched ${consistencies.length} consistencies and ${mandals.length} mandals.`);
  fs.writeFileSync('scripts/geo_data.json', JSON.stringify({ consistencies, mandals }, null, 2));
  console.log('Saved to scripts/geo_data.json');
}

run().catch(console.error);
