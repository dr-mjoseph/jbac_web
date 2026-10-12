const https = require('https');
const http = require('http');

const apiUrl = 'https://0yodpttwff.execute-api.ap-south-1.amazonaws.com/dev/';

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
      timeout: 10000
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
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    req.write(payload);
    req.end();
  });
}

async function test() {
  const endpoints = [
    'getdistricts',
    'getconsistencys',
    'getmandals',
    'gepanchayati',
    'getpastorassociation',
    'getservices',
    'getbelivers'
  ];

  for (const ep of endpoints) {
    try {
      const res = await post(ep, {});
      const count = Array.isArray(res.data) ? res.data.length : (Array.isArray(res) ? res.length : 'not array');
      console.log(`Endpoint ${ep}: status=${res.status}, count=${count}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        console.log(`  Sample:`, JSON.stringify(res.data[0]));
      }
    } catch (e) {
      console.log(`Endpoint ${ep}: ERROR - ${e.message}`);
    }
  }
}

test();
