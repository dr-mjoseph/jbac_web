const fs = require('fs');
const s = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\main.js', 'utf8');

// Search for links or deep links in main.js
const regexes = [
  /links\s*:\s*\[[\s\S]*?\]/,
  /FamilyCouncellingPage/g,
  /MarriagePage/g,
  /DoctorregisterPage/g
];

console.log("FamilyCouncellingPage matches:", (s.match(/FamilyCouncellingPage/g) || []).length);
console.log("MarriagePage matches:", (s.match(/MarriagePage/g) || []).length);
console.log("DoctorregisterPage matches:", (s.match(/DoctorregisterPage/g) || []).length);

// Find where links or lazy load map is defined
const linksIdx = s.indexOf('links:');
if (linksIdx !== -1) {
  console.log("Found 'links:' at", linksIdx);
  console.log(s.substring(linksIdx, linksIdx + 800));
} else {
  console.log("'links:' not found");
}

// Find webpack dynamic import / chunk map
// In webpack 3 / ionic-app-scripts, look for script.src = or resolveWeak or deepLinks
const deepLinkIdx = s.indexOf('DeepLinkMetadataFactory');
console.log("DeepLinkMetadataFactory found at:", deepLinkIdx);
if (deepLinkIdx !== -1) {
  console.log(s.substring(deepLinkIdx, deepLinkIdx + 600));
}
