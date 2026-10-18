const mysql = require('../backend/node_modules/mysql2/promise');

async function runMigrations() {
  const db = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  console.log('Connected to RDS MySQL. Running migrations...');

  const queries = [
    // 1. Add CTS column after id if missing
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='student_reg' AND COLUMN_NAME='cts'",
      sql: "ALTER TABLE `student_reg` ADD COLUMN `cts` varchar(255) DEFAULT NULL AFTER `id`"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='pastor_reg' AND COLUMN_NAME='cts'",
      sql: "ALTER TABLE `pastor_reg` ADD COLUMN `cts` varchar(255) DEFAULT NULL AFTER `id`"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='ministry_signup' AND COLUMN_NAME='cts'",
      sql: "ALTER TABLE `ministry_signup` ADD COLUMN `cts` varchar(255) DEFAULT NULL AFTER `id`"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='independentorganisation_reg' AND COLUMN_NAME='cts'",
      sql: "ALTER TABLE `independentorganisation_reg` ADD COLUMN `cts` varchar(255) DEFAULT NULL AFTER `id`"
    },

    // 2. Add whatsapp column if missing
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='student_reg' AND COLUMN_NAME='whatsapp'",
      sql: "ALTER TABLE `student_reg` ADD COLUMN `whatsapp` varchar(25) DEFAULT NULL AFTER `number`"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='pastor_reg' AND COLUMN_NAME='whatsapp'",
      sql: "ALTER TABLE `pastor_reg` ADD COLUMN `whatsapp` varchar(25) DEFAULT NULL AFTER `phonenumber`"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='church_reg' AND COLUMN_NAME='whatsapp'",
      sql: "ALTER TABLE `church_reg` ADD COLUMN `whatsapp` varchar(25) DEFAULT NULL AFTER `contactnumber`"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='ministry_signup' AND COLUMN_NAME='whatsapp'",
      sql: "ALTER TABLE `ministry_signup` ADD COLUMN `whatsapp` varchar(25) DEFAULT NULL AFTER `headnmber`"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='independentorganisation_reg' AND COLUMN_NAME='whatsapp'",
      sql: "ALTER TABLE `independentorganisation_reg` ADD COLUMN `whatsapp` varchar(25) DEFAULT NULL AFTER `contact_num`"
    },

    // 3. Add is_first_login column to track Namodu & Entry initial logins
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='signup_form' AND COLUMN_NAME='is_first_login'",
      sql: "ALTER TABLE `signup_form` ADD COLUMN `is_first_login` tinyint(1) DEFAULT 0"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='student_reg' AND COLUMN_NAME='is_first_login'",
      sql: "ALTER TABLE `student_reg` ADD COLUMN `is_first_login` tinyint(1) DEFAULT 0"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='pastor_reg' AND COLUMN_NAME='is_first_login'",
      sql: "ALTER TABLE `pastor_reg` ADD COLUMN `is_first_login` tinyint(1) DEFAULT 0"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='church_reg' AND COLUMN_NAME='is_first_login'",
      sql: "ALTER TABLE `church_reg` ADD COLUMN `is_first_login` tinyint(1) DEFAULT 0"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='pastors_associations' AND COLUMN_NAME='is_first_login'",
      sql: "ALTER TABLE `pastors_associations` ADD COLUMN `is_first_login` tinyint(1) DEFAULT 0"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='ministry_signup' AND COLUMN_NAME='is_first_login'",
      sql: "ALTER TABLE `ministry_signup` ADD COLUMN `is_first_login` tinyint(1) DEFAULT 0"
    },
    {
      check: "SELECT count(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='jbac_jbac' AND TABLE_NAME='independentorganisation_reg' AND COLUMN_NAME='is_first_login'",
      sql: "ALTER TABLE `independentorganisation_reg` ADD COLUMN `is_first_login` tinyint(1) DEFAULT 0"
    }
  ];

  for (const q of queries) {
    const [res] = await db.query(q.check);
    if (res[0].cnt === 0) {
      console.log('Executing:', q.sql);
      await db.query(q.sql);
      console.log('Done.');
    } else {
      console.log('Column already exists for check:', q.check);
    }
  }

  console.log('All migrations completed successfully.');
  await db.end();
}

runMigrations().catch(console.error);
