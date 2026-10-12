const fs = require('fs');
const path = require('path');

const webAppDir = path.join(__dirname, '..', 'src', 'app', 'jesus');
const servicePath = path.join(webAppDir, 'service.service.ts');
const serviceCode = fs.readFileSync(servicePath, 'utf8');

const dirs = fs.readdirSync(webAppDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log(`Checking ${dirs.length} component directories in src/app/jesus...\n`);

const report = [];

dirs.forEach(dir => {
  const htmlPath = path.join(webAppDir, dir, `${dir}.component.html`);
  const tsPath = path.join(webAppDir, dir, `${dir}.component.ts`);
  if (!fs.existsSync(htmlPath) || !fs.existsSync(tsPath)) return;

  const html = fs.readFileSync(htmlPath, 'utf8');
  const ts = fs.readFileSync(tsPath, 'utf8');

  // Extract all <select> blocks
  const selectRegex = /<select[\s\S]*?<\/select>/gi;
  let match;
  while ((match = selectRegex.exec(html)) !== null) {
    const selectHtml = match[0];
    const ctrlMatch = selectHtml.match(/formControlName="([^"]+)"/) || selectHtml.match(/name="([^"]+)"/) || selectHtml.match(/\[\(ngModel\)\]="([^"]+)"/);
    const ctrl = ctrlMatch ? ctrlMatch[1] : 'unnamed';

    const ngForMatch = selectHtml.match(/\*ngFor\s*=\s*"let\s+([a-zA-Z0-9_$]+)\s+of\s+([a-zA-Z0-9_$.]+)"/);
    const clickMatch = selectHtml.match(/\(click\)\s*=\s*"([^"(]+)/);
    const changeMatch = selectHtml.match(/\(change\)\s*=\s*"([^"(]+)/);

    const clickHandler = clickMatch ? clickMatch[1].trim() : null;
    const changeHandler = changeMatch ? changeMatch[1].trim() : null;

    if (!ngForMatch) {
      // Check static options
      const options = [...selectHtml.matchAll(/<option[\s\S]*?<\/option>/gi)];
      const selectable = options.filter(o => !o[0].includes('disabled'));
      if (selectable.length === 0) {
        report.push({
          component: dir,
          ctrl,
          issue: 'STATIC_SELECT_NO_OPTIONS',
          details: 'Static select has no enabled options'
        });
      }
    } else {
      const itemVar = ngForMatch[1];
      const arrayExpr = ngForMatch[2]; // e.g. "districts" or "getchurchpastors"
      const arrayVar = arrayExpr.split('.')[0];

      // 1. Is arrayVar in TS?
      const arrayInTs = ts.includes(arrayVar);
      if (!arrayInTs) {
        report.push({
          component: dir,
          ctrl,
          arrayVar,
          issue: 'ARRAY_NOT_IN_TS',
          details: `Template loops over '${arrayVar}', but '${arrayVar}' is NEVER declared or referenced in ${dir}.component.ts`
        });
      } else {
        // 2. Is arrayVar ever assigned in TS?
        // Patterns: this.arrayVar = ..., arrayVar = ..., arrayVar: ... = [...]
        const assignPattern = new RegExp(`(?:this\\.)?${arrayVar}\\s*(?::[^=]+)?=`, 'g');
        const isAssigned = assignPattern.test(ts);
        if (!isAssigned) {
          report.push({
            component: dir,
            ctrl,
            arrayVar,
            issue: 'ARRAY_NEVER_ASSIGNED',
            details: `'${arrayVar}' is in TS, but never assigned any data!`
          });
        }
      }

      // 3. Are handlers defined in TS?
      if (clickHandler && !ts.includes(`${clickHandler}(`) && !ts.includes(`${clickHandler} =`)) {
        report.push({
          component: dir,
          ctrl,
          handler: clickHandler,
          issue: 'CLICK_HANDLER_MISSING',
          details: `(click)="${clickHandler}" is not defined in ${dir}.component.ts`
        });
      }
      if (changeHandler && !ts.includes(`${changeHandler}(`) && !ts.includes(`${changeHandler} =`)) {
        report.push({
          component: dir,
          ctrl,
          handler: changeHandler,
          issue: 'CHANGE_HANDLER_MISSING',
          details: `(change)="${changeHandler}" is not defined in ${dir}.component.ts`
        });
      }

      // 4. Check what properties are rendered from itemVar
      const propRegex = new RegExp(`{{\\s*${itemVar}\\.([a-zA-Z0-9_$]+)`, 'g');
      let pMatch;
      const propsRendered = [];
      while ((pMatch = propRegex.exec(selectHtml)) !== null) {
        propsRendered.push(pMatch[1]);
      }

      // 5. Special check: ministryname populated from getbeliversdata
      if (arrayVar === 'ministryname' || ctrl === 'ministry_id' || ctrl === 'ministryname') {
        if (ts.includes('getbeliversdata') && ts.includes('ministryname = res.data')) {
          report.push({
            component: dir,
            ctrl,
            arrayVar,
            issue: 'MINISTRY_POPULATED_FROM_BELIEVERS',
            details: `this.ministryname is populated by getbeliversdata() instead of getministry()! Believer objects do not have ministryname.`
          });
        }
      }
    }
  }
});

console.log(`Audit finished. Found ${report.length} issues:\n`);
console.log(JSON.stringify(report, null, 2));

fs.writeFileSync(path.join(__dirname, 'deep_audit_report.json'), JSON.stringify(report, null, 2), 'utf8');
