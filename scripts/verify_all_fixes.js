const mysql = require('../backend/node_modules/mysql2/promise');
const https = require('https');

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = JSON.stringify(data);
    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function verify() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  console.log('Connected to RDS. Starting test...');

  const testPhoneNamodu = '9999000001';
  const testPhoneRegular = '9999000002';

  // Clean any old test records first
  await db.execute('DELETE FROM signup_form WHERE mobile_number IN (?, ?)', [testPhoneNamodu, testPhoneRegular]);

  // Test 1: Namodu registration for Believer (category '1')
  console.log('\n--- 1. Testing Namodu Believer Registration ---');
  const namoduPayload = {
    category: '1',
    name: 'Namodu Believer Test',
    phone: testPhoneNamodu,
    password: testPhoneNamodu,
    whatsapp: '8888000001',
    whatsappno: '8888000001',
    districts: '1',
    constituencyname: '10',
    mandals: '20',
    panchayati: '30'
  };

  const apiBase = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/';

  const namoduRes = await postJson(apiBase + 'postregform', namoduPayload);
  console.log('Namodu API Response:', namoduRes);

  const [namoduRows] = await db.execute('SELECT * FROM signup_form WHERE mobile_number = ?', [testPhoneNamodu]);
  if (namoduRows.length === 0) {
    console.error('FAILED: Namodu believer record not found in signup_form!');
  } else {
    const row = namoduRows[0];
    console.log('SUCCESS: Namodu record saved in signup_form:');
    console.log({
      id: row.id,
      cts: row.cts,
      fname: row.fname,
      mobile_number: row.mobile_number,
      whatsapp: row.whatsapp,
      district_id: row.district_id,
      constituency_id: row.constituency_id,
      mandal_id: row.mandal_id,
      panchayat_id: row.panchayat_id,
      password: row.password,
      is_first_login: row.is_first_login
    });
  }

  // Test 2: Login for Namodu user
  console.log('\n--- 2. Testing Namodu Believer First-Login Check ---');
  const namoduLoginRes = await postJson(apiBase + 'passwordwebsitelogin', {
    phonenumber: testPhoneNamodu,
    password: testPhoneNamodu
  });
  console.log('Namodu Login Response:', namoduLoginRes);
  if (namoduLoginRes.body.status === 201 && namoduLoginRes.body.first_login === true) {
    console.log('SUCCESS: Namodu user correctly triggers first_login modal (status 201)!');
  } else {
    console.error('FAILED: Expected status 201 with first_login: true, got:', namoduLoginRes.body);
  }

  // Test 3: Regular Believer Registration
  console.log('\n--- 3. Testing Regular Believer Registration ---');
  const regularPayload = {
    fname: 'Regular Believer Test',
    mobile_number: testPhoneRegular,
    password: 'MySecurePassword123',
    whatsapp: '8888000002',
    districts: '1',
    constituencyname: '10',
    mandals: '20',
    panchayati: '30'
  };

  const regularRes = await postJson(apiBase + 'postbeliversignup', regularPayload);
  console.log('Regular Believer API Response:', regularRes);

  const [regularRows] = await db.execute('SELECT * FROM signup_form WHERE mobile_number = ?', [testPhoneRegular]);
  if (regularRows.length === 0) {
    console.error('FAILED: Regular believer record not found in signup_form!');
  } else {
    const row = regularRows[0];
    console.log('SUCCESS: Regular believer record saved in signup_form:');
    console.log({
      id: row.id,
      cts: row.cts,
      fname: row.fname,
      mobile_number: row.mobile_number,
      district_id: row.district_id,
      constituency_id: row.constituency_id,
      mandal_id: row.mandal_id,
      panchayat_id: row.panchayat_id,
      password: row.password,
      is_first_login: row.is_first_login
    });
  }

  // Test 4: Login for Regular Believer
  console.log('\n--- 4. Testing Regular Believer Normal Login Check ---');
  const regularLoginRes = await postJson(apiBase + 'passwordwebsitelogin', {
    phonenumber: testPhoneRegular,
    password: 'MySecurePassword123'
  });
  console.log('Regular Believer Login Response:', regularLoginRes);
  if (regularLoginRes.body.status === 200 && regularLoginRes.body.first_login !== true) {
    console.log('SUCCESS: Regular Believer logs in normally with status 200 (NO first-login modal)!');
  } else {
    console.error('FAILED: Expected status 200 normal login, got:', regularLoginRes.body);
  }

  // Cleanup
  console.log('\n--- 5. Cleaning up test records ---');
  await db.execute('DELETE FROM signup_form WHERE mobile_number IN (?, ?)', [testPhoneNamodu, testPhoneRegular]);
  console.log('Cleaned up test records.');

  await db.end();
  console.log('Verification completed successfully!');
}

verify().catch(console.error);
