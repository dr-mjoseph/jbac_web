const fs = require('fs');
const path = require('path');
const https = require('https');

const webServiceFile = path.join(__dirname, '..', 'src', 'app', 'jesus', 'service.service.ts');
const mobileServiceFile = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\providers\\service\\service.ts';

function extractEndpoints(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf8');
  const set = new Set();
  const patterns = [
    /this\.testApi\s*\+\s*['"`]([^'"`\?]+)/g,
    /testApi\s*\+\s*['"`]([^'"`\?]+)/g
  ];
  for (const pat of patterns) {
    let m;
    while ((m = pat.exec(text)) !== null) {
      set.add(m[1].trim());
    }
  }
  return Array.from(set);
}

const webEndpoints = extractEndpoints(webServiceFile);
const mobileEndpoints = extractEndpoints(mobileServiceFile);

const allEndpoints = Array.from(new Set([...webEndpoints, ...mobileEndpoints])).sort();

console.log(`Extracted ${webEndpoints.length} web endpoints, ${mobileEndpoints.length} mobile endpoints. Unique total: ${allEndpoints.length}`);
console.log('Endpoints list:', JSON.stringify(allEndpoints, null, 2));

const BASE_URL = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = new URL(endpoint, BASE_URL);
    const req = https.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          // not json
        }
        let itemCount = 0;
        let isArray = false;
        if (parsed) {
          if (Array.isArray(parsed)) {
            isArray = true;
            itemCount = parsed.length;
          } else if (Array.isArray(parsed.data)) {
            isArray = true;
            itemCount = parsed.data.length;
          } else if (Array.isArray(parsed.result)) {
            isArray = true;
            itemCount = parsed.result.length;
          }
        }
        resolve({
          endpoint,
          status: res.statusCode,
          isArray,
          itemCount,
          rawLength: data.length,
          sample: data.slice(0, 150),
          error: (res.statusCode >= 400 || (parsed && parsed.status >= 400)) ? true : false
        });
      });
    });

    req.on('error', (err) => {
      resolve({ endpoint, status: 'ERROR', error: true, message: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ endpoint, status: 'TIMEOUT', error: true, message: 'Timed out' });
    });

    req.write(JSON.stringify({}));
    req.end();
  });
}

async function run() {
  console.log('\nTesting all endpoints against live AWS backend...');
  const results = [];
  // Run with concurrency of 5
  for (let i = 0; i < allEndpoints.length; i += 5) {
    const chunk = allEndpoints.slice(i, i + 5);
    const resChunk = await Promise.all(chunk.map(testEndpoint));
    results.push(...resChunk);
    process.stdout.write(`Tested ${Math.min(i + 5, allEndpoints.length)}/${allEndpoints.length}\r`);
  }
  console.log('\n\n--- SUMMARY OF RESULTS ---');
  
  const failed = results.filter(r => r.error || r.status !== 200);
  const empty = results.filter(r => !r.error && r.status === 200 && r.isArray && r.itemCount === 0);
  const successful = results.filter(r => !r.error && r.status === 200 && (!r.isArray || r.itemCount > 0));

  console.log(`Total: ${results.length}`);
  console.log(`Successful with data: ${successful.length}`);
  console.log(`Empty arrays (NO DROPDOWN DATA): ${empty.length}`);
  console.log(`Failed / Errors: ${failed.length}`);

  if (empty.length > 0) {
    console.log('\n[CRITICAL WARNING] Endpoints returning EMPTY ARRAY (0 items):');
    empty.forEach(e => console.log(`  - ${e.endpoint}: length 0, sample: ${e.sample}`));
  }

  if (failed.length > 0) {
    console.log('\n[CRITICAL ERROR] Failed Endpoints:');
    failed.forEach(f => console.log(`  - ${f.endpoint}: status ${f.status} (${f.message || f.sample})`));
  }

  fs.writeFileSync(path.join(__dirname, 'endpoint_test_report.json'), JSON.stringify(results, null, 2));
}

run();
