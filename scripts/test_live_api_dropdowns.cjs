const https = require('https');

const endpoints = [
  'getdistricts',
  'getconsistencys',
  'getmandals',
  'gepanchayati',
  'denomations',
  'getwing',
  'getministry',
  'getpastor',
  'getchurch',
  'leaderlevels',
  'educationalq',
  'pattern',
  'getbelivers'
];

const baseUrl = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';

async function testEndpoint(ep) {
  return new Promise((resolve) => {
    const url = new URL(baseUrl + ep);
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const count = Array.isArray(json.data) ? json.data.length : (json.data ? 1 : 0);
          resolve({ ep, status: res.statusCode, apiStatus: json.status, count, sample: Array.isArray(json.data) ? json.data[0] : json.data });
        } catch (e) {
          resolve({ ep, status: res.statusCode, error: data.substring(0, 100) });
        }
      });
    });
    req.on('error', (err) => resolve({ ep, error: err.message }));
    req.write(JSON.stringify({}));
    req.end();
  });
}

async function run() {
  console.log('Testing live endpoints against RDS / Lambda API...\n');
  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    console.log(`${ep}: status=${res.status}, apiStatus=${res.apiStatus}, count=${res.count}`, res.sample ? JSON.stringify(res.sample) : (res.error || ''));
  }
}

run();
