const https = require('https');
const mysql = require('mysql2/promise');

async function testNamoduRegistration() {
  const testPayload = JSON.stringify({
    source: "namodu",
    is_namodu: true,
    category: "2", // Student from namodu
    name: "Automated Namodu Test Student",
    number: "9797979797",
    district_id: "1",
    constituency_id: "1",
    mandal_id: "1",
    village_id: "1",
    address: "Namodu Street",
    description: "Testing that namodu registration does NOT insert to reg_form"
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

  console.log("Calling live API Gateway with namodu registration...");
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

  // Verify in MySQL RDS database
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  const [regRows] = await db.query('SELECT * FROM reg_form WHERE phonenum = "9797979797"');
  console.log(`Found in reg_form: ${regRows.length} row(s) (Expected: 0)`);

  const [studentRows] = await db.query('SELECT * FROM student_reg WHERE number = "9797979797"');
  console.log(`Found in student_reg: ${studentRows.length} row(s) (Expected: 1)`);

  // Cleanup test rows
  if (regRows.length > 0) {
    await db.query('DELETE FROM reg_form WHERE phonenum = "9797979797"');
  }
  if (studentRows.length > 0) {
    await db.query('DELETE FROM student_reg WHERE number = "9797979797"');
  }
  console.log("Test and cleanup completed successfully!");

  await db.end();
}

testNamoduRegistration().catch(console.error);
