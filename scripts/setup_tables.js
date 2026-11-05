const mysql = require('../backend/node_modules/mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
      user: 'admin',
      password: 'biUt2TrZ9EZAqn6GXhiA',
      database: 'jbac_jbac'
    });

    console.log('Connected to RDS MySQL. Creating tables...');

    // 1. business_types table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS business_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        business_type VARCHAR(255) NOT NULL,
        type_telugu VARCHAR(255) NULL,
        type_english VARCHAR(255) NULL,
        description VARCHAR(500) NULL,
        status INT DEFAULT 1,
        d_in INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('business_types table verified/created.');

    // Populate business_types if empty
    const [existingTypes] = await conn.query('SELECT COUNT(*) as count FROM business_types');
    if (existingTypes[0].count === 0) {
      const types = [
        ['వ్యవసాయం & అనుబంధ రంగాలు - Agriculture & Allied', 'వ్యవసాయం & అనుబంధ రంగాలు', 'Agriculture & Allied'],
        ['తయారీ రంగం - Manufacturing Industries', 'తయారీ రంగం', 'Manufacturing Industries'],
        ['రిటైల్ & హోల్‌సేల్ వ్యాపారం - Retail & Wholesale Trading', 'రిటైల్ & హోల్‌సేల్ వ్యాపారం', 'Retail & Wholesale Trading'],
        ['ఆహార ఉత్పత్తులు & హోటల్స్ - Food Processing & Hospitality / Restaurants', 'ఆహార ఉత్పత్తులు & హోటల్స్', 'Food Processing & Hospitality / Restaurants'],
        ['ఇన్ఫర్మేషన్ టెక్నాలజీ (IT) & సాఫ్ట్‌వేర్ - Information Technology (IT) & Software', 'ఇన్ఫర్మేషన్ టెక్నాలజీ (IT) & సాఫ్ట్‌వేర్', 'Information Technology (IT) & Software'],
        ['విద్య & నైపుణ్య శిక్షణ - Education & Skill Training', 'విద్య & నైపుణ్య శిక్షణ', 'Education & Skill Training'],
        ['వైద్యం & ఆరోగ్య సేవలు - Healthcare & Medical Services', 'వైద్యం & ఆరోగ్య సేవలు', 'Healthcare & Medical Services'],
        ['రవాణా & లాజిస్టిక్స్ - Transport & Logistics', 'రవాణా & లాజిస్టిక్స్', 'Transport & Logistics'],
        ['భవన నిర్మాణం & రియల్ ఎస్టేట్ - Construction & Real Estate', 'భవన నిర్మాణం & రియల్ ఎస్టేట్', 'Construction & Real Estate'],
        ['వస్త్ర & దుస్తుల పరిశ్రమ - Textiles & Garments', 'వస్త్ర & దుస్తుల పరిశ్రమ', 'Textiles & Garments'],
        ['సర్వీస్ & రిపేర్ రంగాలు - Services, Electrical & Maintenance', 'సర్వీస్ & రిపేర్ రంగాలు', 'Services, Electrical & Maintenance'],
        ['పునరుత్పాదక ఇంధనం & సోలార్ - Renewable Energy & Solar', 'పునరుత్పాదక ఇంధనం & సోలార్', 'Renewable Energy & Solar'],
        ['పౌల్ట్రీ & డైరీ ఫామింగ్ - Poultry & Dairy Farming', 'పౌల్ట్రీ & డైరీ ఫామింగ్', 'Poultry & Dairy Farming'],
        ['ఈ-కామర్స్ & డిజిటల్ మార్కెటింగ్ - E-Commerce & Digital Marketing', 'ఈ-కామర్స్ & డిజిటల్ మార్కెటింగ్', 'E-Commerce & Digital Marketing'],
        ['ముద్రణ & ప్యాకేజింగ్ - Printing & Packaging', 'ముద్రణ & ప్యాకేజింగ్', 'Printing & Packaging'],
        ['ఇతర నూతన వ్యాపారాలు - Other Innovative Startups & Businesses', 'ఇతర నూతన వ్యాపారాలు', 'Other Innovative Startups & Businesses']
      ];
      for (const [full, te, en] of types) {
        await conn.query('INSERT INTO business_types (business_type, type_telugu, type_english) VALUES (?, ?, ?)', [full, te, en]);
      }
      console.log('Inserted ' + types.length + ' default business types.');
    } else {
      console.log('business_types already has ' + existingTypes[0].count + ' rows.');
    }

    // 2. entrepreneur_reg table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS entrepreneur_reg (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(25) NOT NULL,
        email VARCHAR(255) NULL,
        state_id INT NULL,
        district_id INT NULL,
        constituency_id INT NULL,
        mandal_id INT NULL,
        panchayat_id INT NULL,
        state_name VARCHAR(100) NULL,
        district_name VARCHAR(150) NULL,
        constituency_name VARCHAR(150) NULL,
        mandal_name VARCHAR(150) NULL,
        panchayat_name VARCHAR(150) NULL,
        business_state_id INT NULL,
        business_district_id INT NULL,
        business_constituency_id INT NULL,
        business_mandal_id INT NULL,
        business_panchayat_id INT NULL,
        business_state_name VARCHAR(100) NULL,
        business_district_name VARCHAR(150) NULL,
        business_constituency_name VARCHAR(150) NULL,
        business_mandal_name VARCHAR(150) NULL,
        business_panchayat_name VARCHAR(150) NULL,
        business_type_id INT NULL,
        business_type VARCHAR(255) NULL,
        denomination_id INT NULL,
        denomination VARCHAR(255) NULL,
        self_fund VARCHAR(100) NULL,
        capital_need VARCHAR(100) NULL,
        description TEXT NULL,
        approval_ind INT DEFAULT 0,
        d_in INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('entrepreneur_reg table verified/created.');

    // 3. investor_reg table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS investor_reg (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(25) NOT NULL,
        email VARCHAR(255) NULL,
        state_id INT NULL,
        district_id INT NULL,
        constituency_id INT NULL,
        mandal_id INT NULL,
        panchayat_id INT NULL,
        state_name VARCHAR(100) NULL,
        district_name VARCHAR(150) NULL,
        constituency_name VARCHAR(150) NULL,
        mandal_name VARCHAR(150) NULL,
        panchayat_name VARCHAR(150) NULL,
        business_type_id INT NULL,
        business_type VARCHAR(255) NULL,
        denomination_id INT NULL,
        denomination VARCHAR(255) NULL,
        capital_to_invest VARCHAR(100) NULL,
        description TEXT NULL,
        approval_ind INT DEFAULT 0,
        d_in INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('investor_reg table verified/created.');

    await conn.end();
    console.log('Database schema creation completed successfully.');
  } catch (err) {
    console.error('Error during setup:', err);
    process.exit(1);
  }
})();
