const mysql = require('../backend/node_modules/mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });
  console.log('Connected to RDS MySQL.');

  // 1. Check helps table
  const [hCols] = await conn.query('DESCRIBE helps');
  const hColNames = hCols.map(c => c.Field);
  console.log('Current helps columns:', hColNames);

  if (!hColNames.includes('address')) {
    console.log('Adding address to helps...');
    await conn.query('ALTER TABLE `helps` ADD COLUMN `address` text DEFAULT NULL AFTER `mobile_number`');
    console.log('Added address to helps.');
  } else {
    console.log('address already exists in helps.');
  }

  // 2. Check institutes table
  const [iCols] = await conn.query('DESCRIBE institutes');
  const iColNames = iCols.map(c => c.Field);
  console.log('Current institutes columns:', iColNames);

  if (!iColNames.includes('owner_name')) {
    console.log('Adding owner_name to institutes...');
    await conn.query('ALTER TABLE `institutes` ADD COLUMN `owner_name` varchar(255) DEFAULT NULL AFTER `institutename`');
    console.log('Added owner_name to institutes.');
  } else {
    console.log('owner_name already exists in institutes.');
  }

  // Check college_type column type
  const collegeTypeCol = iCols.find(c => c.Field === 'college_type');
  console.log('college_type column type:', collegeTypeCol ? collegeTypeCol.Type : 'not found');
  if (collegeTypeCol && !collegeTypeCol.Type.includes('text')) {
    console.log('Expanding college_type to TEXT...');
    await conn.query('ALTER TABLE `institutes` MODIFY COLUMN `college_type` text DEFAULT NULL');
    console.log('Modified college_type to TEXT.');
  }

  // Verify
  const [hColsAfter] = await conn.query('DESCRIBE helps');
  console.log('Updated helps columns:', hColsAfter.map(c => c.Field));

  const [iColsAfter] = await conn.query('DESCRIBE institutes');
  console.log('Updated institutes columns:', iColsAfter.map(c => c.Field));

  await conn.end();
  console.log('Migration completed successfully.');
}

main().catch(err => {
  console.error('Error during migration:', err);
  process.exit(1);
});
