const https = require('https');
const mysql = require('../backend/node_modules/mysql2/promise');

function postJson(url, data) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const body = JSON.stringify(data);
        const req = https.request({
            hostname: u.hostname,
            path: u.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(resData) });
                } catch(e) {
                    resolve({ status: res.statusCode, raw: resData });
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

(async () => {
    const db = await mysql.createConnection({
        host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
        user: 'admin',
        password: 'biUt2TrZ9EZAqn6GXhiA',
        database: 'jbac_jbac'
    });

    console.log('--- CLEANING UP ERRONEOUS TEST RECORDS ---');
    const [uRes] = await db.query('UPDATE users SET otp = 0 WHERE otp = 2147483647 OR otp = 1111111111');
    console.log('Cleaned users rows with bad otp:', uRes.affectedRows);

    const [sRes] = await db.query("UPDATE student_reg SET whatsapp = NULL, parentnum = NULL, pastornum = NULL, password = NULL WHERE studentname = 'Isaac' AND number = '1111111111'");
    console.log('Cleaned Isaac row in student_reg:', sRes.affectedRows);

    console.log('\n--- TESTING LIVE API REGISTRATION ---');
    const testPhone = '9000099988';
    const regPayload = {
        category: '2',
        name: 'AutoVerifyStudent',
        number: testPhone,
        description: 'verification test'
    };
    const regRes = await postJson('https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/postregform', regPayload);
    console.log('Registration Response:', JSON.stringify(regRes.body));

    console.log('\n--- VERIFYING STUDENT_REG IN DB ---');
    const [students] = await db.query('SELECT id, studentname, number, whatsapp, parentnum, pastornum, password FROM student_reg WHERE number = ?', [testPhone]);
    console.log('student_reg record:', JSON.stringify(students[0]));

    console.log('\n--- VERIFYING USERS TABLE IN DB ---');
    const [users] = await db.query('SELECT id, name, number, email, otp FROM users WHERE number = ?', [testPhone]);
    console.log('users record:', JSON.stringify(users[0]));

    console.log('\n--- TESTING LOGIN WITH REGISTERED NUMBER ---');
    const loginPayload = {
        category: '2',
        mobile_number: testPhone,
        password: testPhone
    };
    const loginRes = await postJson('https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/passwordwebsitelogin', loginPayload);
    console.log('Login Response:', JSON.stringify(loginRes.body));

    // Cleanup test record
    await db.query('DELETE FROM student_reg WHERE number = ?', [testPhone]);
    await db.query('DELETE FROM users WHERE number = ?', [testPhone]);
    console.log('\nTest record cleaned up.');

    await db.end();
})();
