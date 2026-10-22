const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/jesus/dropdown_fallback_data.ts');
let content = fs.readFileSync(filePath, 'utf8');

const tgDistricts = [
  { id: 31, distrct_nm: 'ఆదిలాబాద్ జిల్లా-Adilabad', districtname: 'ఆదిలాబాద్ జిల్లా-Adilabad', district_name: 'ఆదిలాబాద్ జిల్లా-Adilabad', state_id: 2, d_in: 0 },
  { id: 32, distrct_nm: 'భద్రాద్రి కొత్తగూడెం జిల్లా-Bhadradri Kothagudem', districtname: 'భద్రాద్రి కొత్తగూడెం జిల్లా-Bhadradri Kothagudem', district_name: 'భద్రాద్రి కొత్తగూడెం జిల్లా-Bhadradri Kothagudem', state_id: 2, d_in: 0 },
  { id: 33, distrct_nm: 'హనుమకొండ జిల్లా-Hanumakonda', districtname: 'హనుమకొండ జిల్లా-Hanumakonda', district_name: 'హనుమకొండ జిల్లా-Hanumakonda', state_id: 2, d_in: 0 },
  { id: 34, distrct_nm: 'హైదరాబాద్ జిల్లా-Hyderabad', districtname: 'హైదరాబాద్ జిల్లా-Hyderabad', district_name: 'హైదరాబాద్ జిల్లా-Hyderabad', state_id: 2, d_in: 0 },
  { id: 35, distrct_nm: 'జగిత్యాల జిల్లా-Jagtial', districtname: 'జగిత్యాల జిల్లా-Jagtial', district_name: 'జగిత్యాల జిల్లా-Jagtial', state_id: 2, d_in: 0 },
  { id: 36, distrct_nm: 'జనగాం జిల్లా-Jangaon', districtname: 'జనగాం జిల్లా-Jangaon', district_name: 'జనగాం జిల్లా-Jangaon', state_id: 2, d_in: 0 },
  { id: 37, distrct_nm: 'జయశంకర్ భూపాలపల్లి జిల్లా-Jayashankar Bhupalpally', districtname: 'జయశంకర్ భూపాలపల్లి జిల్లా-Jayashankar Bhupalpally', district_name: 'జయశంకర్ భూపాలపల్లి జిల్లా-Jayashankar Bhupalpally', state_id: 2, d_in: 0 },
  { id: 38, distrct_nm: 'జోగులాంబ గద్వాల జిల్లా-Jogulamba Gadwal', districtname: 'జోగులాంబ గద్వాల జిల్లా-Jogulamba Gadwal', district_name: 'జోగులాంబ గద్వాల జిల్లా-Jogulamba Gadwal', state_id: 2, d_in: 0 },
  { id: 39, distrct_nm: 'కామారెడ్డి జిల్లా-Kamareddy', districtname: 'కామారెడ్డి జిల్లా-Kamareddy', district_name: 'కామారెడ్డి జిల్లా-Kamareddy', state_id: 2, d_in: 0 },
  { id: 40, distrct_nm: 'కరీంనగర్ జిల్లా-Karimnagar', districtname: 'కరీంనగర్ జిల్లా-Karimnagar', district_name: 'కరీంనగర్ జిల్లా-Karimnagar', state_id: 2, d_in: 0 },
  { id: 41, distrct_nm: 'ఖమ్మం జిల్లా-Khammam', districtname: 'ఖమ్మం జిల్లా-Khammam', district_name: 'ఖమ్మం జిల్లా-Khammam', state_id: 2, d_in: 0 },
  { id: 42, distrct_nm: 'కొమరం భీమ్ ఆసిఫాబాద్ జిల్లా-Kumuram Bheem Asifabad', districtname: 'కొమరం భీమ్ ఆసిఫాబాద్ జిల్లా-Kumuram Bheem Asifabad', district_name: 'కొమరం భీమ్ ఆసిఫాబాద్ జిల్లా-Kumuram Bheem Asifabad', state_id: 2, d_in: 0 },
  { id: 43, distrct_nm: 'మహబూబాబాద్ జిల్లా-Mahabubabad', districtname: 'మహబూబాబాద్ జిల్లా-Mahabubabad', district_name: 'మహబూబాబాద్ జిల్లా-Mahabubabad', state_id: 2, d_in: 0 },
  { id: 44, distrct_nm: 'మహబూబ్ నగర్ జిల్లా-Mahabubnagar', districtname: 'మహబూబ్ నగర్ జిల్లా-Mahabubnagar', district_name: 'మహబూబ్ నగర్ జిల్లా-Mahabubnagar', state_id: 2, d_in: 0 },
  { id: 45, distrct_nm: 'మంచిర్యాల జిల్లా-Mancherial', districtname: 'మంచిర్యాల జిల్లా-Mancherial', district_name: 'మంచిర్యాల జిల్లా-Mancherial', state_id: 2, d_in: 0 },
  { id: 46, distrct_nm: 'మెదక్ జిల్లా-Medak', districtname: 'మెదక్ జిల్లా-Medak', district_name: 'మెదక్ జిల్లా-Medak', state_id: 2, d_in: 0 },
  { id: 47, distrct_nm: 'మేడ్చల్-మల్కాజ్ గిరి జిల్లా-Medchal Malkajgiri', districtname: 'మేడ్చల్-మల్కాజ్ గిరి జిల్లా-Medchal Malkajgiri', district_name: 'మేడ్చల్-మల్కాజ్ గిరి జిల్లా-Medchal Malkajgiri', state_id: 2, d_in: 0 },
  { id: 48, distrct_nm: 'ములుగు జిల్లా-Mulugu', districtname: 'ములుగు జిల్లా-Mulugu', district_name: 'ములుగు జిల్లా-Mulugu', state_id: 2, d_in: 0 },
  { id: 49, distrct_nm: 'నాగర్ కర్నూల్ జిల్లా-Nagarkurnool', districtname: 'నాగర్ కర్నూల్ జిల్లా-Nagarkurnool', district_name: 'నాగర్ కర్నూల్ జిల్లా-Nagarkurnool', state_id: 2, d_in: 0 },
  { id: 50, distrct_nm: 'నల్గొండ జిల్లా-Nalgonda', districtname: 'నల్గొండ జిల్లా-Nalgonda', district_name: 'నల్గొండ జిల్లా-Nalgonda', state_id: 2, d_in: 0 },
  { id: 51, distrct_nm: 'నారాయణపేట జిల్లా-Narayanpet', districtname: 'నారాయణపేట జిల్లా-Narayanpet', district_name: 'నారాయణపేట జిల్లా-Narayanpet', state_id: 2, d_in: 0 },
  { id: 52, distrct_nm: 'నిర్మల్ జిల్లా-Nirmal', districtname: 'నిర్మల్ జిల్లా-Nirmal', district_name: 'నిర్మల్ జిల్లా-Nirmal', state_id: 2, d_in: 0 },
  { id: 53, distrct_nm: 'నిజామాబాద్ జిల్లా-Nizamabad', districtname: 'నిజామాబాద్ జిల్లా-Nizamabad', district_name: 'నిజామాబాద్ జిల్లా-Nizamabad', state_id: 2, d_in: 0 },
  { id: 54, distrct_nm: 'పెద్దపల్లి జిల్లా-Peddapalli', districtname: 'పెద్దపల్లి జిల్లా-Peddapalli', district_name: 'పెద్దపల్లి జిల్లా-Peddapalli', state_id: 2, d_in: 0 },
  { id: 55, distrct_nm: 'రాజన్న సిరిసిల్ల జిల్లా-Rajanna Sircilla', districtname: 'రాజన్న సిరిసిల్ల జిల్లా-Rajanna Sircilla', district_name: 'రాజన్న సిరిసిల్ల జిల్లా-Rajanna Sircilla', state_id: 2, d_in: 0 },
  { id: 56, distrct_nm: 'రంగారెడ్డి జిల్లా-Ranga Reddy', districtname: 'రంగారెడ్డి జిల్లా-Ranga Reddy', district_name: 'రంగారెడ్డి జిల్లా-Ranga Reddy', state_id: 2, d_in: 0 },
  { id: 57, distrct_nm: 'సంగారెడ్డి జిల్లా-Sangareddy', districtname: 'సంగారెడ్డి జిల్లా-Sangareddy', district_name: 'సంగారెడ్డి జిల్లా-Sangareddy', state_id: 2, d_in: 0 },
  { id: 58, distrct_nm: 'సిద్దిపేట జిల్లా-Siddipet', districtname: 'సిద్దిపేట జిల్లా-Siddipet', district_name: 'సిద్దిపేట జిల్లా-Siddipet', state_id: 2, d_in: 0 },
  { id: 59, distrct_nm: 'సూర్యాపేట జిల్లా-Suryapet', districtname: 'సూర్యాపేట జిల్లా-Suryapet', district_name: 'సూర్యాపేట జిల్లా-Suryapet', state_id: 2, d_in: 0 },
  { id: 60, distrct_nm: 'వికారాబాద్ జిల్లా-Vikarabad', districtname: 'వికారాబాద్ జిల్లా-Vikarabad', district_name: 'వికారాబాద్ జిల్లా-Vikarabad', state_id: 2, d_in: 0 },
  { id: 61, distrct_nm: 'వనపర్తి జిల్లా-Wanaparthy', districtname: 'వనపర్తి జిల్లా-Wanaparthy', district_name: 'వనపర్తి జిల్లా-Wanaparthy', state_id: 2, d_in: 0 },
  { id: 62, distrct_nm: 'వరంగల్ జిల్లా-Warangal', districtname: 'వరంగల్ జిల్లా-Warangal', district_name: 'వరంగల్ జిల్లా-Warangal', state_id: 2, d_in: 0 },
  { id: 63, distrct_nm: 'యాదాద్రి భువనగిరి జిల్లా-Yadadri Bhuvanagiri', districtname: 'యాదాద్రి భువనగిరి జిల్లా-Yadadri Bhuvanagiri', district_name: 'యాదాద్రి భువనగిరి జిల్లా-Yadadri Bhuvanagiri', state_id: 2, d_in: 0 }
];

const states = [
  { id: 1, state_name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', name: 'Andhra Pradesh-ఆంధ్రప్రదేశ్ (AP)', code: 'AP', d_in: 0 },
  { id: 2, state_name: 'Telangana-తెలంగాణ (TG)', name: 'Telangana-తెలంగాణ (TG)', code: 'TG', d_in: 0 }
];

// If not yet added states
if (!content.includes('"states": [')) {
  const target = 'export const FALLBACK_DROPDOWN_DATA = {';
  const statesJson = JSON.stringify(states, null, 2).replace(/^/gm, '  ');
  const replacement = `export const FALLBACK_DROPDOWN_DATA = {\n  "states": ${JSON.stringify(states, null, 4)},\n`;
  content = content.replace(target, replacement);
  console.log('Added states to FALLBACK_DROPDOWN_DATA');
}

// Add state_id: 1 to existing districts if missing, and append TG districts
if (!content.includes('"Adilabad"')) {
  // Add tgDistricts into districts array
  const tgDistrictsJson = JSON.stringify(tgDistricts, null, 4).slice(1, -1); // remove outer []
  content = content.replace(/"districts":\s*\[/, `"districts": [\n${tgDistrictsJson},`);
  console.log('Added 33 Telangana districts to FALLBACK_DROPDOWN_DATA.districts');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('dropdown_fallback_data.ts updated!');
