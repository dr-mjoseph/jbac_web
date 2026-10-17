const fs = require('fs');
const path = require('path');

const webImgDir = 'c:\\Users\\rajes\\Documents\\jbac_web\\src\\assets\\images';
const mobileSrcDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\assets\\images';
const mobileWwwDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\www\\assets\\images';
const mobileAndroidDir = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\platforms\\android\\app\\src\\main\\assets\\www\\assets\\images';

[mobileSrcDir, mobileWwwDir, mobileAndroidDir].forEach(d => {
    if (!fs.existsSync(d)) {
        fs.mkdirSync(d, { recursive: true });
    }
});

for (let i = 1; i <= 8; i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    const pngName = `Banner${num}.png`;
    const webpName = `Banner${num}.webp`;

    [pngName, webpName].forEach(fileName => {
        const srcFile = path.join(webImgDir, fileName);
        if (fs.existsSync(srcFile)) {
            [mobileSrcDir, mobileWwwDir, mobileAndroidDir].forEach(destDir => {
                const destFile = path.join(destDir, fileName);
                fs.copyFileSync(srcFile, destFile);
            });
            console.log(`Copied ${fileName} to all 3 mobile asset directories`);
        } else {
            console.log(`Source not found: ${srcFile}`);
        }
    });
}
