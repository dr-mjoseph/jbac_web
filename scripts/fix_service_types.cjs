const fs = require('fs');

let s = fs.readFileSync('src/app/jesus/service.service.ts', 'utf8');

// Ensure Observable is imported from rxjs
if (!s.includes('Observable,')) {
  s = s.replace("import { BehaviorSubject, of } from 'rxjs';", "import { BehaviorSubject, of, Observable } from 'rxjs';");
}

// Add : Observable<any> to all dropdown methods in service.service.ts
const methodsToType = [
  'getconsistencys',
  'getmconsistencys',
  'getmandals',
  'getmmandals',
  'gepanchayatis',
  'gempanchayatis',
  'getmdistrict',
  'getdistrict',
  'getdenomation',
  'getwing',
  'getleaderlevel',
  'geteducational',
  'getpattern',
  'getministry',
  'getbeliversdata',
  'getpastor',
  'getchurch',
  'getpastorsfilters',
  'getchurchesdatafilters',
  'getpastorassci',
  'getservices'
];

methodsToType.forEach(m => {
  // Regex to match m(...) without : Observable<any>
  const re = new RegExp(`(${m}\\s*\\([^)]*\\))\\s*\\{`, 'g');
  s = s.replace(re, `$1: Observable<any> {`);
});

// Also in of({ status: 200, ... }) ensure message: '' is included
s = s.replace(/\{\s*status:\s*200,\s*data:\s*([^}]+)\}/g, '{ status: 200, data: $1, message: "Success" } as any');

fs.writeFileSync('src/app/jesus/service.service.ts', s, 'utf8');
console.log('Successfully updated service.service.ts with Observable<any> return types!');
