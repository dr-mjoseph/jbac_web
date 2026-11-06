const fs = require('fs');

['public.html', 'backend/public.html', 'backend/admin_db.html'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let c = fs.readFileSync(filePath, 'utf8');
  c = c.replace(
    'fetchDistrictLeadersData();\n      fetchBusinessMatchData(true);\n      loadTables();',
    'fetchDistrictLeadersData();\n      fetchBusinessMatchData(true);\n      fetchTeacherData(true);\n      loadTables();'
  );
  c = c.replace(
    'fetchDistrictLeadersData(true);\n      fetchBusinessMatchData(true);\n    }',
    'fetchDistrictLeadersData(true);\n      fetchBusinessMatchData(true);\n      fetchTeacherData(true);\n    }'
  );
  fs.writeFileSync(filePath, c, 'utf8');
  console.log(`Updated hooks in ${filePath}`);
});

