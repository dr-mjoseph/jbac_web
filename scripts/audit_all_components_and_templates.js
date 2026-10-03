const fs = require('fs');
const path = require('path');

const webAppDir = path.join(__dirname, '..', 'src', 'app', 'jesus');
const mobileAppDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages';

// -------------------------------------------------------------
// 1. WEB APP AUDIT
// -------------------------------------------------------------
function auditWebApp() {
  console.log('\n======================================================');
  console.log('  AUDITING WEB APP (jbac_web): Forms, Buttons, Dropdowns');
  console.log('======================================================');

  const components = fs.readdirSync(webAppDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const report = [];

  for (const comp of components) {
    const htmlFile = path.join(webAppDir, comp, `${comp}.component.html`);
    const tsFile = path.join(webAppDir, comp, `${comp}.component.ts`);

    if (!fs.existsSync(htmlFile) || !fs.existsSync(tsFile)) continue;

    const html = fs.readFileSync(htmlFile, 'utf8');
    const ts = fs.readFileSync(tsFile, 'utf8');

    const compReport = {
      component: comp,
      forms: [],
      dropdowns: [],
      buttons: [],
      fileUploads: [],
      issues: []
    };

    // 1. Detect Forms
    const formGroupMatches = [...html.matchAll(/\[formGroup\]="([^"]+)"/g)];
    const ngSubmitMatches = [...html.matchAll(/\(ngSubmit\)="([^"]+)"/g)];
    const formControlsInHtml = [...html.matchAll(/formControlName="([^"]+)"/g)].map(m => m[1]);

    // Check if FormGroups are declared in TS
    for (const fg of formGroupMatches) {
      const fgName = fg[1];
      compReport.forms.push(fgName);
      if (!ts.includes(fgName)) {
        compReport.issues.push(`FormGroup '${fgName}' used in HTML but not declared in TS!`);
      }
    }

    // 2. Detect Dropdowns (<select> and <ng-select>)
    const selectMatches = [...html.matchAll(/<(?:select|ng-select)[^>]*>/gi)];
    for (const sel of selectMatches) {
      const tag = sel[0];
      const nameMatch = tag.match(/formControlName="([^"]+)"/) || tag.match(/name="([^"]+)"/) || tag.match(/\[\s*\(ngModel\)\s*\]="([^"]+)"/);
      const name = nameMatch ? nameMatch[1] : 'unnamed-dropdown';
      const changeMatch = tag.match(/\(change\)="([^"]+)"/) || tag.match(/\(selectionChange\)="([^"]+)"/);
      const changeHandler = changeMatch ? changeMatch[1] : null;

      // Find the *ngFor inside or right after this select
      const selectStartIndex = sel.index;
      const selectEndIndex = html.indexOf('</select>', selectStartIndex);
      const selectBody = selectEndIndex !== -1 ? html.substring(selectStartIndex, selectEndIndex + 9) : tag;

      const ngForMatch = selectBody.match(/\*ngFor="let\s+([a-zA-Z0-9_$]+)\s+of\s+([a-zA-Z0-9_$.]+)"/);
      const itemsMatch = tag.match(/\[items\]="([^"]+)"/); // for ng-select

      const sourceArray = ngForMatch ? ngForMatch[2] : (itemsMatch ? itemsMatch[1] : null);

      const dropdownInfo = {
        name,
        sourceArray,
        changeHandler
      };

      // Validation checks
      if (sourceArray) {
        const rootArray = sourceArray.split('.')[0];
        // Check if rootArray is defined in TS
        const isDeclaredInTs = new RegExp(`(?:public|private|protected)?\\s*${rootArray}\\s*[:=;]`).test(ts) ||
                               ts.includes(`this.${rootArray}`) ||
                               ts.includes(`${rootArray}:`);
        if (!isDeclaredInTs) {
          compReport.issues.push(`Dropdown '${name}': source array '${sourceArray}' not declared in TS!`);
        } else {
          // Check if it is populated in TS
          const isPopulated = ts.includes(`this.${rootArray} =`) || ts.includes(`this.${rootArray}=`) || ts.includes(`${rootArray} =`);
          if (!isPopulated) {
            compReport.issues.push(`Dropdown '${name}': source array '${sourceArray}' is declared but NEVER assigned/populated in TS!`);
          }
        }
      } else {
        // Check if options are hardcoded
        const hasHardcodedOptions = selectBody.includes('<option');
        if (!hasHardcodedOptions) {
          compReport.issues.push(`Dropdown '${name}': has NO *ngFor and NO <option> tags! (Empty dropdown)`);
        }
      }

      if (changeHandler) {
        const handlerName = changeHandler.split('(')[0].trim();
        if (!ts.includes(`${handlerName}(`)) {
          compReport.issues.push(`Dropdown '${name}': change handler '${handlerName}' not defined in TS!`);
        }
      }

      compReport.dropdowns.push(dropdownInfo);
    }

    // 3. Detect Buttons & Clickables
    const buttonMatches = [...html.matchAll(/<(?:button|a)[^>]*\(click\)="([^"]+)"[^>]*>/gi)];
    for (const b of buttonMatches) {
      const fullTag = b[0];
      const clickAction = b[1];
      const handlerName = clickAction.split('(')[0].trim();
      compReport.buttons.push({ action: clickAction });

      // Check if handler exists in TS (ignoring simple inline assignments like x = true)
      if (!clickAction.includes('=') && handlerName) {
        if (!ts.includes(`${handlerName}(`)) {
          compReport.issues.push(`Button click handler '${handlerName}' not implemented in TS!`);
        }
      }
    }

    // 4. Detect File Uploads
    const fileInputs = [...html.matchAll(/<input[^>]*type="file"[^>]*>/gi)];
    for (const fi of fileInputs) {
      const tag = fi[0];
      const changeMatch = tag.match(/\(change\)="([^"]+)"/);
      const handler = changeMatch ? changeMatch[1] : null;
      compReport.fileUploads.push({ tag, handler });
      if (handler) {
        const handlerName = handler.split('(')[0].trim();
        if (!ts.includes(`${handlerName}(`)) {
          compReport.issues.push(`File upload change handler '${handlerName}' not implemented in TS!`);
        }
      } else {
        compReport.issues.push(`File upload input has NO (change) event listener! File cannot be uploaded.`);
      }
    }

    report.push(compReport);
  }

  return report;
}

// -------------------------------------------------------------
// 2. MOBILE APP AUDIT
// -------------------------------------------------------------
function auditMobileApp() {
  console.log('\n======================================================');
  console.log('  AUDITING MOBILE APP (jbac_app): Forms, Buttons, Dropdowns');
  console.log('======================================================');

  if (!fs.existsSync(mobileAppDir)) {
    console.log('[WARN] Mobile pages directory not found at', mobileAppDir);
    return [];
  }

  const pages = fs.readdirSync(mobileAppDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const report = [];

  for (const page of pages) {
    const htmlFile = path.join(mobileAppDir, page, `${page}.html`);
    const tsFile = path.join(mobileAppDir, page, `${page}.ts`);

    if (!fs.existsSync(htmlFile) || !fs.existsSync(tsFile)) continue;

    const html = fs.readFileSync(htmlFile, 'utf8');
    const ts = fs.readFileSync(tsFile, 'utf8');

    const pageReport = {
      page,
      dropdowns: [],
      buttons: [],
      issues: []
    };

    // 1. Detect <ion-select> and <select>
    const selectMatches = [...html.matchAll(/<(?:ion-select|select)[^>]*>/gi)];
    for (const sel of selectMatches) {
      const tag = sel[0];
      const nameMatch = tag.match(/formControlName="([^"]+)"/) || tag.match(/\[\s*\(ngModel\)\s*\]="([^"]+)"/) || tag.match(/name="([^"]+)"/);
      const name = nameMatch ? nameMatch[1] : 'unnamed-mobile-dropdown';
      const changeMatch = tag.match(/\(ionChange\)="([^"]+)"/) || tag.match(/\(change\)="([^"]+)"/);
      const changeHandler = changeMatch ? changeMatch[1] : null;

      // Find the select body
      const selectStartIndex = sel.index;
      const closingTag = tag.startsWith('<ion-select') ? '</ion-select>' : '</select>';
      const selectEndIndex = html.indexOf(closingTag, selectStartIndex);
      const selectBody = selectEndIndex !== -1 ? html.substring(selectStartIndex, selectEndIndex + closingTag.length) : tag;

      const ngForMatch = selectBody.match(/\*ngFor="let\s+([a-zA-Z0-9_$]+)\s+of\s+([a-zA-Z0-9_$.]+)"/);
      const sourceArray = ngForMatch ? ngForMatch[2] : null;

      pageReport.dropdowns.push({ name, sourceArray, changeHandler });

      if (sourceArray) {
        const rootArray = sourceArray.split('.')[0];
        const isDeclaredInTs = ts.includes(`this.${rootArray}`) ||
                               new RegExp(`(?:public|private)?\\s*${rootArray}`).test(ts);
        if (!isDeclaredInTs) {
          pageReport.issues.push(`Mobile Dropdown '${name}': source array '${sourceArray}' not declared in ${page}.ts!`);
        } else {
          const isPopulated = ts.includes(`this.${rootArray} =`) || ts.includes(`this.${rootArray}=`) || ts.includes(`${rootArray} =`);
          if (!isPopulated) {
            pageReport.issues.push(`Mobile Dropdown '${name}': source array '${sourceArray}' is NEVER populated/assigned in ${page}.ts!`);
          }
        }
      } else {
        const hasOptions = selectBody.includes('<ion-option') || selectBody.includes('<option');
        if (!hasOptions) {
          pageReport.issues.push(`Mobile Dropdown '${name}': has NO options and NO *ngFor!`);
        }
      }

      if (changeHandler) {
        const handlerName = changeHandler.split('(')[0].trim();
        if (!ts.includes(`${handlerName}(`)) {
          pageReport.issues.push(`Mobile Dropdown '${name}': change handler '${handlerName}' not defined in ${page}.ts!`);
        }
      }
    }

    // 2. Buttons & Clickables
    const buttonMatches = [...html.matchAll(/<(?:button|ion-button|a)[^>]*\(click\)="([^"]+)"[^>]*>/gi)];
    for (const b of buttonMatches) {
      const clickAction = b[1];
      const handlerName = clickAction.split('(')[0].trim();
      pageReport.buttons.push({ action: clickAction });

      if (!clickAction.includes('=') && handlerName) {
        if (!ts.includes(`${handlerName}(`)) {
          pageReport.issues.push(`Mobile Button click handler '${handlerName}' not implemented in ${page}.ts!`);
        }
      }
    }

    report.push(pageReport);
  }

  return report;
}

const webReport = auditWebApp();
const mobileReport = auditMobileApp();

const totalWebIssues = webReport.reduce((acc, c) => acc + c.issues.length, 0);
const totalMobileIssues = mobileReport.reduce((acc, c) => acc + c.issues.length, 0);

console.log('\n======================================================');
console.log(`  AUDIT COMPLETE: Found ${totalWebIssues} Web issues, ${totalMobileIssues} Mobile issues`);
console.log('======================================================');

const allIssues = {
  webIssues: webReport.filter(c => c.issues.length > 0),
  mobileIssues: mobileReport.filter(p => p.issues.length > 0)
};

fs.writeFileSync(path.join(__dirname, 'static_audit_issues.json'), JSON.stringify(allIssues, null, 2));

console.log('\n--- TOP WEB ISSUES ---');
for (const c of allIssues.webIssues) {
  console.log(`[Component: ${c.component}] (${c.issues.length} issues)`);
  c.issues.forEach(i => console.log(`  * ${i}`));
}

console.log('\n--- TOP MOBILE ISSUES ---');
for (const p of allIssues.mobileIssues) {
  console.log(`[Page: ${p.page}] (${p.issues.length} issues)`);
  p.issues.forEach(i => console.log(`  * ${i}`));
}
