const fs = require('fs');
const path = require('path');

const appRoot = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';

const files12js = [
  path.join(appRoot, 'www', 'build', '12.js'),
  path.join(appRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', '12.js')
];

const studentHtmlPath = path.join(appRoot, 'src', 'pages', 'student', 'student.html');
const studentHtml = fs.readFileSync(studentHtmlPath, 'utf8');
const escapedStudentHtml = studentHtml
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/\r/g, '')
  .replace(/\n/g, '\\n');

for (const f of files12js) {
  if (!fs.existsSync(f)) {
    console.warn('File not found: ' + f);
    continue;
  }
  let content = fs.readFileSync(f, 'utf8');

  // 1. Add tmarks, mmarks, branch to formBuilder if missing
  if (!content.includes("tmarks: ['']")) {
    content = content.replace(
      "talent: [''],",
      "talent: [''],\n            tmarks: [''],\n            mmarks: [''],\n            branch: [''],"
    );
  }

  // 2. Replace the inline template
  const templateStartMarker = 'template:/*ion-inline-start:"C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\student\\student.html"*/\'';
  const templateEndMarker = '\'/*ion-inline-end:"C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\student\\student.html"*/,';

  const startIdx = content.indexOf(templateStartMarker);
  const endIdx = content.indexOf(templateEndMarker);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const before = content.substring(0, startIdx + templateStartMarker.length);
    const after = content.substring(endIdx);
    content = before + escapedStudentHtml + after;
    console.log('Successfully updated inline template in:', f);
  } else {
    console.warn('Could not locate template markers in:', f);
  }

  fs.writeFileSync(f, content, 'utf8');
}

console.log('Finished updating 12.js');
