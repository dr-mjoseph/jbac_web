const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/rajes/StudioProjects/jbac_app/src';

// 1. app.html
const appHtml = `<ion-menu [content]="content" type="overlay">
  <ion-header>
    <ion-toolbar color="primary" style="background-color: #00548F; color: white;">
      <ion-title style="color: white; font-weight: bold; font-size: 16px;">
        JBAC మెనూ
      </ion-title>
      <ion-buttons end>
        <button ion-button icon-only menuClose tappable style="color: white; font-size: 22px;">
          <ion-icon name="close"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content style="background-color: #f1f5f9;">
    <div style="background: linear-gradient(135deg, #00548F, #19386d); padding: 16px 14px; color: white; margin-bottom: 8px;">
      <div style="font-size: 16px; font-weight: bold; color: white;">Welcome to JBAC</div>
      <div style="font-size: 11px; color: #dbeafe; margin-top: 3px;">జీసస్ బిలీవర్స్ అసోసియేషన్, ఆంధ్ర ప్రదేశ్</div>
    </div>

    <ion-list no-lines style="margin: 0; padding: 0 0 24px 0;">
      <button ion-item *ngFor="let a of pages" (click)="openPage(a.page)" menuClose tappable class="jbac-menu-item">
        <ion-avatar item-start class="jbac-menu-avatar">
          <img [src]="a.image">
        </ion-avatar>
        <ion-label class="jbac-menu-label">
          <div class="jbac-menu-title">{{a.title}}</div>
          <div *ngIf="a.subtitle" class="jbac-menu-sub">{{a.subtitle}}</div>
        </ion-label>
        <ion-icon name="ios-arrow-forward" item-end class="jbac-menu-arrow"></ion-icon>
      </button>
    </ion-list>
  </ion-content>
</ion-menu>

<!-- Disable swipe-to-go-back because it's poor UX to combine STGB with side menus -->
<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>
`;
fs.writeFileSync(path.join(srcDir, 'app/app.html'), appHtml, 'utf8');
console.log('src/app/app.html synced.');

// 2. forms.ts
let formsTs = fs.readFileSync(path.join(srcDir, 'pages/forms/forms.ts'), 'utf8');
if (!formsTs.includes("this.navCtrl.push('DoctorregisterPage')")) {
  formsTs = formsTs.replace(
    /else if \(id == 27\) \{/g,
    `else if (id == 8) {
      this.navCtrl.push('DoctorregisterPage');
    } else if (id == 27) {`
  );
  fs.writeFileSync(path.join(srcDir, 'pages/forms/forms.ts'), formsTs, 'utf8');
}
console.log('src/pages/forms/forms.ts synced.');

// 3. forms2.ts
let forms2Ts = fs.readFileSync(path.join(srcDir, 'pages/forms2/forms2.ts'), 'utf8');
if (!forms2Ts.includes("this.navCtrl.push('FamilyCouncellingPage')")) {
  forms2Ts = forms2Ts.replace(
    /else if \(id == 7\) \{\s*this\.navCtrl\.push\('SearchorganisationPage'\);\s*\}/,
    `else if (id == 7) {
      this.navCtrl.push('SearchorganisationPage');
    } else if (id == 8) {
      this.navCtrl.push('FamilyCouncellingPage');
    }`
  );
  fs.writeFileSync(path.join(srcDir, 'pages/forms2/forms2.ts'), forms2Ts, 'utf8');
}
console.log('src/pages/forms2/forms2.ts synced.');

console.log('All source files synced successfully!');
