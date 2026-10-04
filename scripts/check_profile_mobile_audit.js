const fs = require('fs');
const audit = JSON.parse(fs.readFileSync('c:\\Users\\rajes\\Documents\\jbac_web\\scripts\\static_audit_issues.json', 'utf8'));
const mobileProfile = audit.mobileIssues.find(i => i.page === 'profile');
console.log('Mobile profile audit:', JSON.stringify(mobileProfile, null, 2));
