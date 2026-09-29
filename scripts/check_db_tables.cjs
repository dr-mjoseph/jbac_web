const mysql = require('../backend/node_modules/mysql2/promise');

async function main() {
  const conn = await mysql.createConnection('mysql://admin:biUt2TrZ9EZAqn6GXhiA@jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com:3306/jbac_jbac');
  
  for (const t of ['pastors', 'pastor_reg', 'churches', 'church_timings', 'church_reg']) {
    try {
      const [cols] = await conn.query(`DESCRIBE ${t}`);
      const [rows] = await conn.query(`SELECT COUNT(*) as count FROM ${t}`);
      console.log(`\nTable ${t} (rows: ${rows[0].count}):`, cols.map(c => c.Field).join(', '));
    } catch (e) {
      console.log(`Table ${t}: ${e.message}`);
    }
  }

  await conn.end();
}

main().catch(console.error);
