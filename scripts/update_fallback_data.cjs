const fs = require('fs');

const currentFallback = fs.readFileSync('src/app/jesus/dropdown_fallback_data.ts', 'utf8');
const geoData = JSON.parse(fs.readFileSync('scripts/geo_data.json', 'utf8'));

// Extract existing keys from currentFallback
// We can parse the current object by evaluating or extracting JSON
const existingData = eval(`(${currentFallback.replace('export const FALLBACK_DROPDOWN_DATA = ', '').replace(/;?\s*$/, '')})`);

console.log('Existing keys:', Object.keys(existingData));

existingData.consistencies = geoData.consistencies;
existingData.mandals = geoData.mandals;

// Add default services
existingData.services = [
  { id: 1, servicename: 'Bible College', service_name: 'Bible College', name: 'Bible College' },
  { id: 2, servicename: 'Sunday School', service_name: 'Sunday School', name: 'Sunday School' },
  { id: 3, servicename: 'Youth Ministry', service_name: 'Youth Ministry', name: 'Youth Ministry' },
  { id: 4, servicename: 'Women Fellowship', service_name: 'Women Fellowship', name: 'Women Fellowship' },
  { id: 5, servicename: 'Men Fellowship', service_name: 'Men Fellowship', name: 'Men Fellowship' },
  { id: 6, servicename: 'Hospital Ministry', service_name: 'Hospital Ministry', name: 'Hospital Ministry' },
  { id: 7, servicename: 'Prison Ministry', service_name: 'Prison Ministry', name: 'Prison Ministry' },
  { id: 8, servicename: 'Village Evangelism', service_name: 'Village Evangelism', name: 'Village Evangelism' },
  { id: 9, servicename: 'Music & Worship', service_name: 'Music & Worship', name: 'Music & Worship' },
  { id: 10, servicename: 'Charity & Relief', service_name: 'Charity & Relief', name: 'Charity & Relief' }
];

// Add default representative panchayats so village dropdown never breaks
existingData.panchayatis = [
  { id: 1, pnchyt_nm: 'గ్రామ పంచాయతీ / మెయిన్ టౌన్ (Gram Panchayat/Main Town)', panchayatname: 'Gram Panchayat/Main Town', name: 'Gram Panchayat/Main Town' },
  { id: 2, pnchyt_nm: 'వార్డ్ నం. 1 (Ward No. 1)', panchayatname: 'Ward No. 1', name: 'Ward No. 1' },
  { id: 3, pnchyt_nm: 'వార్డ్ నం. 2 (Ward No. 2)', panchayatname: 'Ward No. 2', name: 'Ward No. 2' },
  { id: 4, pnchyt_nm: 'గ్రామ పరిధి 1 (Village Area 1)', panchayatname: 'Village Area 1', name: 'Village Area 1' },
  { id: 5, pnchyt_nm: 'గ్రామ పరిధి 2 (Village Area 2)', panchayatname: 'Village Area 2', name: 'Village Area 2' }
];

const newContent = '// Auto-generated offline & fallback dataset for JBAC registration dropdowns\nexport const FALLBACK_DROPDOWN_DATA = ' + JSON.stringify(existingData, null, 2) + ';\n';

fs.writeFileSync('src/app/jesus/dropdown_fallback_data.ts', newContent, 'utf8');
console.log('Successfully updated src/app/jesus/dropdown_fallback_data.ts! Total length:', newContent.length);
