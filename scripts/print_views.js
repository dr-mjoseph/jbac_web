const mysql = require('../backend/node_modules/mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  const views = [
    'believers', 'business', 'churches', 'meetings', 'ministries',
    'organisations', 'pastor_associations', 'pastors', 'students'
  ];

  for (const v of views) {
    const [createView] = await db.query(`SHOW CREATE VIEW \`${v}\``);
    console.log(`=== VIEW ${v} ===\n${createView[0]['Create View']}\n`);
  }

  await db.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
