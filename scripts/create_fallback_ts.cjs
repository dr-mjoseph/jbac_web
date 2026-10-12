const fs = require('fs');
const json = fs.readFileSync('src/app/jesus/dropdown_fallback_data.json', 'utf8');
const data = JSON.parse(json);

const tsContent = `// Auto-generated offline & fallback dataset for JBAC registration dropdowns
export const FALLBACK_DROPDOWN_DATA = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync('src/app/jesus/dropdown_fallback_data.ts', tsContent, 'utf8');
console.log('Successfully created src/app/jesus/dropdown_fallback_data.ts');
