const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'church', chunk: '35.js', ts: 'church/church.ts', html: 'church/church.html' },
  { name: 'ministry', chunk: '21.js', ts: 'ministry/ministry.ts', html: 'ministry/ministry.html' },
  { name: 'organisation', chunk: '18.js', ts: 'organisation/organisation.ts', html: 'organisation/organisation.html' },
  { name: 'association', chunk: '38.js', ts: 'association/association.ts', html: 'association/association.html' },
  { name: 'pastor', chunk: '16.js', ts: 'pastor/pastor.ts', html: 'pastor/pastor.html' },
  { name: 'believer', chunk: '37.js', ts: 'believer/believer.ts', html: 'believer/believer.html' },
  { name: 'student', chunk: '12.js', ts: 'student/student.ts', html: 'student/student.html' }
];

const basePath = 'C:/Users/rajes/StudioProjects/jbac_app';

pages.forEach(p => {
  const htmlPath = path.join(basePath, 'src/pages', p.html);
  const tsPath = path.join(basePath, 'src/pages', p.ts);
  const jsPath = path.join(basePath, 'www/build', p.chunk);

  if (!fs.existsSync(htmlPath)) return;
  const html = fs.readFileSync(htmlPath, 'utf8');
  const js = fs.readFileSync(jsPath, 'utf8');
  const ts = fs.existsSync(tsPath) ? fs.readFileSync(tsPath, 'utf8') : '';

  // Find all formControlName in HTML
  const controls = new Set();
  const regex = /formControlName=["']([^"']+)["']/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    controls.add(m[1]);
  }

  // Check which are missing in JS formBuilder.group
  const jsFbMatch = js.match(/formBuilder\.group\(\{([\s\S]*?)\}\)/);
  const jsFb = jsFbMatch ? jsFbMatch[1] : '';

  const missingInJs = [];
  controls.forEach(ctrl => {
    const r = new RegExp('(^|\\s|"|\')' + ctrl + '(\\s|"|\')?:');
    if (!r.test(jsFb)) {
      missingInJs.push(ctrl);
    }
  });

  // Check which are missing in TS formBuilder.group
  const tsFbMatch = ts.match(/formBuilder\.group\(\{([\s\S]*?)\}\)/);
  const tsFb = tsFbMatch ? tsFbMatch[1] : '';
  const missingInTs = [];
  controls.forEach(ctrl => {
    const r = new RegExp('(^|\\s|"|\')' + ctrl + '(\\s|"|\')?:');
    if (!r.test(tsFb)) {
      missingInTs.push(ctrl);
    }
  });

  console.log(`\n=== Page: ${p.name} (Chunk: ${p.chunk}) ===`);
  console.log(`HTML controls: ${Array.from(controls).join(', ')}`);
  if (missingInJs.length > 0) {
    console.log(`  [ALERT] Missing in JS (www/build/${p.chunk}):`, missingInJs);
  } else {
    console.log(`  [OK] All HTML controls present in JS.`);
  }
  if (missingInTs.length > 0) {
    console.log(`  [ALERT] Missing in TS (src/pages/${p.ts}):`, missingInTs);
  } else {
    console.log(`  [OK] All HTML controls present in TS.`);
  }
});
