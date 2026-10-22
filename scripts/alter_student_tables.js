const mysql = require('../backend/node_modules/mysql2/promise');

async function runAlterations() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  console.log('Connected to RDS MySQL.');

  const tables = ['student_reg', 'students'];

  const columnsToAdd = [
    { col: 'study', type: 'varchar(255) DEFAULT NULL', after: 'group_branch' },
    { col: 'tmarks', type: 'varchar(255) DEFAULT NULL', after: 'totmarks' },
    { col: 'mmarks', type: 'varchar(255) DEFAULT NULL', after: 'maxmarks' },
    { col: 'passexam', type: 'varchar(255) DEFAULT NULL', after: 'exampass' },
    { col: 'whatsappnumber', type: 'varchar(25) DEFAULT NULL', after: 'whatsapp' },
    { col: 'fathername', type: 'varchar(255) DEFAULT NULL', after: 'studentname' },
    { col: 'mother', type: 'varchar(255) DEFAULT NULL', after: 'term' },
    { col: 'orphon', type: 'varchar(255) DEFAULT NULL', after: 'mother' },
    { col: 'branch', type: 'varchar(255) DEFAULT NULL', after: 'group_branch' }
  ];

  for (const table of tables) {
    console.log(`\nChecking columns for ${table}...`);
    const [existingCols] = await db.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME=?`,
      [table]
    );
    const existingColNames = existingCols.map(c => c.COLUMN_NAME);

    for (const c of columnsToAdd) {
      if (!existingColNames.includes(c.col)) {
        try {
          const afterClause = (c.after && existingColNames.includes(c.after)) ? `AFTER \`${c.after}\`` : '';
          const sql = `ALTER TABLE \`${table}\` ADD COLUMN \`${c.col}\` ${c.type} ${afterClause}`.trim();
          console.log(`Adding ${c.col} to ${table}: ${sql}`);
          await db.query(sql);
          console.log(`  Added successfully!`);
          existingColNames.push(c.col);
        } catch (err) {
          console.error(`  Error adding ${c.col} to ${table}:`, err.message);
        }
      } else {
        console.log(`  ${c.col} already exists in ${table}.`);
      }
    }
  }

  // Also check talent column in both tables
  for (const table of tables) {
    const [tCol] = await db.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME=? AND COLUMN_NAME='talent'`,
      [table]
    );
    if (tCol.length === 0) {
      console.log(`Adding talent column to ${table}...`);
      await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`talent\` varchar(255) DEFAULT NULL AFTER \`caste\``);
      console.log(`  talent column added to ${table}!`);
    } else {
      console.log(`  talent column is present in ${table}.`);
    }
  }

  console.log('\nMigration complete!');
  await db.end();
}

runAlterations().catch(console.error);
