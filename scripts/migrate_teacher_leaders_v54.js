const mysql = require('../backend/node_modules/mysql2/promise');

const DB_CONFIG = {
  host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'biUt2TrZ9EZAqn6GXhiA',
  database: 'jbac_jbac',
  port: 3306
};

(async () => {
  const conn = await mysql.createConnection(DB_CONFIG);
  try {
    console.log('Connected to AWS RDS MySQL:', DB_CONFIG.database);

    const [cols] = await conn.query('SHOW COLUMNS FROM `teacher_reg`');
    const existing = new Set(cols.map((c) => c.Field));

    const columnsToAdd = [
      { name: 'leadership', sql: "ALTER TABLE `teacher_reg` ADD COLUMN `leadership` VARCHAR(50) NULL DEFAULT 'NO'" },
      { name: 'leadertype', sql: "ALTER TABLE `teacher_reg` ADD COLUMN `leadertype` VARCHAR(50) NULL DEFAULT '1'" },
      { name: 'generaltype', sql: 'ALTER TABLE `teacher_reg` ADD COLUMN `generaltype` VARCHAR(100) NULL DEFAULT NULL' },
      { name: 'wingtype', sql: 'ALTER TABLE `teacher_reg` ADD COLUMN `wingtype` VARCHAR(60) NULL DEFAULT NULL' },
      { name: 'wingtypes', sql: 'ALTER TABLE `teacher_reg` ADD COLUMN `wingtypes` VARCHAR(255) NULL DEFAULT NULL' },
      { name: 'd_in', sql: 'ALTER TABLE `teacher_reg` ADD COLUMN `d_in` TINYINT NULL DEFAULT 0' },
      { name: 'password', sql: 'ALTER TABLE `teacher_reg` ADD COLUMN `password` VARCHAR(255) NULL DEFAULT NULL' },
      { name: 'is_first_login', sql: 'ALTER TABLE `teacher_reg` ADD COLUMN `is_first_login` TINYINT NULL DEFAULT 0' }
    ];

    for (const col of columnsToAdd) {
      if (!existing.has(col.name)) {
        await conn.query(col.sql);
        console.log(`Added column: ${col.name}`);
      } else {
        console.log(`Column already exists: ${col.name}`);
      }
    }

    const [backfillPwd] = await conn.query(
      "UPDATE `teacher_reg` SET `password` = `mobile` WHERE (`password` IS NULL OR `password` = '') AND `mobile` IS NOT NULL AND `mobile` != ''"
    );
    console.log('Backfilled default password = mobile for rows:', backfillPwd.affectedRows);

    const [backfillDin] = await conn.query(
      'UPDATE `teacher_reg` SET `d_in` = 0 WHERE `d_in` IS NULL'
    );
    console.log('Normalized NULL d_in -> 0 for rows:', backfillDin.affectedRows);

    const [updatedCols] = await conn.query('SHOW COLUMNS FROM `teacher_reg`');
    console.log('Final teacher_reg columns:', updatedCols.map((c) => c.Field).join(', '));
  } finally {
    await conn.end();
  }
})();

