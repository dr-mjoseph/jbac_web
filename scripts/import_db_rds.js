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

    // 4. Create compatibility views so both legacy and modern table names resolve seamlessly
    console.log('[RDS INIT] Creating compatibility views for tables...');
    const views = [
      'CREATE OR REPLACE VIEW `denominations` AS SELECT id, denomation_name, denomation_name as denomination_name, d_in FROM `churchdenomation`',
      'CREATE OR REPLACE VIEW `leader_levels` AS SELECT id, level as level_name, level, d_in FROM `leaderlevel`',
      'CREATE OR REPLACE VIEW `educational_qualifications` AS SELECT id, name as qualification_name, name as qualification, name, d_in FROM `education`',
      'CREATE OR REPLACE VIEW `districts` AS SELECT id, distrct_nm as name, distrct_nm, d_in FROM `dstrct`',
      'CREATE OR REPLACE VIEW `constituencies` AS SELECT id, const_nm as name, const_nm, dstrct_id, d_in FROM `const_dtl_t`',
      'CREATE OR REPLACE VIEW `mandals` AS SELECT id, mndl_nm as name, mndl_nm, const_id, dstrct_id, d_in FROM `mndls_lst_t`',
      'CREATE OR REPLACE VIEW `panchayats` AS SELECT id, pnchyt_nm as name, pnchyt_nm, mndl_id, d_in FROM `pnchyt_lst_t`',
      'CREATE OR REPLACE VIEW `services_list` AS SELECT id, servicename as name, servicename as service_name, servicename, d_in FROM `services`',
      'CREATE OR REPLACE VIEW `wings` AS SELECT id, position as wing_name, position as name, position, d_in FROM `wingleaderstype`',
      'CREATE OR REPLACE VIEW `ads` AS SELECT * FROM `adds_data`',
      'CREATE OR REPLACE VIEW `news` AS SELECT * FROM `post_news`',
      'CREATE OR REPLACE VIEW `help_requests` AS SELECT * FROM `helps`',
      'CREATE OR REPLACE VIEW `business` AS SELECT * FROM `business_table`',
      'CREATE OR REPLACE VIEW `believers` AS SELECT * FROM `signup_form`',
      'CREATE OR REPLACE VIEW `pastors` AS SELECT id, pastorname, pastorname as name, phonenumber, phonenumber as mobile_number, description, district_id, constituency_id, mandal_id, village_id, address, d_in FROM `pastor_reg`',
      'CREATE OR REPLACE VIEW `churches` AS SELECT id, church_name, church_name as churchname, church_name as name, pastor_id, pastor_id as pastorname, pastor_id as pastor_name, contactnumber as phonenumber, contactnumber as mobile_number, district_id, constituency_id, mandal_id, village_id, address, d_in FROM `church_reg`',
      'CREATE OR REPLACE VIEW `meetings` AS SELECT id, eventname as title, eventname, eventname as event_name, speaker1, speaker2, speaker3, speaker4, startdate, enddate, starttime, endtime, location, address, facebook, youtube, phone, image, meetsize, orgname, description, district_id, constituency_id, mandal_id, panchayat_id, denomation_id, user_id, d_in FROM `events`',
      'CREATE OR REPLACE VIEW `students` AS SELECT * FROM `student_reg`',
      'CREATE OR REPLACE VIEW `organisations` AS SELECT * FROM `independentorganisation_reg`',
      'CREATE OR REPLACE VIEW `pastor_associations` AS SELECT * FROM `pastors_associations`',
      'CREATE OR REPLACE VIEW `ministries` AS SELECT * FROM `ministry_signup`'
    ];
    for (const v of views) {
      await connection.query(v).catch(e => console.warn('[RDS VIEW WARN]', e.message));
    }
    console.log('[RDS INIT] Compatibility views successfully established.');

    // 5. Verify tables
    const [verifiedTables] = await connection.query(`SHOW TABLES FROM \`${dbName}\`;`);
    console.log(`[RDS INIT SUCCESS] ${dbName} has ${verifiedTables.length} active tables & views.`);

    // 6. Test a quick query from about_tbl or users
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
