const fs = require('fs');
const s = fs.readFileSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\build\\main.js', 'utf8');

const linksMatch = s.match(/links:\s*\[([\s\S]*?)\]/);
if (linksMatch) {
  const linksContent = linksMatch[1];
  const pageNames = [...linksContent.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1]);
  console.log("Total registered links in main.js:", pageNames.length);
  console.log("Registered page names:", pageNames);
  console.log("Is FamilyCouncellingPage in links?", pageNames.includes('FamilyCouncellingPage'));
  console.log("Is MarriagePage in links?", pageNames.includes('MarriagePage'));
  console.log("Is DoctorregisterPage in links?", pageNames.includes('DoctorregisterPage'));
} else {
  console.log("No links block found");
}

// Also check webpack jsonp / chunk loader map!
const chunkMapMatch = s.match(/return\s+__webpack_require__\.e\([^)]+\)/);
console.log("Webpack chunk loading:", chunkMapMatch ? chunkMapMatch[0] : 'None');
