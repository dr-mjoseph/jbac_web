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
    let sql = createView[0]['Create View'];
    // sql is like: CREATE ALGORITHM=UNDEFINED DEFINER=... VIEW `v` AS select col1, col2 from `base`
    // Let's replace 'from `' with ', `base`.`state_id` AS `state_id`, `base`.`state` AS `state` from `'
    const match = sql.match(/from\s+`([^`]+)`/i);
    if (match) {
      const baseTable = match[1];
      const fromClause = match[0];
      const newSelectEnd = `, \`${baseTable}\`.\`state_id\` AS \`state_id\`, \`${baseTable}\`.\`state\` AS \`state\` ${fromClause}`;
      const newSql = sql.replace(fromClause, newSelectEnd).replace(/^CREATE\s+/i, 'CREATE OR REPLACE ');
      console.log(`Updating view ${v} on ${baseTable}...`);
      await db.query(newSql);
      console.log(`Updated view ${v} successfully!`);
    }
  }

  await db.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
