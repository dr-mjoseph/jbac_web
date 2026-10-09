const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const filesToCheck = [
  path.join(mobilePath, 'src', 'pages', 'doctorregister', 'doctorregister.ts'),
  path.join(mobilePath, 'src', 'pages', 'doctorregister', 'doctorregister.module.ts'),
  path.join(mobilePath, 'src', 'pages', 'family-councelling', 'family-councelling.ts'),
  path.join(mobilePath, 'src', 'pages', 'family-councelling', 'family-councelling.module.ts'),
  path.join(mobilePath, 'src', 'pages', 'forms', 'forms.ts'),
  path.join(mobilePath, 'src', 'pages', 'login', 'login.ts'),
  path.join(mobilePath, 'src', 'providers', 'service', 'service.ts')
];

let hasErrors = false;

for (const filePath of filesToCheck) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    hasErrors = true;
    continue;
  }
  const source = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    source,
    ts.ScriptTarget.Latest,
    true
  );
  const diagnostics = sourceFile.parseDiagnostics;
  if (diagnostics && diagnostics.length > 0) {
    console.error(`Syntax errors in ${path.basename(filePath)}:`);
    for (const diag of diagnostics) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start);
      console.error(`  Line ${line + 1}:${character + 1} - ${diag.messageText}`);
    }
    hasErrors = true;
  } else {
    console.log(`[PASS] ${path.basename(filePath)} has 0 syntax errors.`);
  }
}

if (!hasErrors) {
  console.log('\n>>> All Mobile TypeScript files parsed with 0 syntax errors! <<<');
} else {
  process.exit(1);
}
