const mysql = require('../backend/node_modules/mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  console.log('Connected to RDS MySQL.');
  const [tables] = await db.query('SHOW TABLES');
  for (const row of tables) {
    const tableName = Object.values(row)[0];
    const [cols] = await db.query(`DESCRIBE \`${tableName}\``);
    const hasFirstLogin = cols.some(c => c.Field === 'is_first_login');
    const hasCts = cols.some(c => c.Field.toLowerCase().includes('cts') || c.Field.toLowerCase().includes('ts'));
    if (hasFirstLogin) {
      console.log(`Table ${tableName} has is_first_login`);
    }
  }

  // Check columns of all registration tables
  const regTables = [
    'signup_form', 'student_reg', 'pastor_reg', 'church_reg',
    'pastors_associations', 'ministry_signup', 'independentorganisation_reg',
    'business_table', 'reg_form'
  ];

  console.log('\n--- REGISTRATION TABLES COLUMNS ---');
  for (const t of regTables) {
    const [cols] = await db.query(`DESCRIBE \`${t}\``);
    console.log(`\nTable [${t}]:`);
    console.log(cols.map(c => `  ${c.Field}: ${c.Type} (${c.Null === 'YES' ? 'NULL' : 'NOT NULL'}) [Default: ${c.Default}]`).join('\n'));
  }

  await db.end();
}

main().catch(console.error);
