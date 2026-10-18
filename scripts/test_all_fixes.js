const mysql = require('../backend/node_modules/mysql2/promise');

async function test() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  console.log('Connected to RDS MySQL.');

  // Test 1: Simulate server.js logic for Namodu Believer Registration
  const testPhone = '9999900001';
  const testWhatsapp = '9999900002';
  const testName = 'Test Namodu Believer';

  // Clean up any old test records
  await db.query('DELETE FROM signup_form WHERE mobile_number = ?', [testPhone]);
  await db.query('DELETE FROM users WHERE number = ?', [testPhone]);

  // Compute Indian CTS
  const d = new Date();
  const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
  const cts = istTime.toISOString().replace('T', ' ').substring(0, 19);

  // Namodu registration insert into signup_form
  const [res1] = await db.query(
    `INSERT INTO signup_form (cts, fname, mobile_number, whatsapp, district_id, constituency_id, mandal_id, panchayat_id, password, retypepassword, term, from_signup, d_in, approval_ind, is_first_login)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Yes', 'believer', 0, 0, 1)`,
    [cts, testName, testPhone, testWhatsapp, '16', '766', '266', '550', testPhone, testPhone]
  );
  console.log('Test 1 - Namodu Believer inserted into signup_form, ID:', res1.insertId);

  // Verify columns in DB
  const [rows1] = await db.query('SELECT id, cts, fname, mobile_number, whatsapp, district_id, mandal_id, panchayat_id, password, is_first_login FROM signup_form WHERE id = ?', [res1.insertId]);
  console.log('Namodu Believer DB row:', rows1[0]);

  // Test 2: Simulate Regular Believer Registration (with districts, mandals, panchayati, constituencyname)
  const regPhone = '9999900003';
  const regName = 'Test Regular Believer';
  await db.query('DELETE FROM signup_form WHERE mobile_number = ?', [regPhone]);
  await db.query('DELETE FROM users WHERE number = ?', [regPhone]);

  const [res2] = await db.query(
    `INSERT INTO signup_form (cts, fname, mobile_number, whatsapp, district_id, constituency_id, mandal_id, panchayat_id, password, retypepassword, term, from_signup, d_in, approval_ind, is_first_login)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Yes', 'believer', 0, 0, 0)`,
    [cts, regName, regPhone, '9999900003', '13', '748', '345', '120', 'mySecretPass', 'mySecretPass']
  );
  console.log('\nTest 2 - Regular Believer inserted into signup_form, ID:', res2.insertId);

  const [rows2] = await db.query('SELECT id, cts, fname, mobile_number, district_id, mandal_id, panchayat_id, password, is_first_login FROM signup_form WHERE id = ?', [res2.insertId]);
  console.log('Regular Believer DB row:', rows2[0]);

  // Test 3: Check is_first_login logic for both
  console.log('\nTest 3 - Login response simulation:');
  console.log('Namodu user is_first_login:', rows1[0].is_first_login, '-> Should return status 201 (first_login: true)');
  console.log('Regular believer is_first_login:', rows2[0].is_first_login, '-> Should return status 200 (normal login)');

  // Clean up test rows
  await db.query('DELETE FROM signup_form WHERE mobile_number IN (?, ?)', [testPhone, regPhone]);
  console.log('\nCleaned up test rows.');

  await db.end();
  console.log('Done.');
}

test().catch(console.error);
