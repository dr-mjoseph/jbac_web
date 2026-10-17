const mysql = require('mysql2/promise');

async function test() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  const tables = ['student_reg', 'pastor_reg', 'church_reg', 'pastors_associations', 'ministry_signup', 'independentorganisation_reg', 'business_table'];
  for (const t of tables) {
    const [cols] = await db.query(`DESCRIBE \`${t}\``);
    const required = cols.filter(c => c.Null === 'NO' && c.Default === null && c.Extra !== 'auto_increment');
    console.log(`\nTable ${t} required columns (Null=NO, Default=null, not auto_inc):`);
    console.log(required.map(c => c.Field + ' (' + c.Type + ')').join(', ') || 'None!');
  }
  await db.end();
}
test().catch(console.error);
