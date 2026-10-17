const fs = require('fs');

const homeTsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\home\\home.ts';
let content = fs.readFileSync(homeTsPath, 'utf8');

// Replace banners definition
const oldBannersPattern = /banners\s*=\s*\[[\s\S]*?\];/;
const newBanners = `banners = [
    { id: '1', banner: 'assets/images/Banner01.png' },
    { id: '2', banner: 'assets/images/Banner02.png' },
    { id: '3', banner: 'assets/images/Banner03.png' },
    { id: '4', banner: 'assets/images/Banner04.png' },
    { id: '5', banner: 'assets/images/Banner05.png' },
    { id: '6', banner: 'assets/images/Banner06.png' },
    { id: '7', banner: 'assets/images/Banner07.png' },
    { id: '8', banner: 'assets/images/Banner08.png' }
  ];`;

if (oldBannersPattern.test(content)) {
    content = content.replace(oldBannersPattern, newBanners);
    fs.writeFileSync(homeTsPath, content, 'utf8');
    console.log('Successfully updated banners in home.ts to local assets');
} else {
    console.log('Could not find banners array pattern in home.ts');
}
