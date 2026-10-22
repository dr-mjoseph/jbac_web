const mysql = require('../backend/node_modules/mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  const targetTables = [
    'attacks', 'believers', 'business', 'business_table', 'church_timings',
    'churches', 'colleges', 'institutes', 'jobs', 'marriages', 'meetings',
    'ministries', 'organisations', 'pastor_associations', 'pastors',
    'reg_form', 'students', 'wish_form'
  ];

  for (const t of targetTables) {
    const [tableInfo] = await db.query(
      `SELECT TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'jbac_jbac' AND TABLE_NAME = ?`,
      [t]
    );
    const type = tableInfo[0] ? tableInfo[0].TABLE_TYPE : 'NOT FOUND';
    const [cols] = await db.query(`SHOW COLUMNS FROM \`${t}\``);
    const hasState = cols.some(c => c.Field === 'state_id');
    console.log(`${t.padEnd(25)}: ${type.padEnd(12)} | has state_id: ${hasState}`);
  }

  await db.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
