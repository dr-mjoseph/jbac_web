const fs = require('fs');
const path = require('path');
const mysql = require(path.resolve(__dirname, '../backend/node_modules/mysql2/promise'));

async function main() {
  const host = process.env.DB_HOST || 'jbac-mysql-db-v2.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com';
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

  const targetTables = [
    'adds_data',
    'banner_dlt_t',
    'church_reg',
    'docment_tbl',
    'events',
    'helps',
    'independentorganisation_reg',
    'institutes',
    'ministry_signup',
    'mndls_lst_t',
    'pastor_reg',
    'pastors_associations',
    'post_news',
    'reg_form',
    'signup_form',
    'student_reg',
    'wish_form',
    'Sheet1',
    'education',
    'churchdenomation',
    'services',
    'leaderlevel',
    'dstrct',
    'const_dtl_t',
    'pnchyt_lst_t',
    'wingleaderstype',
    'about_tbl',
    'Indian-states',
    'gallery_category',
    'sub_modules',
    'main_modules'
  ];

  console.log('Comparing RDS counts...');
  for (const t of targetTables) {
    try {
      const [rows] = await connection.query(`SELECT COUNT(*) as cnt, MAX(id) as max_id FROM \`${t}\`;`);
      console.log(`${t}: count=${rows[0].cnt}, max_id=${rows[0].max_id}`);
    } catch (e) {
      console.log(`${t}: error ${e.message}`);
    }
  }

  await connection.end();
}

main().catch(console.error);
