const fs = require('fs');
const tsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\family-councelling\\family-councelling.ts';
let content = fs.readFileSync(tsPath, 'utf8');

const target = `  openBookingForm(doc: any) {
    this.selectedDoctor = doc;
    this.bookingData.doc_id = doc.id;
    this.clearUserVoiceRecording();
    this.viewMode = 'book_now';
  }`;

const replacement = `  openBookingForm(doc: any) {
    if (!this.isLoggedIn) {
      const alert = this.alertCtrl.create({
        mode: 'ios',
        title: 'లాగిన్ అవసరం (Login Required)',
        message: 'డాక్టర్ అపాయింట్‌మెంట్ బుక్ చేయడానికి ముందుగా దయచేసి లాగిన్ అవ్వండి.\\n(Please login first to book an appointment.)',
        buttons: [
          {
            text: 'రద్దు (Cancel)',
            role: 'cancel'
          },
          {
            text: 'రిజిస్టర్ (Register)',
            handler: () => {
              this.gotoUserRegister();
            }
          },
          {
            text: 'లాగిన్ (Login)',
            handler: () => {
              this.goToLogin();
            }
          }
        ]
      });
      alert.present();
      return;
    }
    this.selectedDoctor = doc;
    this.bookingData.doc_id = doc.id;
    this.clearUserVoiceRecording();
    this.viewMode = 'book_now';
  }`;

content = content.replace(target, replacement);
fs.writeFileSync(tsPath, content, 'utf8');
console.log('Successfully updated openBookingForm in family-councelling.ts');
