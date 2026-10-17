const fs = require('fs');
const content = fs.readFileSync('c:/Users/rajes/Documents/jbac_web/src/app/jesus/namodu/namodu.component.html', 'utf8');

const selMatch = content.match(/<select[^>]*formControlName=["']category["'][^>]*>([\s\S]*?)<\/select>/i);
if (selMatch) {
  console.log('Category select:\n', selMatch[0]);
}

// Check if there are *ngIf checks based on category
const ngIfs = content.match(/\*ngIf="[^"]*category[^"]*"/gi);
console.log('ngIfs on category:', ngIfs);
