const fs = require('fs');
const path = require('path');

const dump = fs.readFileSync(path.resolve(__dirname, '../database/jbac_structure.sql'), 'utf8');

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
  'Sheet1'
];

targetTables.forEach(t => {
  let count = 0;
  const regex = new RegExp(`INSERT INTO \`${t}\``, 'g');
  let match;
  let statements = 0;
  while ((match = regex.exec(dump)) !== null) {
    statements++;
    const start = match.index;
    let end = dump.indexOf(';\n', start);
    if (end === -1) end = dump.indexOf(';\r\n', start);
    if (end === -1) end = dump.indexOf(';', start);
    const stmt = dump.substring(start, end);
    // count tuples (rows) in stmt
    const rows = stmt.split(/\),\s*\(/g);
    count += rows.length;
  }
  console.log(`${t}: ${statements} statements, ~${count} rows`);
});
