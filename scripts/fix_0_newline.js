const fs = require('fs');

const dirs = [
  'C:/Users/rajes/StudioProjects/jbac_app/www/build/0.js',
  'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/0.js'
];

for (const p of dirs) {
  let content = fs.readFileSync(p, 'utf8');

  // Fix any unescaped newlines in template
  content = content.replace(
    '<option value="6">క్రిస్టియన్ ఆర్గనైజెషన్ / కంపెనీ</option>\n\n          <option value="8">డాక్టర్ / కౌన్సిలర్ (Doctor / Counsellor)</option>',
    '<option value="6">క్రిస్టియన్ ఆర్గనైజెషన్ / కంపెనీ</option>\\n\\n          <option value="8">డాక్టర్ / కౌన్సిలర్ (Doctor / Counsellor)</option>'
  );

  // If not yet added, add it with escaped \\n
  if (!content.includes('value=\\"8\\"') && !content.includes('value="8"')) {
    content = content.replace(
      '<option value="6">క్రిస్టియన్ ఆర్గనైజెషన్ / కంపెనీ</option>',
      '<option value="6">క్రిస్టియన్ ఆర్గనైజెషన్ / కంపెనీ</option>\\n\\n          <option value="8">డాక్టర్ / కౌన్సిలర్ (Doctor / Counsellor)</option>'
    );
  }

  fs.writeFileSync(p, content, 'utf8');
}
