const mysql = require('../backend/node_modules/mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  const [tables] = await db.query("SHOW TABLES");
  const tableNames = tables.map(r => Object.values(r)[0]);
  console.log(`Found ${tableNames.length} tables`);

  for (const t of tableNames) {
    const [cols] = await db.query(`SHOW COLUMNS FROM \`${t}\``);
    const colNames = cols.map(c => c.Field);
    const hasStateId = colNames.includes('state_id');
    const hasDistrict = colNames.some(c => c.toLowerCase().includes('dist'));
    if (hasDistrict || hasStateId) {
      console.log(`Table: ${t.padEnd(35)} | has state_id: ${hasStateId ? 'YES' : 'NO '} | has district: ${hasDistrict ? 'YES' : 'NO '}`);
    }
  }

  await db.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
