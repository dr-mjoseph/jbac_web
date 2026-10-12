const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/rajes/StudioProjects/jbac_app/www/build/';

for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.js'))) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const tMatch = content.match(/ionic_angular__["']\["([^"]+)"\s*\/\*\s*ToastController/);
  if (tMatch) console.log(f, 'ToastController key:', tMatch[1]);

  const lMatch = content.match(/ionic_angular__["']\["([^"]+)"\s*\/\*\s*LoadingController/);
  if (lMatch) console.log(f, 'LoadingController key:', lMatch[1]);

  const aMatch = content.match(/ionic_angular__["']\["([^"]+)"\s*\/\*\s*AlertController/);
  if (aMatch) console.log(f, 'AlertController key:', aMatch[1]);

  const nMatch = content.match(/ionic_angular__["']\["([^"]+)"\s*\/\*\s*NavController/);
  if (nMatch) console.log(f, 'NavController key:', nMatch[1]);
}
