const mysql = require('../backend/node_modules/mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac',
    connectTimeout: 20000
  });
  console.log('Connected to RDS MySQL.');

  const [cols] = await conn.query('DESCRIBE helps');
  const colNames = cols.map(c => c.Field);
  console.log('Before migration columns:', colNames);

  const alterations = [
    { name: 'denomination_id', sql: 'ALTER TABLE `helps` ADD COLUMN `denomination_id` int DEFAULT NULL AFTER `mobile_number`' },
    { name: 'state_id', sql: 'ALTER TABLE `helps` ADD COLUMN `state_id` int DEFAULT NULL AFTER `denomination_id`' },
    { name: 'state', sql: 'ALTER TABLE `helps` ADD COLUMN `state` varchar(100) DEFAULT NULL AFTER `state_id`' },
    { name: 'district_id', sql: 'ALTER TABLE `helps` ADD COLUMN `district_id` int DEFAULT NULL AFTER `state`' },
    { name: 'constituency_id', sql: 'ALTER TABLE `helps` ADD COLUMN `constituency_id` int DEFAULT NULL AFTER `district_id`' },
    { name: 'mandal_id', sql: 'ALTER TABLE `helps` ADD COLUMN `mandal_id` int DEFAULT NULL AFTER `constituency_id`' },
    { name: 'panchayat_id', sql: 'ALTER TABLE `helps` ADD COLUMN `panchayat_id` int DEFAULT NULL AFTER `mandal_id`' }
  ];

  for (const alt of alterations) {
    if (!colNames.includes(alt.name)) {
      console.log(`Adding column ${alt.name}...`);
      await conn.query(alt.sql);
      colNames.push(alt.name);
    } else {
      console.log(`Column ${alt.name} already exists.`);
    }
  }

  const [colsAfter] = await conn.query('DESCRIBE helps');
  console.log('After migration columns:', colsAfter.map(c => `${c.Field} (${c.Type})`));

  await conn.end();
  console.log('Migration completed successfully.');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

