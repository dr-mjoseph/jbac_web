const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/database/jbac_structure.sql', 'utf8');

const tables = [
  'student_reg',
  'pastor_reg',
  'church_reg',
  'independentorganisation_reg',
  'pastors_associations',
  'ministry_signup',
  'support-reg',
  'business_table',
  'reg_form'
];

tables.forEach(t => {
  const regex = new RegExp('CREATE TABLE [`"]?' + t + '[`"]?\\s*\\(([\\s\\S]*?)\\)\\s*ENGINE', 'i');
  const m = content.match(regex);
  if (m) {
    console.log(`\n=================== ${t} ===================`);
    const cols = m[1].split('\n').filter(l => l.trim().startsWith('`')).map(l => l.trim().split(' ')[0]);
    console.log(cols.join(', '));
  } else {
    console.log(`Table not found: ${t}`);
  }
});
