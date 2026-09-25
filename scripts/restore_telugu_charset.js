const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const host = process.env.DB_HOST || 'jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com';
  const user = process.env.DB_USER || 'admin';
  const password = process.env.DB_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA';
  const dbName = process.env.DB_NAME || 'jbac_jbac';

  console.log(`Connecting to ${host} with utf8mb4 charset...`);
  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database: dbName,
    charset: 'utf8mb4',
    multipleStatements: true
  });

  await connection.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;');
  await connection.query('SET CHARACTER SET utf8mb4;');

  const dumpPath = path.resolve(__dirname, '..', 'database', 'jbac_structure.sql');
  const sqlDump = fs.readFileSync(dumpPath, 'utf8');

  // Master dropdown & lookup tables containing Telugu
  const targetTables = [
    'churchdenomation',
    'leaderlevel',
    'dstrct',
    'const_dtl_t',
    'mndls_lst_t',
    'pnchyt_lst_t',
    'services',
    'education',
    'wingleaderstype',
    'about_tbl',
    'Indian-states',
    'gallery_category',
    'sub_modules',
    'main_modules'
  ];

  console.log('Restoring UTF-8 Telugu characters for tables:', targetTables);

  for (const table of targetTables) {
    // Find CREATE TABLE and INSERT INTO blocks for this table
    const insertPrefix = `INSERT INTO \`${table}\``;
    const insertIdx = sqlDump.indexOf(insertPrefix);
    if (insertIdx === -1) {
      console.log(`[SKIP] No INSERT found for ${table}`);
      continue;
    }

    // Find the end of this INSERT statement (terminated by semicolon followed by newline)
    let endIdx = sqlDump.indexOf(';\n', insertIdx);
    if (endIdx === -1) {
      endIdx = sqlDump.indexOf(';', insertIdx);
    }
    const insertSql = sqlDump.substring(insertIdx, endIdx + 1);

    console.log(`Restoring ${table} (${insertSql.length} bytes)...`);
    try {
      await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await connection.query(`TRUNCATE TABLE \`${table}\`;`);
      await connection.query(insertSql);
      await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
      console.log(`[SUCCESS] ${table} restored with pristine Telugu text!`);
    } catch (err) {
      console.error(`[ERROR] Failed to restore ${table}:`, err.message);
    }
  }

  // Verify churchdenomation
  const [denoms] = await connection.query('SELECT id, denomation_name FROM churchdenomation LIMIT 5;');
  console.log('\nVerified churchdenomation sample:');
  console.log(denoms);

  // Verify leaderlevel
  const [levels] = await connection.query('SELECT id, level FROM leaderlevel LIMIT 5;');
  console.log('\nVerified leaderlevel sample:');
  console.log(levels);

  await connection.end();
}

main().catch(console.error);
