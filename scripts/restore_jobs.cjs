const fs = require('fs');
const path = require('path');
const mysql = require(path.resolve(__dirname, '../backend/node_modules/mysql2/promise'));

async function main() {
  const host = process.env.DB_HOST || 'jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com';
  const user = process.env.DB_USER || 'admin';
  const password = process.env.DB_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA';
  const dbName = process.env.DB_NAME || 'jbac_jbac';

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

  // Let's find the INSERT INTO `jobs` statement in sqlDump
  const prefix = 'INSERT INTO `jobs`';
  const idx = sqlDump.indexOf(prefix);
  if (idx === -1) {
    throw new Error('INSERT INTO `jobs` not found in dump');
  }

  let endIdx = sqlDump.indexOf(';\n', idx);
  if (endIdx === -1) endIdx = sqlDump.indexOf(';\r\n', idx);
  if (endIdx === -1) endIdx = sqlDump.indexOf(';', idx);
  const insertSql = sqlDump.substring(idx, endIdx + 1);

  console.log(`Found INSERT for jobs: ${insertSql.length} bytes`);
  console.log('Sample from insertSql:', insertSql.substring(0, 300));

  await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
  await connection.query('TRUNCATE TABLE `jobs`;');
  await connection.query(insertSql);
  await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

  const [rows] = await connection.query('SELECT id, jobtitle, qualification, experience FROM jobs LIMIT 5;');
  console.log('Restored jobs sample from DB:');
  console.log(rows);

  await connection.end();
}

main().catch(console.error);
