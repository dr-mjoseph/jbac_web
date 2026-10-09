const mysql = require('../backend/node_modules/mysql2/promise');

async function createTables() {
  const conn = await mysql.createConnection('mysql://admin:biUt2TrZ9EZAqn6GXhiA@jbac-mysql-db-v2.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com:3306/jbac_jbac');
  console.log('Connected to RDS successfully.');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS \`family_councelling_doctors\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`user_id\` INT NULL,
      \`doctor_name\` VARCHAR(255) NOT NULL,
      \`specialization\` VARCHAR(255) NOT NULL,
      \`qualification\` VARCHAR(255) NULL,
      \`experience_years\` VARCHAR(50) NULL,
      \`phone_number\` VARCHAR(50) NOT NULL,
      \`email\` VARCHAR(255) NULL,
      \`password\` VARCHAR(255) NULL,
      \`license_number\` VARCHAR(100) NULL,
      \`category_id\` INT DEFAULT 8,
      \`consultation_fee\` VARCHAR(100) DEFAULT 'Free / Volunteer Service',
      \`available_days\` VARCHAR(255) DEFAULT 'Monday to Saturday',
      \`available_time_start\` VARCHAR(50) DEFAULT '10:00 AM',
      \`available_time_end\` VARCHAR(50) DEFAULT '05:00 PM',
      \`location\` VARCHAR(255) NULL,
      \`address\` TEXT NULL,
      \`bio\` TEXT NULL,
      \`image\` LONGTEXT NULL,
      \`is_active\` TINYINT(1) DEFAULT 1,
      \`created_by\` VARCHAR(100) DEFAULT 'doctor',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`d_in\` TINYINT(1) DEFAULT 0,
      INDEX idx_phone (\`phone_number\`),
      INDEX idx_category (\`category_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('Created family_councelling_doctors table.');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS \`family_councelling_appointments\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`doctor_id\` INT NOT NULL,
      \`doctor_name\` VARCHAR(255) NULL,
      \`family_name\` VARCHAR(255) NOT NULL,
      \`contact_person\` VARCHAR(255) NOT NULL,
      \`phone_number\` VARCHAR(50) NOT NULL,
      \`email\` VARCHAR(255) NULL,
      \`user_id\` INT NULL,
      \`appointment_date\` DATE NOT NULL,
      \`appointment_time\` VARCHAR(50) NOT NULL,
      \`members_count\` INT DEFAULT 1,
      \`counselling_type\` VARCHAR(100) DEFAULT 'Marriage & Family Counselling',
      \`notes\` TEXT NULL,
      \`status\` VARCHAR(50) DEFAULT 'Confirmed',
      \`doctor_notes\` TEXT NULL,
      \`user_voice_audio\` LONGTEXT NULL,
      \`user_voice_text\` TEXT NULL,
      \`user_language\` VARCHAR(20) DEFAULT 'te',
      \`doctor_voice_audio\` LONGTEXT NULL,
      \`doctor_voice_text\` TEXT NULL,
      \`doctor_language\` VARCHAR(20) DEFAULT 'te',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`d_in\` TINYINT(1) DEFAULT 0,
      INDEX idx_doctor (\`doctor_id\`),
      INDEX idx_user (\`user_id\`),
      INDEX idx_phone (\`phone_number\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('Created family_councelling_appointments table.');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS \`councelling_voice_messages\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`appointment_id\` INT NULL,
      \`doctor_id\` INT NOT NULL,
      \`user_id\` INT NULL,
      \`sender_type\` VARCHAR(20) NOT NULL,
      \`sender_name\` VARCHAR(255) NOT NULL,
      \`sender_phone\` VARCHAR(50) NULL,
      \`audio_data\` LONGTEXT NULL,
      \`transcribed_text\` TEXT NULL,
      \`language\` VARCHAR(20) DEFAULT 'te',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`d_in\` TINYINT(1) DEFAULT 0,
      INDEX idx_appt (\`appointment_id\`),
      INDEX idx_doctor (\`doctor_id\`),
      INDEX idx_user (\`user_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('Created councelling_voice_messages table.');

  // Create views for synonyms so any query referencing marriage_councelling or councelling works
  await conn.query(`CREATE OR REPLACE VIEW \`marriage_councelling_doctors\` AS SELECT * FROM \`family_councelling_doctors\``);
  await conn.query(`CREATE OR REPLACE VIEW \`councelling_doctors\` AS SELECT * FROM \`family_councelling_doctors\``);
  await conn.query(`CREATE OR REPLACE VIEW \`marriage_councelling_appointments\` AS SELECT * FROM \`family_councelling_appointments\``);
  await conn.query(`CREATE OR REPLACE VIEW \`marriage_councelling\` AS SELECT * FROM \`family_councelling_appointments\``);
  await conn.query(`CREATE OR REPLACE VIEW \`councelling_appointments\` AS SELECT * FROM \`family_councelling_appointments\``);
  console.log('Created views for aliases.');

  // Seed default doctors if empty
  const [existing] = await conn.query('SELECT COUNT(*) as cnt FROM `family_councelling_doctors` WHERE `d_in` = 0');
  if (existing[0].cnt === 0) {
    const docs = [
      ['Dr. Sarah John, M.D.', 'Family Counsellor & Clinical Psychologist', 'MBBS, MD (Psychiatry)', '12 Years', '9848012345', 'dr.sarah@jbac.org', 'password123', 'APMC-45892', 8, 'Free / Volunteer Service', 'Monday to Saturday', '10:00 AM', '01:00 PM', 'Vijayawada', 'Eluru Road, Governorpet, Vijayawada', 'Dedicated Christian family and marriage counsellor serving church families for over 12 years.'],
      ['Dr. P. David Paul, Ph.D.', 'Marriage & Relationship Counsellor', 'M.A., Ph.D. (Psychology)', '15 Years', '9848023456', 'dr.david@jbac.org', 'password123', 'RCI-88231', 8, 'Free / Volunteer Service', 'Monday to Friday', '02:00 PM', '06:00 PM', 'Guntur', 'Arundelpet, Main Road, Guntur', 'Specialist in pre-marital and post-marital reconciliation, Christian family values and youth counselling.'],
      ['Dr. Grace Varghese, M.Phil', 'Youth & Child Psychological Counsellor', 'M.Sc., M.Phil (Counselling)', '9 Years', '9848034567', 'dr.grace@jbac.org', 'password123', 'APMC-99412', 8, 'Free / Volunteer Service', 'Tuesday, Thursday, Saturday', '11:00 AM', '04:00 PM', 'Visakhapatnam', 'Dwaraka Nagar, Visakhapatnam', 'Expert guidance for children, adolescents, parental guidance, and harmonious Christian home management.'],
      ['Dr. Mary Grace, M.D.', 'Women & Family Health Specialist', 'MBBS, DGO, Family Medicine', '14 Years', '9281506388', 'doctor@jbac.org', 'password123', 'APMC-77341', 8, 'Free / Volunteer Service', 'Monday to Saturday', '09:00 AM', '01:00 PM', 'Hyderabad & Online', 'Secunderabad & Online Video Consultation', 'Compassionate family physician and marriage counsellor dedicated to strengthening families and Christian couples.']
    ];

    for (const d of docs) {
      await conn.query(`
        INSERT INTO \`family_councelling_doctors\` 
        (\`doctor_name\`, \`specialization\`, \`qualification\`, \`experience_years\`, \`phone_number\`, \`email\`, \`password\`, \`license_number\`, \`category_id\`, \`consultation_fee\`, \`available_days\`, \`available_time_start\`, \`available_time_end\`, \`location\`, \`address\`, \`bio\`, \`is_active\`, \`created_by\`, \`d_in\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'admin', 0)
      `, d);
    }
    console.log('Seeded ' + docs.length + ' default doctors.');
  }

  const [verifyDocs] = await conn.query('SELECT id, doctor_name, phone_number, specialization FROM `family_councelling_doctors`');
  console.log('Doctors in DB:', verifyDocs);

  await conn.end();
  console.log('All Done!');
}

createTables().catch(console.error);
