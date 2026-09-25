const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const host = process.env.DB_HOST || 'jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com';
  const user = process.env.DB_USER || 'admin';
  const password = process.env.DB_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA';
  const port = Number(process.env.DB_PORT) || 3306;
  const dbName = process.env.DB_NAME || 'jbac_jbac';

  console.log(`[RDS INIT] Attempting connection to MySQL at ${host}:${port} as ${user}...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true,
      connectTimeout: 20000
    });
    console.log('[RDS INIT] Successfully connected to MySQL server!');
  } catch (connErr) {
    console.error('[RDS INIT ERROR] Connection failed:', connErr.message);
    return;
  }

  try {
    // 1. Ensure database exists
    console.log(`[RDS INIT] Creating database ${dbName} if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`);
    await connection.query(`USE \`${dbName}\`;`);

    // 2. Check existing tables
    const [tables] = await connection.query(`SHOW TABLES FROM \`${dbName}\`;`);
    console.log(`[RDS INIT] Existing tables in ${dbName}: ${tables.length}`);

    // 3. Import structure & seed data if tables are fewer than 30
    if (tables.length < 30) {
      const sqlFile = path.resolve(__dirname, '..', 'database', 'jbac_structure.sql');
      if (fs.existsSync(sqlFile)) {
        console.log(`[RDS INIT] Importing database dump from ${sqlFile}...`);
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');

        // Split queries by semicolon to prevent max packet size issues
        // or execute in chunks
        console.log(`[RDS INIT] Executing SQL batch (${(sqlContent.length / 1024 / 1024).toFixed(2)} MB)...`);
        await connection.query(sqlContent);
        console.log('[RDS INIT] Database dump imported successfully!');
      } else {
        console.warn('[RDS INIT WARN] SQL file not found at:', sqlFile);
      }
    } else {
      console.log(`[RDS INIT] Database already contains ${tables.length} tables. Skipping dump import.`);
    }

    // 4. Verify tables
    const [verifiedTables] = await connection.query(`SHOW TABLES FROM \`${dbName}\`;`);
    console.log(`[RDS INIT SUCCESS] ${dbName} has ${verifiedTables.length} active tables.`);

    // 5. Test a quick query from about_tbl or users
    const [aboutRows] = await connection.query(`SELECT COUNT(*) as count FROM \`about_tbl\`;`).catch(() => [[{ count: 'N/A' }]]);
    console.log(`[RDS INIT] about_tbl row count:`, aboutRows[0]?.count);

  } catch (err) {
    console.error('[RDS INIT ERROR] SQL execution failed:', err.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
