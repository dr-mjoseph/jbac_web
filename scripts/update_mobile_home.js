const fs = require('fs');
const path = require('path');

const mobileHomePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\home\\home.html';

if (!fs.existsSync(mobileHomePath)) {
    console.error('File not found:', mobileHomePath);
    process.exit(1);
}

let content = fs.readFileSync(mobileHomePath, 'utf8');

// 1. Add Family Counselling to News Marquee if not present
const marqueePattern = '<span (click)="gotopage(14)">మీ చర్చికి మా టెక్నికల్ సొల్లుషన్స్ .</span>';
const newMarqueeItem = `<span (click)="gotopage(14)">మీ చర్చికి మా టెక్నికల్ సొల్లుషన్స్ .</span>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span (click)="gotopage(19)" style="color:#00548F;font-weight:bolder;">✨ నూతన సేవ: ఫ్యామిలీ కౌన్సిలింగ్ & డాక్టర్ అపాయింట్‌మెంట్లు .</span>`;

if (!content.includes('✨ నూతన సేవ: ఫ్యామిలీ కౌన్సిలింగ్')) {
    if (content.includes(marqueePattern)) {
        content = content.replace(marqueePattern, newMarqueeItem);
        console.log('Updated news marquee with Family Counselling');
    }
}

// 2. Add Family Counselling Announcement Banner below marquee
const bannerHtml = `
  <div style="margin: 8px 12px; padding: 12px 14px; background: linear-gradient(135deg, #1f376e, #237e8d); border-radius: 12px; color: white; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 10px rgba(31,55,110,0.25); cursor: pointer;" (click)="gotopage(19)">
    <div style="display: flex; align-items: center;">
      <div style="background: rgba(255,255,255,0.2); border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 22px;">
        👨‍⚕️
      </div>
      <div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; color: #ffeb3b;">
          📢 నూతన సేవ • NEW SERVICE
        </div>
        <div style="font-size: 14px; font-weight: bold; margin-top: 2px;">
          ఫ్యామిలీ కౌన్సిలింగ్ (Family Counselling)
        </div>
      </div>
    </div>
    <div style="font-size: 20px; font-weight: bold; padding-left: 8px; color: #ffeb3b;">
      ➔
    </div>
  </div>
`;

if (!content.includes('📢 నూతన సేవ • NEW SERVICE') && content.includes('<ion-row style="text-align: center;">')) {
    content = content.replace('<ion-row style="text-align: center;">', bannerHtml + '\n  <ion-row style="text-align: center;">');
    console.log('Added highlighted Family Counselling banner');
}

// 3. Add Family Counselling Icon Tile in the service grid (after gotopage(5))
const targetTile = `<ion-col col-3 class="made" (click)="gotopage(5)">`;
const newTileHtml = `    <ion-col col-3 class="made" (click)="gotopage(19)" style="border: 1.5px solid #1f376e;">
      <img style="padding:3%;width:100%" src="assets/icon/svg/couple.svg">
      <b> ఫ్యామిలీ<br>కౌన్సిలింగ్ </b>
    </ion-col>
`;

if (!content.includes('assets/icon/svg/couple.svg')) {
    const tileStart = content.indexOf(targetTile);
    if (tileStart !== -1) {
        const insertPos = content.indexOf('</ion-col>', tileStart);
        if (insertPos !== -1) {
            content = content.slice(0, insertPos + 10) + '\n\n' + newTileHtml + content.slice(insertPos + 10);
            console.log('Added Family Counselling icon tile to home page grid');
        }
    }
}

fs.writeFileSync(mobileHomePath, content, 'utf8');
console.log('Successfully written to', mobileHomePath);
