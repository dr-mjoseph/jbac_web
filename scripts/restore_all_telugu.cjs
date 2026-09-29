const fs = require('fs');
const path = require('path');
const mysql = require(path.resolve(__dirname, '../backend/node_modules/mysql2/promise'));

async function main() {
  const host = process.env.DB_HOST || 'jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com';
  const user = process.env.DB_USER || 'admin';
  const password = process.env.DB_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA';
  const dbName = process.env.DB_NAME || 'jbac_jbac';

  console.log(`Connecting to RDS at ${host}...`);
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
  await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

  const dumpPath = path.resolve(__dirname, '../database/jbac_structure.sql');
  const sqlDump = fs.readFileSync(dumpPath, 'utf8');

  const tablesToRestore = [
    'education',
    'adds_data',
    'banner_dlt_t',
    'church_reg',
    'docment_tbl',
    'events',
    'helps',
    'independentorganisation_reg',
    'institutes',
    'ministry_signup',
    'mndls_lst_t',
    'pastor_reg',
    'pastors_associations',
    'post_news',
    'reg_form',
    'signup_form',
    'student_reg',
    'wish_form',
    'Sheet1',
    'churchdenomation',
    'services',
    'leaderlevel',
    'dstrct',
    'const_dtl_t',
    'pnchyt_lst_t',
    'wingleaderstype',
    'about_tbl',
    'gallery_category',
    'sub_modules',
    'main_modules'
  ];

  console.log(`Starting restoration of ${tablesToRestore.length} tables with pristine UTF-8 Telugu...`);

  for (const table of tablesToRestore) {
    const regex = new RegExp(`INSERT INTO \`${table}\``, 'g');
    let match;
    let stmts = [];

    while ((match = regex.exec(sqlDump)) !== null) {
      const start = match.index;
      let end = sqlDump.indexOf(';\n', start);
      if (end === -1) end = sqlDump.indexOf(';\r\n', start);
      if (end === -1) end = sqlDump.indexOf(';', start);
      if (end !== -1) {
        let stmt = sqlDump.substring(start, end + 1);
        // Use REPLACE INTO so existing rows are updated with pristine UTF-8 without violating PKs
        stmt = stmt.replace(`INSERT INTO \`${table}\``, `REPLACE INTO \`${table}\``);
        stmts.push(stmt);
      }
    }

    if (stmts.length === 0) {
      console.log(`[SKIP] No INSERT statements found for ${table}`);
      continue;
    }

    console.log(`Restoring ${table} (${stmts.length} statement(s))...`);
    for (let i = 0; i < stmts.length; i++) {
      try {
        await connection.query(stmts[i]);
      } catch (err) {
        console.error(`  [WARN] ${table} stmt ${i + 1} error:`, err.message);
      }
    }
    console.log(`[SUCCESS] Restored ${table}!`);
  }

  await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('\n--- All tables restored! ---');

  // Verify samples:
  const [edu] = await connection.query('SELECT name FROM education LIMIT 5;');
  console.log('Education sample:', edu.map(e => e.name));

  const [pastors] = await connection.query('SELECT pastorname, address FROM pastor_reg WHERE address IS NOT NULL AND address != "" LIMIT 3;');
  console.log('Pastor reg sample:', pastors);

  const [news] = await connection.query('SELECT title FROM post_news LIMIT 3;');
  console.log('News sample:', news.map(n => n.title));

  await connection.end();
}

main().catch(console.error);
