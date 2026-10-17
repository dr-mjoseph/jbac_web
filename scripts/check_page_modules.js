const fs = require('fs');
const dMod = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\doctorregister\\doctorregister.module.ts';
const eMod = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\entry-form\\entry-form.module.ts';
if (fs.existsSync(dMod)) console.log('dMod:', fs.readFileSync(dMod, 'utf8'));
if (fs.existsSync(eMod)) console.log('eMod:', fs.readFileSync(eMod, 'utf8'));
