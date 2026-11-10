// scripts/alter_teacher_reg_whatsapp.js
const mysql = require('../backend/node_modules/mysql2/promise');

async function run() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  console.log('Connected to RDS MySQL.');

  const [cols] = await db.query(
    "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='teacher_reg' AND COLUMN_NAME='whatsapp'"
  );

  if (cols[0].cnt === 0) {
    console.log('Adding column `whatsapp` to `teacher_reg`...');
    await db.query(
      "ALTER TABLE `teacher_reg` ADD COLUMN `whatsapp` varchar(25) DEFAULT NULL AFTER `mobile`"
    );
    console.log('Successfully added `whatsapp` column.');
  } else {
    console.log('Column `whatsapp` already exists in `teacher_reg`.');
  }

  const [desc] = await db.query('DESCRIBE `teacher_reg`');
  const wa = desc.find(c => c.Field === 'whatsapp');
  console.log('Verified column in table:', wa);

  await db.end();
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

