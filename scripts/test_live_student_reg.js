const https = require('https');
const mysql = require('../backend/node_modules/mysql2/promise');

async function testLiveStudentRegistration() {
  const testStudent = {
    studentname: 'Test Student Automated ' + Date.now(),
    number: '98765' + Math.floor(10000 + Math.random() * 90000),
    study: 'Computer Science Related',
    schname: 'St. Pauls College',
    district_id: '1',
    constituency_id: '1',
    mandal_id: '1',
    village_id: '1',
    denomination_id: '1',
    talent: 'Video editing',
    tmarks: '950',
    mmarks: '1000',
    resdistricts: '1',
    resconstituencyname: '1',
    resmandals: '1',
    respanchayati: '1',
    villagename: 'Test Village',
    leadership: 'YES',
    generaltype: 'State Level',
    term: true
  };

  console.log('Testing live API /dashboardapi/studentsignup with payload:');
  console.log(testStudent);

  const dataString = JSON.stringify(testStudent);

  const options = {
    hostname: '1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com',
    path: '/dashboardapi/studentsignup',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dataString)
    }
  };

  const response = await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(dataString);
    req.end();
  });

  console.log('\nResponse from live API:', response.status);
  console.log(response.body);

  const resJson = JSON.parse(response.body);
  if (resJson.status === 200) {
    console.log('\nRegistration SUCCESS! Verifying record directly in MySQL RDS student_reg table...');
    const db = await mysql.createConnection({
      host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
      user: 'admin',
      password: 'biUt2TrZ9EZAqn6GXhiA',
      database: 'jbac_jbac'
    });

    const [rows] = await db.query(
      'SELECT id, studentname, number, study, group_branch, tmarks, totmarks, mmarks, maxmarks, talent, schname, resdistricts, villagename, password FROM student_reg WHERE number = ?',
      [testStudent.number]
    );

    console.log('Record in MySQL student_reg:');
    console.table(rows);

    // Clean up test record
    await db.query('DELETE FROM student_reg WHERE number = ?', [testStudent.number]);
    await db.query('DELETE FROM users WHERE number = ?', [testStudent.number]);
    console.log('Cleaned up test record.');

    await db.end();
  } else {
    console.error('Registration FAILED!');
    process.exit(1);
  }
}

testLiveStudentRegistration().catch(err => {
  console.error(err);
  process.exit(1);
});
