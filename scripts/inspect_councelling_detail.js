const fs = require('fs');
const path = require('path');
const m = 'C:/Users/rajes/StudioProjects/jbac_app';

const fcHtml = path.join(m, 'src/pages/family-councelling/family-councelling.html');
const fcTs = path.join(m, 'src/pages/family-councelling/family-councelling.ts');

console.log('=== FC HTML FULL (length: ' + fs.readFileSync(fcHtml, 'utf8').length + ') ===');
// print segment buttons and banners
const html = fs.readFileSync(fcHtml, 'utf8');
console.log(html.substring(0, 3000));

console.log('=== FC TS ionViewWillEnter ===');
const ts = fs.readFileSync(fcTs, 'utf8');
const willEnterIdx = ts.indexOf('ionViewWillEnter');
console.log(ts.substring(willEnterIdx, willEnterIdx + 1500));
