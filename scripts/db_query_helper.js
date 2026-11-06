const https = require('https');

function runSql(query) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      adminUsername: 'admin',
      adminPassword: 'JbacAdmin@2026',
      query: query
    });

    const req = https.request('https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  const q = process.argv[2] || "SHOW TABLES LIKE 'jbac_%'";
  console.log('Executing SQL:', q);
  try {
    const res = await runSql(q);
    console.log('Result:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
