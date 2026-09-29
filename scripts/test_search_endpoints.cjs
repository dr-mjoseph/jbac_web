const http = require('http');

// Start backend/server.js as child process
const { spawn } = require('child_process');

const nodePath = 'C:\\Users\\rajes\\AppData\\Local\\OpenAI\\Codex\\runtimes\\cua_node\\a708e72b10c27b59\\bin\\node.exe';
const serverProc = spawn(nodePath, ['backend/server.js'], {
  env: { ...process.env, PORT: '9988' }
});

serverProc.stdout.on('data', (d) => console.log('[SERVER]', d.toString().trim()));
serverProc.stderr.on('data', (d) => console.error('[SERVER ERR]', d.toString().trim()));

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 9988,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(buf) });
        } catch (e) {
          resolve({ status: res.statusCode, body: buf });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  // Wait 3 seconds for server to boot
  await new Promise(r => setTimeout(r, 3000));

  console.log('\n--- TEST 1: /dashboardapi/getevents (current date only) ---');
  const t1 = await post('/dashboardapi/getevents?current_date_only=true', {});
  console.log('Status:', t1.status, 'Items count:', t1.body.data?.length);
  if (t1.body.data?.length > 0) {
    console.log('Sample item dates:', t1.body.data.map(d => ({ id: d.id, start: d.startdate, end: d.enddate })));
  }

  console.log('\n--- TEST 2: /dashboardapi/searchingdata (with startdate 2026-09-29) ---');
  const t2 = await post('/dashboardapi/searchingdata', { startdate: '2026-09-29' });
  console.log('Status:', t2.status, 'Items count:', t2.body.data?.length);

  console.log('\n--- TEST 3: /dashboardapi/searchingdemonation ---');
  const t3 = await post('/dashboardapi/searchingdemonation', { startdate: '2026-09-29' });
  console.log('Status:', t3.status, 'Items count:', t3.body.data?.length);

  console.log('\n--- TEST 4: /dashboardapi/searchingchurchdata ---');
  const t4 = await post('/dashboardapi/searchingchurchdata', {});
  console.log('Status:', t4.status, 'Items count:', t4.body.data?.length);

  console.log('\n--- TEST 5: /dashboardapi/searchpastors ---');
  const t5 = await post('/dashboardapi/searchpastors', {});
  console.log('Status:', t5.status, 'Items count:', t5.body.data?.length);

  console.log('\n--- TEST 6: /dashboardapi/searchmarriages ---');
  const t6 = await post('/dashboardapi/searchmarriages', { gender: 'Male' });
  console.log('Status:', t6.status, 'Items count:', t6.body.data?.length);

  console.log('\n--- TEST 7: /dashboardapi/getjobs ---');
  const t7 = await post('/dashboardapi/getjobs', {});
  console.log('Status:', t7.status, 'Items count:', t7.body.data?.length);

  console.log('\n--- TEST 8: /dashboardapi/searchorganization ---');
  const t8 = await post('/dashboardapi/searchorganization', {});
  console.log('Status:', t8.status, 'Items count:', t8.body.data?.length);

  console.log('\n--- TEST 9: /dashboardapi/getinstitutes ---');
  const t9 = await post('/dashboardapi/getinstitutes', {});
  console.log('Status:', t9.status, 'Items count:', t9.body.data?.length);

  serverProc.kill();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  serverProc.kill();
  process.exit(1);
});
