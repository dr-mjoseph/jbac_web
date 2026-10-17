const https = require('https');
const mysql = require('mysql2/promise');

async function testLiveApi() {
  const testPayload = JSON.stringify({
    category: "2", // Student from namodu
    name: "Automated Verification Student",
    number: "9898989898",
    district_id: "1",
    constituency_id: "1",
    mandal_id: "1",
    village_id: "1",
    address: "Verification St",
    description: "Testing category sync to student_reg"
  });

  const options = {
    hostname: '1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com',
    path: '/dashboardapi/postregform',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(testPayload)
    }
  };

  console.log("Calling live API Gateway POST /dashboardapi/postregform...");
  const apiPromise = new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(testPayload);
    req.end();
  });

  const res = await apiPromise;
  console.log("API Response:", JSON.stringify(res, null, 2));

  // Verify directly in MySQL RDS database
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  const [regRows] = await db.query('SELECT * FROM reg_form WHERE phonenum = "9898989898"');
  console.log(`Found in reg_form: ${regRows.length} row(s)`);

  const [studentRows] = await db.query('SELECT * FROM student_reg WHERE number = "9898989898"');
  console.log(`Found in student_reg: ${studentRows.length} row(s)`);

  // Cleanup test rows
  await db.query('DELETE FROM reg_form WHERE phonenum = "9898989898"');
  await db.query('DELETE FROM student_reg WHERE number = "9898989898"');
  console.log("Cleanup completed!");

  await db.end();
}

testLiveApi().catch(console.error);
