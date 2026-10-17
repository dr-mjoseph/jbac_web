const mysql = require('mysql2/promise');

async function main() {
    const db = await mysql.createConnection({
        host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
        user: 'admin',
        password: 'biUt2TrZ9EZAqn6GXhiA',
        database: 'jbac_jbac'
    });

    console.log('Connected to RDS.');

    // 1. Soft delete test doctors
    const [res1] = await db.query(
        "UPDATE family_councelling_doctors SET d_in = 1 WHERE phone_number IN ('9848012345', '9848023456', '9848034567') OR doctor_name LIKE '%Sarah John%' OR doctor_name LIKE '%David Paul%' OR doctor_name LIKE '%Grace Varghese%' OR doctor_name LIKE '%Samuel Kumar%' OR doctor_name LIKE '%Ruth Mary%'"
    );
    console.log('Soft-deleted test doctors, affected rows:', res1.affectedRows);

    const [docs] = await db.query("SELECT id, doctor_name, phone_number, is_active, d_in FROM family_councelling_doctors");
    console.log('Active/Inactive doctors:', docs);

    // 2. Check reg_form columns and sample rows
    const [cols] = await db.query("DESCRIBE reg_form");
    console.log('reg_form columns:', cols.map(c => `${c.Field} (${c.Type})`));

    const [sample] = await db.query("SELECT `reg-id`, name, phonenum, password, is_first_login FROM reg_form LIMIT 5");
    console.log('reg_form sample:', sample);

    await db.end();
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
