const fs = require('fs');

const serviceCode = fs.readFileSync('src/app/jesus/service.service.ts', 'utf8');
const serverCode = fs.readFileSync('backend/server.js', 'utf8');

// Match endpoints in service.service.ts
const matches = [...serviceCode.matchAll(/this\.testApi\s*\+\s*[`'"]([^`'"]+)[`'"]/g)];
const endpoints = [...new Set(matches.map(m => m[1].replace(/[`'"].*/, '').trim()))].sort();

console.log(`Total endpoints in service.service.ts: ${endpoints.length}`);

const missing = [];
for (const ep of endpoints) {
  // check if serverCode contains '/dashboardapi/' + ep or '/' + ep
  if (!serverCode.includes(`'/${ep}'`) && 
      !serverCode.includes(`'${ep}'`) && 
      !serverCode.includes(`/${ep}`) &&
      !serverCode.includes(ep)) {
    missing.push(ep);
  }
}

console.log('Endpoints potentially missing in server.js:');
console.log(missing);
