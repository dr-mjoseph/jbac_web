const sharp = require('C:/Users/rajes/AppData/Local/OpenAI/Codex/runtimes/cua_node/cfb32733c877621e/bin/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.resolve(__dirname, '../src/assets/images');
const backupDir = path.resolve(__dirname, '../src/assets/images/backup_banners');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

async function optimizeAll() {
    console.log('Optimizing banner images in', imgDir);
    for (let i = 1; i <= 8; i++) {
        const name = 'Banner' + String(i).padStart(2, '0') + '.png';
        const srcPath = path.join(imgDir, name);
        const backupPath = path.join(backupDir, name);
        if (!fs.existsSync(srcPath)) {
            console.log('Missing:', srcPath);
            continue;
        }

        const origSize = fs.statSync(srcPath).size;
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(srcPath, backupPath);
        }

        // Optimize PNG to crisp, high quality compressed PNG
        const optimizedPngBuffer = await sharp(backupPath)
            .png({ quality: 85, compressionLevel: 9, effort: 7 })
            .toBuffer();

        // Also generate WebP
        const webpName = 'Banner' + String(i).padStart(2, '0') + '.webp';
        const webpPath = path.join(imgDir, webpName);
        await sharp(backupPath)
            .webp({ quality: 85, effort: 6 })
            .toFile(webpPath);

        fs.writeFileSync(srcPath, optimizedPngBuffer);
        const newSize = fs.statSync(srcPath).size;
        const webpSize = fs.statSync(webpPath).size;
        const pct = Math.round((1 - newSize / origSize) * 100);
        console.log(`${name}: ${(origSize / 1024 / 1024).toFixed(2)} MB -> PNG: ${(newSize / 1024).toFixed(0)} KB (${pct}% smaller) | WebP: ${(webpSize / 1024).toFixed(0)} KB`);
    }
}

optimizeAll().catch(console.error);
