const mysql = require('../backend/node_modules/mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  const [reg] = await db.query('SELECT * FROM reg_form ORDER BY 1 DESC LIMIT 5');
  console.log('LATEST REG_FORM:');
  console.log(JSON.stringify(reg, null, 2));

  const [sign] = await db.query('SELECT id, cts, fname, mobile_number, from_signup, whatsapp, district_id, mandal_id, panchayat_id FROM signup_form ORDER BY id DESC LIMIT 5');
  console.log('LATEST SIGNUP_FORM:');
  console.log(JSON.stringify(sign, null, 2));

  await db.end();
}

main().catch(console.error);
