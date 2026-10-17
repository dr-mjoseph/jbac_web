const mysql = require('mysql2/promise');

async function test() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  const tables = ['student_reg', 'pastor_reg', 'church_reg', 'pastors_associations', 'ministry_signup', 'independentorganisation_reg'];
  for (const t of tables) {
    const [rows] = await db.query(`SELECT * FROM \`${t}\` ORDER BY id DESC LIMIT 1`);
    console.log(`\n=== Table: ${t} (Count: ${(await db.query(`SELECT COUNT(*) as c FROM \`${t}\``))[0][0].c}) ===`);
    if (rows.length > 0) {
      console.log('Sample row:', JSON.stringify(rows[0]));
    } else {
      const [cols] = await db.query(`DESCRIBE \`${t}\``);
      console.log('Columns:', cols.map(c => c.Field + ' (' + c.Type + ')').join(', '));
    }
  }
  await db.end();
}
test().catch(console.error);
