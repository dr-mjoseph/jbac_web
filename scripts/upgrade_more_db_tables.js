const mysql = require('../backend/node_modules/mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  const baseTables = [
    'attacks', 'business_table', 'church_timings', 'colleges',
    'institutes', 'jobs', 'marriages', 'reg_form', 'wish_form'
  ];

  for (const t of baseTables) {
    try {
      const [cols] = await db.query(`SHOW COLUMNS FROM \`${t}\` LIKE 'state_id'`);
      if (cols.length === 0) {
        console.log(`Adding state_id and state to ${t}...`);
        await db.query(`ALTER TABLE \`${t}\` ADD COLUMN state_id INT DEFAULT 1, ADD COLUMN state VARCHAR(100) DEFAULT 'Andhra Pradesh'`);
        await db.query(`UPDATE \`${t}\` SET state_id = 1, state = 'Andhra Pradesh' WHERE state_id IS NULL`);
        console.log(`Updated ${t}`);
      } else {
        console.log(`${t} already has state_id`);
      }
    } catch (e) {
      console.error(`Error on ${t}:`, e.message);
    }
  }

  // Check views
  const views = [
    'believers', 'business', 'churches', 'meetings', 'ministries',
    'organisations', 'pastor_associations', 'pastors', 'students'
  ];

  for (const v of views) {
    try {
      const [createView] = await db.query(`SHOW CREATE VIEW \`${v}\``);
      console.log(`View ${v}:`, createView[0]['Create View'].substring(0, 150));
      // Re-create or refresh view if needed
      const [cols] = await db.query(`SHOW COLUMNS FROM \`${v}\` LIKE 'state_id'`);
      console.log(`View ${v} has state_id: ${cols.length > 0}`);
      if (cols.length === 0) {
        // Let's see what table it selects from
        console.log(`View ${v} needs state_id projection!`);
      }
    } catch (e) {
      console.error(`Error checking view ${v}:`, e.message);
    }
  }

  await db.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
