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
    charset: 'utf8mb4'
  });

  const [tables] = await connection.query('SHOW TABLES;');
  const tableNames = tables.map(r => Object.values(r)[0]);

  console.log(`Checking ${tableNames.length} tables for '?' in text columns...`);

  for (const table of tableNames) {
    try {
      const [cols] = await connection.query(`DESCRIBE \`${table}\`;`);
      const textCols = cols.filter(c => c.Type.includes('varchar') || c.Type.includes('text')).map(c => c.Field);
      if (textCols.length === 0) continue;

      const whereClauses = textCols.map(c => `\`${c}\` LIKE '%?%'`).join(' OR ');
      const [rows] = await connection.query(`SELECT COUNT(*) as cnt FROM \`${table}\` WHERE ${whereClauses};`);
      if (rows[0].cnt > 0) {
        console.log(`Table \`${table}\` has ${rows[0].cnt} rows with '?' in text fields!`);
      }
    } catch (e) {
      // skip views or errors
    }
  }

  await connection.end();
}

main().catch(console.error);
