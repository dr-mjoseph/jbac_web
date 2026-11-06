const https = require('https');

function runSql(query) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      adminUsername: 'admin',
      adminPassword: 'JbacAdmin@2026',
      query: query
    });

    const req = https.request('https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  console.log('=== CREATING TEACHING FIELD TABLES IN AWS RDS MYSQL ===\n');

  // 1. Role Category Table
  console.log('1. Creating teaching_role_categories table...');
  await runSql(`CREATE TABLE IF NOT EXISTS \`teaching_role_categories\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`name_en\` VARCHAR(100) NOT NULL,
    \`name_te\` VARCHAR(150) NOT NULL,
    \`status\` VARCHAR(20) DEFAULT 'active',
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);

  console.log('Seeding teaching_role_categories...');
  await runSql(`INSERT IGNORE INTO \`teaching_role_categories\` (\`id\`, \`name_en\`, \`name_te\`) VALUES
    (1, 'Administration', 'పరిపాలన (Administration)'),
    (2, 'Teaching', 'బోధన (Teaching)'),
    (3, 'Administration and Teaching', 'పరిపాలన మరియు బోధన (Administration & Teaching)');`);

  // 2. Family Background Table
  console.log('2. Creating teaching_family_backgrounds table...');
  await runSql(`CREATE TABLE IF NOT EXISTS \`teaching_family_backgrounds\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`name_en\` VARCHAR(100) NOT NULL,
    \`name_te\` VARCHAR(150) NOT NULL,
    \`status\` VARCHAR(20) DEFAULT 'active',
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);

  console.log('Seeding teaching_family_backgrounds...');
  await runSql(`INSERT IGNORE INTO \`teaching_family_backgrounds\` (\`id\`, \`name_en\`, \`name_te\`) VALUES
    (1, 'First Generation Employee', 'మొదటి తరం ఉద్యోగి (First Generation)'),
    (2, 'Second Generation', 'రెండవ తరం ఉద్యోగి (Second Generation)'),
    (3, 'Third Generation', 'మూడవ తరం ఉద్యోగి (Third Generation)'),
    (4, 'Fourth Generation', 'నాల్గవ తరం ఉద్యోగి (Fourth Generation)'),
    (5, 'Sixth Generation Employee', 'ఆరవ తరం ఉద్యోగి (Sixth Generation)');`);

  // 3. Institution Types Table
  console.log('3. Creating teaching_institution_types table...');
  await runSql(`CREATE TABLE IF NOT EXISTS \`teaching_institution_types\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`name_en\` VARCHAR(100) NOT NULL,
    \`name_te\` VARCHAR(150) NOT NULL,
    \`status\` VARCHAR(20) DEFAULT 'active',
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);

  console.log('Seeding teaching_institution_types...');
  await runSql(`INSERT IGNORE INTO \`teaching_institution_types\` (\`id\`, \`name_en\`, \`name_te\`) VALUES
    (1, 'Anganwady', 'అంగన్‌వాడీ (Anganwady)'),
    (2, 'Play School', 'ప్లే స్కూల్ (Play School)'),
    (3, 'Primary School', 'ప్రాథమిక పాఠశాల (Primary School)'),
    (4, 'High School', 'ఉన్నత పాఠశాల / హైస్కూల్ (High School)'),
    (5, 'Junior College', 'జూనియర్ కళాశాల (Junior College)'),
    (6, 'Vocational College', 'వొకేషనల్ కళాశాల (Vocational College)'),
    (7, 'Diploma College', 'పాలిటెక్నిక్ / డిప్లొమా కళాశాల (Diploma College)'),
    (8, 'Degree College', 'డిగ్రీ కళాశాల (Degree College)'),
    (9, 'Technical College', 'ఇంజనీరింగ్ / టెక్నికల్ కళాశాల (Technical College)'),
    (10, 'Medical College', 'మెడికల్ కళాశాల (Medical College)');`);

  // 4. Experience Levels Table
  console.log('4. Creating teaching_experience_levels table...');
  await runSql(`CREATE TABLE IF NOT EXISTS \`teaching_experience_levels\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`years_range\` VARCHAR(100) NOT NULL,
    \`label_te\` VARCHAR(150) NOT NULL,
    \`status\` VARCHAR(20) DEFAULT 'active',
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);

  console.log('Seeding teaching_experience_levels...');
  await runSql(`INSERT IGNORE INTO \`teaching_experience_levels\` (\`id\`, \`years_range\`, \`label_te\`) VALUES
    (1, '0-1 Years', '0-1 సంవత్సరాలు (0-1 Years)'),
    (2, '1-3 Years', '1-3 సంవత్సరాలు (1-3 Years)'),
    (3, '3-5 Years', '3-5 సంవత్సరాలు (3-5 Years)'),
    (4, '5-10 Years', '5-10 సంవత్సరాలు (5-10 Years)'),
    (5, '10-15 Years', '10-15 సంవత్సరాలు (10-15 Years)'),
    (6, '15-20 Years', '15-20 సంవత్సరాలు (15-20 Years)'),
    (7, '20+ Years', '20+ సంవత్సరాలు (20+ Years)');`);

  // 5. Main Teacher Registration Table
  console.log('5. Creating teacher_reg table...');
  const teacherDdl = `CREATE TABLE IF NOT EXISTS \`teacher_reg\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(255) NOT NULL,
    \`mobile\` VARCHAR(20) NOT NULL,
    \`email\` VARCHAR(150) DEFAULT NULL,
    \`gender\` VARCHAR(50) NOT NULL,
    \`designation\` VARCHAR(255) NOT NULL,
    \`role_category\` VARCHAR(100) NOT NULL,
    \`qualification_category\` VARCHAR(100) NOT NULL,
    \`qualification_id\` INT DEFAULT NULL,
    \`total_experience_years\` VARCHAR(50) DEFAULT '0',
    \`experience_in\` VARCHAR(255) DEFAULT NULL,
    \`caste\` VARCHAR(100) NOT NULL,
    \`subcaste\` VARCHAR(100) DEFAULT NULL,
    \`denomination_id\` INT DEFAULT NULL,
    \`faith_category\` VARCHAR(150) DEFAULT NULL,
    \`family_background\` VARCHAR(100) NOT NULL,
    \`pastor_phone\` VARCHAR(50) NOT NULL,
    \`teacher_type\` VARCHAR(50) NOT NULL,
    \`working_in\` VARCHAR(100) NOT NULL,
    \`institute_name\` VARCHAR(255) NOT NULL,
    \`inst_state_id\` INT NOT NULL,
    \`inst_district_id\` INT NOT NULL,
    \`inst_constituency_id\` INT DEFAULT NULL,
    \`inst_mandal_id\` INT DEFAULT NULL,
    \`inst_panchayat_id\` INT DEFAULT NULL,
    \`inst_address\` TEXT DEFAULT NULL,
    \`res_state_id\` INT NOT NULL,
    \`res_district_id\` INT NOT NULL,
    \`res_constituency_id\` INT DEFAULT NULL,
    \`res_mandal_id\` INT DEFAULT NULL,
    \`res_panchayat_id\` INT DEFAULT NULL,
    \`res_address\` TEXT DEFAULT NULL,
    \`description\` TEXT DEFAULT NULL,
    \`approval_ind\` TINYINT DEFAULT 0,
    \`status\` VARCHAR(50) DEFAULT 'pending',
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX \`idx_teacher_mobile\` (\`mobile\`),
    INDEX \`idx_teacher_res_state\` (\`res_state_id\`),
    INDEX \`idx_teacher_res_dist\` (\`res_district_id\`),
    INDEX \`idx_teacher_inst_state\` (\`inst_state_id\`),
    INDEX \`idx_teacher_inst_dist\` (\`inst_district_id\`),
    INDEX \`idx_teacher_role\` (\`role_category\`),
    INDEX \`idx_teacher_working\` (\`working_in\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  const ddlRes = await runSql(teacherDdl);
  console.log('Result teacher_reg:', ddlRes);

  console.log('\nVerifying newly created tables:');
  const verify = await runSql("SHOW TABLES LIKE 'teach%'");
  console.log(verify);
  const verify2 = await runSql("SHOW TABLES LIKE 'teacher_reg'");
  console.log(verify2);

  console.log('\n=== DATABASE SETUP COMPLETED ===');
})();
