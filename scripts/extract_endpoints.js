const fs = require('fs');
const content = fs.readFileSync('src/app/jesus/service.service.ts', 'utf8');
const regex = /this\.testApi\s*\+\s*[`'"]([^`'"]+)[`'"]/g;
const endpoints = new Set();
let match;
while ((match = regex.exec(content)) !== null) {
  endpoints.add(match[1]);
}
console.log('Total Endpoints in service.service.ts:', endpoints.size);
console.log([...endpoints].sort().join('\n'));
