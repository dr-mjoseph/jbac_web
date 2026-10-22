const fs = require('fs');
const path = require('path');

const studentHtmlPath = 'c:/Users/rajes/StudioProjects/jbac_app/src/pages/student/student.html';
let html = fs.readFileSync(studentHtmlPath, 'utf8').replace(/\r\n/g, '\n');

// 1. School state select before district_id
const schoolTarget = `        <ion-col col-12>
          <ion-item>
            <ion-label stacked>జిల్లాను ఎంచుకోండి<span
                style="color:red; ">*</span></ion-label>
            <ion-select formControlName="district_id"`;

const schoolReplacement = `        <ion-col col-12>
          <ion-item>
            <ion-label stacked>రాష్ట్రం / State (కళాశాల/పాఠశాల) <span style="color:red; ">*</span></ion-label>
            <ion-select formControlName="state_id" (ionChange)="onStateChange($event)">
              <ion-option *ngFor="let s of states" [value]="s.id">{{s.state_name}}</ion-option>
            </ion-select>
          </ion-item>
        </ion-col>
        <ion-col col-12>
          <ion-item>
            <ion-label stacked>జిల్లాను ఎంచుకోండి<span
                style="color:red; ">*</span></ion-label>
            <ion-select formControlName="district_id"`;

if (html.includes(schoolTarget)) {
  html = html.replace(schoolTarget, schoolReplacement);
  console.log('1. Added school state dropdown to mobile student.html');
} else {
  console.error('Could not find schoolTarget in student.html');
}

// 2. Residential state select before resdistricts
const resTarget = `        <ion-col col-12>
          <ion-item>
            <ion-label stacked>జిల్లాలను ఎంచుకోండి<span style="color:red">*</span></ion-label>
            <ion-select formControlName="resdistricts"`;

const resReplacement = `        <ion-col col-12>
          <ion-item>
            <ion-label stacked>రాష్ట్రం / State (నివాసం) <span style="color:red">*</span></ion-label>
            <ion-select formControlName="res_state_id" (ionChange)="onResStateChange($event)">
              <ion-option *ngFor="let s of states" [value]="s.id">{{s.state_name}}</ion-option>
            </ion-select>
          </ion-item>
        </ion-col>
        <ion-col col-12>
          <ion-item>
            <ion-label stacked>జిల్లాలను ఎంచుకోండి<span style="color:red">*</span></ion-label>
            <ion-select formControlName="resdistricts"`;

if (html.includes(resTarget)) {
  html = html.replace(resTarget, resReplacement);
  console.log('2. Added residential state dropdown to mobile student.html');
} else {
  console.error('Could not find resTarget in student.html');
}

fs.writeFileSync(studentHtmlPath, html.replace(/\n/g, '\r\n'), 'utf8');
console.log('Mobile student.html updated successfully!');
