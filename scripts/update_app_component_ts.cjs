const fs = require('fs');
const path = require('path');

const p = 'C:/Users/rajes/StudioProjects/jbac_app/src/app/app.component.ts';
let c = fs.readFileSync(p, 'utf8');

const startTarget = 'this.pages = [';
const endTarget = 'this.service.updatecount()';

const startIdx = c.indexOf(startTarget);
const endIdx = c.indexOf(endTarget);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `this.pages = [
      { 'title': 'వివాహ & కుటుంబ కౌన్సిలింగ్ (Marriage Counselling)', 'image': 'assets/icon/svg/couple.svg', 'page': 'FamilyCouncellingPage' },
      { 'title': 'మీకు మా సహాయం', 'image': 'assets/icon/svg/helping-hand.svg', 'page': 'HelpinghandsPage' },
      { 'title': 'చర్చి పర్మిషన్ గవర్నమెంట్ ఆర్డర్స్', 'image': 'assets/icon/svg/governmental.svg', 'page': 'ChurchgoPage' },
      { 'title': 'వెబ్ సైట్ ఎలా ఉపయోగించాలి', 'image': 'assets/icon/svg/cloud-computing.svg', 'page': 'WebhelpPage' },
      { 'title': 'మీ చర్చికి మా టెక్నికల్ సొల్యూషన్స్', 'image': 'assets/icon/svg/employee.svg', 'page': 'TechsolPage' },
      { 'title': 'ఫోటో గ్యాలరీ', 'image': 'assets/icon/svg/picture.svg', 'page': 'GalleryPage' },
      { 'title': 'వీడియో గ్యాలరీ', 'image': 'assets/icon/svg/video.svg', 'page': 'VideoGalleryPage' },
      { 'title': 'క్రైస్తవులకు సంబంధించిన వార్తలు పెట్టండి', 'image': 'assets/icon/svg/news.svg', 'page': 'NewsPage' },
      { 'title': 'క్రైస్తవులపై దాడుల నమోదు', 'image': 'assets/icon/svg/organisation.svg', 'page': 'AddattacksPage' },
      { 'title': 'JBAC వింగ్స్ సమాచారం', 'image': 'assets/icon/svg/project-manager.svg', 'page': 'WingPage' },
      { 'title': 'మమ్మల్ని సంప్రదించండి', 'image': 'assets/icon/svg/contact-us.svg', 'page': 'ContactPage' },
    ];\n\n    `;

  c = c.substring(0, startIdx) + replacement + c.substring(endIdx);
  fs.writeFileSync(p, c, 'utf8');
  console.log('[OK] Successfully updated app.component.ts with FamilyCouncellingPage at top');
} else {
  console.log('[WARN] Indices not found:', startIdx, endIdx);
}
