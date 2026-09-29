const fs = require('fs');
const dump = fs.readFileSync('database/jbac_structure.sql', 'utf8');

const jobsIdx = dump.indexOf('INSERT INTO `jobs`');
if (jobsIdx !== -1) {
  console.log('Found INSERT INTO jobs:');
  console.log(dump.substring(jobsIdx, jobsIdx + 800));
} else {
  console.log('No INSERT INTO jobs found');
}

const edIdx = dump.indexOf('INSERT INTO `education`');
if (edIdx !== -1) {
  console.log('Found INSERT INTO education:');
  console.log(dump.substring(edIdx, edIdx + 400));
}
