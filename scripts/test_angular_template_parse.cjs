const fs = require('fs');
const compiler = require('@angular/compiler');

const tpl = fs.readFileSync('scripts/extracted_fc_tpl.html', 'utf8');

console.log('Testing template parse with Angular compiler...');

try {
  // Try parsing the template expressions
  const parser = new compiler.Parser(new compiler.Lexer());
  
  // Find all interpolations {{ ... }}
  const interpRegex = /\{\{([^}]+)\}\}/g;
  let match;
  let exprErrors = 0;
  while ((match = interpRegex.exec(tpl)) !== null) {
    const expr = match[1].trim();
    try {
      parser.parseInterpolation(match[0], 'template.html');
    } catch (err) {
      exprErrors++;
      console.error('Expression parse error in: ' + match[0]);
      console.error(err.message || err);
    }
  }

  // Find all property bindings [property]="..." or [(ngModel)]="..." or *ngIf="..."
  const bindRegex = /\[\(?([a-zA-Z0-9_\-]+)\)?\]="([^"]+)"|\*ng(If|For)="([^"]+)"/g;
  let bMatch;
  while ((bMatch = bindRegex.exec(tpl)) !== null) {
    const bExpr = bMatch[2] || bMatch[4];
    try {
      if (bMatch[0].startsWith('*ngFor')) {
        // ngFor syntax
      } else {
        parser.parseBinding(bExpr, 'template.html');
      }
    } catch (err) {
      exprErrors++;
      console.error('Binding parse error in: ' + bMatch[0]);
      console.error(err.message || err);
    }
  }

  console.log('Finished testing expressions. Total errors:', exprErrors);

} catch (e) {
  console.error('Top-level error:', e);
}
