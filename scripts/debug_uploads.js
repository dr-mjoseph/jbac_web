const fs = require('fs');

console.log('=== FILE INPUTS IN PROFILE ===');
const pContent = fs.readFileSync('src/app/jesus/profile/profile.component.html', 'utf8');
const fileMatches = [...pContent.matchAll(/<input[^>]*type=['"]file['"][^>]*>/gi)];
console.log('File inputs count:', fileMatches.length);
fileMatches.forEach(m => console.log(m[0]));

console.log('\n=== FILE INPUTS IN SIGNUP ===');
const sContent = fs.readFileSync('src/app/jesus/signup/signup.component.html', 'utf8');
const sMatches = [...sContent.matchAll(/<input[^>]*type=['"]file['"][^>]*>/gi)];
console.log('File inputs count in signup:', sMatches.length);
sMatches.forEach(m => console.log(m[0]));
