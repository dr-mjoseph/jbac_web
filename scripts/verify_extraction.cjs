const fs = require('fs');
const path = require('path');

const dump = fs.readFileSync(path.resolve(__dirname, '../database/jbac_structure.sql'), 'utf8');

const targetTables = [
  'jobs',
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

console.log('Extracting INSERT statements for target tables...');

targetTables.forEach(t => {
  const prefix = `INSERT INTO \`${t}\``;
  const idx = dump.indexOf(prefix);
  if (idx === -1) {
    console.log(`[MISSING] ${t}`);
  } else {
    let endIdx = dump.indexOf(';\n', idx);
    if (endIdx === -1) endIdx = dump.indexOf(';\r\n', idx);
    if (endIdx === -1) endIdx = dump.indexOf(';', idx);
    const sql = dump.substring(idx, endIdx + 1);
    const hasTelugu = /[\u0C00-\u0C7F]/.test(sql);
    console.log(`[FOUND] ${t}: ${sql.length} bytes, has Telugu: ${hasTelugu}`);
  }
});
