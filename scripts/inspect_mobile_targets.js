const fs = require('fs');
const path = require('path');

const mobileDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages';

const filesToInspect = [
  'believer/believer.ts',
  'addinstitute/addinstitute.ts',
  'addmarriage/addmarriage.ts',
  'organisation/organisation.ts',
  'institute/institute.ts',
  'searchhouse/searchhouse.ts',
  'profile/profile.ts'
];

for (const rel of filesToInspect) {
  const p = path.join(mobileDir, rel);
  console.log(`\n=================== ${rel} ===================`);
  if (!fs.existsSync(p)) {
    console.log('File does NOT exist:', p);
    continue;
  }
  const content = fs.readFileSync(p, 'utf8');
  const lines = content.split('\n');
  console.log(`Total lines: ${lines.length}`);
  
  if (rel === 'believer/believer.ts') {
    lines.forEach((line, idx) => {
      if (line.includes('beliverform') || line.includes('ionViewDidLoad') || line.includes('getchurch') || line.includes('wings')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  } else if (rel === 'addinstitute/addinstitute.ts') {
    lines.forEach((line, idx) => {
      if (line.includes('pastor') || line.includes('ionViewDidLoad')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  } else if (rel === 'addmarriage/addmarriage.ts') {
    lines.forEach((line, idx) => {
      if (line.includes('pastor') || line.includes('ionViewDidLoad')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  } else if (rel === 'organisation/organisation.ts') {
    lines.forEach((line, idx) => {
      if (line.includes('pastor') || line.includes('ionViewDidLoad')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  } else if (rel === 'institute/institute.ts') {
    lines.forEach((line, idx) => {
      if (line.includes('toggle') || line.includes('Display') || idx < 30) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  } else if (rel === 'searchhouse/searchhouse.ts') {
    lines.forEach((line, idx) => {
      if (line.includes('call') || idx < 30) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  } else if (rel === 'profile/profile.ts') {
    lines.forEach((line, idx) => {
      if (line.includes('getpastor') || line.includes('getchurch') || line.includes('ionViewDidLoad')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }
}
