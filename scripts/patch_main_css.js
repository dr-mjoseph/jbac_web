const fs = require('fs');

const cssSnippet = `
/* DOCTOR REGISTER FORM STYLES */
page-doctorregister .pagecss { background-color: #f1f5f9; }
page-doctorregister .form-card { background: #ffffff; border-radius: 12px; padding: 16px; margin: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
page-doctorregister .header-box { text-align: center; padding: 16px 12px 10px 12px; background: linear-gradient(135deg, #00548F, #00365c); color: white; border-radius: 12px; margin-bottom: 16px; }
page-doctorregister .custom-item { background: transparent !important; border: none !important; padding: 0 !important; margin-bottom: 14px !important; }
page-doctorregister .custom-item .item-inner { border-bottom: none !important; box-shadow: none !important; padding: 0 !important; }
page-doctorregister .custom-item ion-label,
page-doctorregister .custom-item .label-md,
page-doctorregister .custom-item .label-ios {
  font-size: 13.5px !important;
  font-weight: 600 !important;
  color: #1e293b !important;
  margin-bottom: 6px !important;
  white-space: normal !important;
}
page-doctorregister .custom-item .req { color: #ef4444 !important; font-weight: bold; margin-left: 2px; }
page-doctorregister .custom-item ion-input,
page-doctorregister .custom-item ion-select,
page-doctorregister .custom-item ion-textarea {
  background: #ffffff !important;
  border: 1.5px solid #cbd5e1 !important;
  border-radius: 8px !important;
  padding: 8px 12px !important;
  font-size: 14px !important;
  color: #0f172a !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
page-doctorregister .custom-item ion-input:focus-within,
page-doctorregister .custom-item ion-select:focus-within,
page-doctorregister .custom-item ion-textarea:focus-within {
  border-color: #00548F !important;
  box-shadow: 0 0 0 3px rgba(0,84,143,0.15) !important;
}
`;

for (const p of [
  'C:/Users/rajes/StudioProjects/jbac_app/www/build/main.css',
  'C:/Users/rajes/StudioProjects/jbac_app/platforms/android/app/src/main/assets/www/build/main.css'
]) {
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    // Remove old page-doctorregister rules if any
    const pStart = content.indexOf('page-doctorregister .pagecss');
    if (pStart !== -1) {
      const pEnd = content.indexOf('/* JBAC Side Panel', pStart);
      if (pEnd !== -1) {
        content = content.substring(0, pStart) + cssSnippet + '\n' + content.substring(pEnd);
      } else {
        content = content + cssSnippet;
      }
    } else {
      content = content + cssSnippet;
    }
    fs.writeFileSync(p, content, 'utf8');
    console.log('[OK] Updated CSS in', p);
  }
}
