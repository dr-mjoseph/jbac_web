const mysql = require('mysql2/promise');

async function testSimulatedInsert() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  const testPayload = {
    category: "2", // Student in namodu
    name: "Automated Test Student",
    number: "9999999998",
    district_id: "1",
    constituency_id: "1",
    mandal_id: "1",
    village_id: "1",
    address: "Test Address",
    description: "Verification of multi-table registration"
  };

  console.log("Simulating registration logic...");
  
  // 1. Prepare reg_form data
  const phone = String(testPayload.number || '').trim();
  const regFormData = {
    category: testPayload.category,
    name: testPayload.name,
    phonenum: phone,
    password: phone,
    is_first_login: 1,
    district_id: testPayload.district_id,
    constituency_id: testPayload.constituency_id,
    mandal_id: testPayload.mandal_id,
    panchayat_id: testPayload.village_id,
    description: testPayload.description,
    d_in: 0
  };

  const [res1] = await db.query('INSERT INTO reg_form SET ?', [regFormData]);
  console.log("Inserted into reg_form, id:", res1.insertId);

  // 2. Insert into student_reg
  const studentData = {
    studentname: testPayload.name,
    number: phone,
    parentnum: phone,
    pastornum: phone,
    district_id: testPayload.district_id,
    constituency_id: testPayload.constituency_id,
    mandal_id: testPayload.mandal_id,
    village_id: testPayload.village_id,
    address: testPayload.address,
    description: testPayload.description,
    password: phone,
    term: "1",
    d_in: 0,
    approval_ind: 0
  };
  const [res2] = await db.query('INSERT INTO student_reg SET ?', [studentData]);
  console.log("Inserted into student_reg, id:", res2.insertId);

  // Clean up test rows
  await db.query('DELETE FROM reg_form WHERE `reg-id` = ?', [res1.insertId]);
  await db.query('DELETE FROM student_reg WHERE id = ?', [res2.insertId]);
  console.log("Cleaned up test rows successfully!");

  await db.end();
}

testSimulatedInsert().catch(console.error);
