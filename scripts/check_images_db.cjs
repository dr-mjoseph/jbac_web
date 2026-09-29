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

  const [jobs] = await connection.query('SELECT id, jobtitle, qualification, image FROM jobs LIMIT 10;');
  console.log('--- Sample Jobs from DB ---');
  console.log(jobs);

  const [sampleImages] = await connection.query('SELECT id, image FROM jobs WHERE image IS NOT NULL AND image != "" LIMIT 5;');
  console.log('--- Sample Non-empty Images in jobs ---');
  console.log(sampleImages);

  const [events] = await connection.query('SELECT id, image FROM events WHERE image IS NOT NULL LIMIT 5;');
  console.log('--- Sample Images in events ---');
  console.log(events);

  await connection.end();
}

main().catch(console.error);
