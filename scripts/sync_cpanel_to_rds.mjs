import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const CPANEL_HOST = process.env.CPANEL_HOST || '68.178.175.219';
const CPANEL_PORT = process.env.CPANEL_PORT || '2083';
const CPANEL_USER = process.env.CPANEL_USER || 'jbac';
const CPANEL_PASS = process.env.CPANEL_PASS || 'Hundredfoldreturn7&';
const DB_NAME = process.env.DB_NAME || 'jbac_jbac';

const RDS_HOST = process.env.DB_HOST || 'jbac-mysql-db.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com';
const RDS_USER = process.env.DB_USER || 'admin';
const RDS_PASS = process.env.DB_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA';
const RDS_PORT = Number(process.env.DB_PORT) || 3306;

async function loadMysqlDriver() {
  const candidatePaths = [
    'mysql2/promise',
    path.resolve(__dirname, '../backend/node_modules/mysql2/promise.js'),
    path.resolve(__dirname, '../node_modules/mysql2/promise.js')
  ];
  for (const p of candidatePaths) {
    try {
      const mod = await import(p.startsWith('path') || p.includes('/') || p.includes('\\') ? `file:///${p.replace(/\\/g, '/')}` : p);
      return mod.default || mod;
    } catch (_) {}
  }
  return null;
}

async function sync() {
  console.log('====================================================');
  console.log('JBAC: cPanel to AWS RDS Database Auto-Sync Pipeline');
  console.log('====================================================');
  console.log(`[1/4] Connecting to cPanel (${CPANEL_HOST}:${CPANEL_PORT}) as '${CPANEL_USER}'...`);

  // Step 1: Login to cPanel
  const params = new URLSearchParams();
  params.append('user', CPANEL_USER);
  params.append('pass', CPANEL_PASS);

  const loginRes = await fetch(`https://${CPANEL_HOST}:${CPANEL_PORT}/login/?login_only=1`, {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const cookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [loginRes.headers.get('set-cookie')];
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
  const loginData = await loginRes.json();

  if (loginData.status !== 1) {
    throw new Error(`cPanel login failed: ${loginData.message || 'Invalid credentials'}`);
  }

  const token = loginData.security_token;
  console.log(`[SUCCESS] cPanel authenticated. Session Token: ${token}`);

  // Step 2: Download raw database dump
  console.log(`[2/4] Downloading live database dump for '${DB_NAME}' from cPanel...`);
  const backupUrl = `https://${CPANEL_HOST}:${CPANEL_PORT}${token}/getsqlbackup/${DB_NAME}.sql.gz`;
  const dumpRes = await fetch(backupUrl, {
    headers: { 'Cookie': cookieHeader }
  });

  if (dumpRes.status !== 200) {
    throw new Error(`Failed to download database dump: HTTP ${dumpRes.status} ${dumpRes.statusText}`);
  }

  const compressedBuffer = Buffer.from(await dumpRes.arrayBuffer());
  console.log(`[SUCCESS] Downloaded compressed dump (${(compressedBuffer.length / 1024).toFixed(1)} KB)`);

  const decompressed = zlib.gunzipSync(compressedBuffer).toString('utf8');
  console.log(`[SUCCESS] Decompressed SQL dump (${(decompressed.length / 1024 / 1024).toFixed(2)} MB)`);

  // Step 3: Format & standardize for AWS RDS
  console.log('[3/4] Standardizing schema, fixing relations, and applying compatibility views...');
  let cleanSql = decompressed.replace(/REFERENCES `?dstrct1`?/g, 'REFERENCES `dstrct`');

  const header = `-- JBAC Synchronized Database Dump from cPanel (${CPANEL_HOST})
-- Generation Time: ${new Date().toISOString()}
-- Target: AWS RDS MySQL 8.0 (${RDS_HOST})

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

DROP DATABASE IF EXISTS \`${DB_NAME}\`;
CREATE DATABASE \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE \`${DB_NAME}\`;
SET FOREIGN_KEY_CHECKS = 0;

`;

  const footer = `

-- --------------------------------------------------------
-- Compatibility Views for Universal Query Resolution
-- --------------------------------------------------------
CREATE OR REPLACE VIEW \`denominations\` AS SELECT id, denomation_name, denomation_name as denomination_name, d_in FROM \`churchdenomation\`;
CREATE OR REPLACE VIEW \`leader_levels\` AS SELECT id, level as level_name, level, d_in FROM \`leaderlevel\`;
CREATE OR REPLACE VIEW \`educational_qualifications\` AS SELECT id, name as qualification_name, name as qualification, name, d_in FROM \`education\`;
CREATE OR REPLACE VIEW \`districts\` AS SELECT id, distrct_nm as name, distrct_nm, d_in FROM \`dstrct\`;
CREATE OR REPLACE VIEW \`constituencies\` AS SELECT id, const_nm as name, const_nm, dstrct_id, d_in FROM \`const_dtl_t\`;
CREATE OR REPLACE VIEW \`mandals\` AS SELECT id, mndl_nm as name, mndl_nm, const_id, dstrct_id, d_in FROM \`mndls_lst_t\`;
CREATE OR REPLACE VIEW \`panchayats\` AS SELECT id, pnchyt_nm as name, pnchyt_nm, mndl_id, d_in FROM \`pnchyt_lst_t\`;
CREATE OR REPLACE VIEW \`services_list\` AS SELECT id, servicename as name, servicename as service_name, servicename, d_in FROM \`services\`;
CREATE OR REPLACE VIEW \`wings\` AS SELECT id, position as wing_name, position as name, position, d_in FROM \`wingleaderstype\`;
CREATE OR REPLACE VIEW \`ads\` AS SELECT * FROM \`adds_data\`;
CREATE OR REPLACE VIEW \`news\` AS SELECT * FROM \`post_news\`;
CREATE OR REPLACE VIEW \`help_requests\` AS SELECT * FROM \`helps\`;
CREATE OR REPLACE VIEW \`business\` AS SELECT * FROM \`business_table\`;
CREATE OR REPLACE VIEW \`believers\` AS SELECT * FROM \`signup_form\`;
CREATE OR REPLACE VIEW \`pastors\` AS SELECT id, pastorname, pastorname as name, phonenumber, phonenumber as mobile_number, description, district_id, constituency_id, mandal_id, village_id, address, d_in FROM \`pastor_reg\`;
CREATE OR REPLACE VIEW \`churches\` AS SELECT id, church_name, church_name as churchname, church_name as name, pastor_id, pastor_id as pastorname, pastor_id as pastor_name, contactnumber as phonenumber, contactnumber as mobile_number, district_id, constituency_id, mandal_id, village_id, address, d_in FROM \`church_reg\`;
CREATE OR REPLACE VIEW \`meetings\` AS SELECT id, eventname as title, eventname, eventname as event_name, speaker1, speaker2, speaker3, speaker4, startdate, enddate, starttime, endtime, location, address, facebook, youtube, phone, image, meetsize, orgname, description, district_id, constituency_id, mandal_id, panchayat_id, denomation_id, user_id, d_in FROM \`events\`;
CREATE OR REPLACE VIEW \`students\` AS SELECT * FROM \`student_reg\`;
CREATE OR REPLACE VIEW \`organisations\` AS SELECT * FROM \`independentorganisation_reg\`;
CREATE OR REPLACE VIEW \`pastor_associations\` AS SELECT * FROM \`pastors_associations\`;
CREATE OR REPLACE VIEW \`ministries\` AS SELECT * FROM \`ministry_signup\`;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
`;

  const finalSql = header + cleanSql + footer;
  const targetSqlPath = path.resolve(__dirname, '..', 'database', 'jbac_structure.sql');
  fs.writeFileSync(targetSqlPath, finalSql, 'utf8');
  console.log(`[SUCCESS] Updated ${targetSqlPath} with latest cPanel live data!`);

  // Step 4: Import into AWS RDS if accessible
  console.log(`[4/4] Testing connection to AWS RDS (${RDS_HOST}:${RDS_PORT})...`);
  const mysql = await loadMysqlDriver();

  if (mysql) {
    try {
      const conn = await mysql.createConnection({
        host: RDS_HOST,
        port: RDS_PORT,
        user: RDS_USER,
        password: RDS_PASS,
        multipleStatements: true,
        connectTimeout: 5000
      });

      console.log('[SUCCESS] Connected to AWS RDS MySQL instance!');
      console.log(`Importing database into AWS RDS (${(finalSql.length / 1024 / 1024).toFixed(2)} MB)...`);
      await conn.query(finalSql);
      console.log('[SUCCESS] Database successfully synchronized to AWS RDS MySQL!');
      await conn.end();
      return;
    } catch (err) {
      console.warn('\n[STATUS] AWS RDS is currently not reachable directly from this network:');
      console.warn(`Reason: ${err.message}`);
    }
  }

  console.log('\n=============================================================');
  console.log('NOTICE: Database was successfully fetched & formatted locally!');
  console.log('Location: database/jbac_structure.sql');
  console.log('-------------------------------------------------------------');
  console.log('Why could AWS RDS not be reached directly?');
  console.log('  1. The RDS instance "jbac-mysql-db" is currently STOPPED');
  console.log('     (by the cost-saver scheduler or in the AWS Console).');
  console.log('  2. Or your current IP address is not whitelisted in the');
  console.log('     AWS RDS VPC Security Group on port 3306.');
  console.log('');
  console.log('To complete synchronization into AWS RDS:');
  console.log('  Step 1: Start your RDS database:');
  console.log('          - Go to https://github.com/dr-mjoseph/jbac_web/actions');
  console.log('          - Click "AWS Resource Cost Scheduler"');
  console.log('          - Click "Run workflow" -> choose Action: "start", Target: "rds".');
  console.log('          (Or start it directly in the AWS RDS Sydney console).');
  console.log('  Step 2: Once running, execute:');
  console.log('          npm run import:db');
  console.log('=============================================================');
}

sync().catch(err => {
  console.error('\n[FATAL ERROR]', err.message);
  process.exit(1);
});
