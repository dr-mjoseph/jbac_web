const fs = require('fs');

const homeTsPath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\src\\pages\\home\\home.ts';
let content = fs.readFileSync(homeTsPath, 'utf8');

const targetStr = `  banners = [
    { id: '1', banner: 'https://jbac.in/baneers/Banner01.png' },
   // { id: '2', banner: 'https://jbac.in/baneers/Banner02.png' },
    { id: '3', banner: 'https://jbac.in/baneers/Banner03.png' },
    { id: '4', banner: 'https://jbac.in/baneers/Banner04.png' },
    { id: '5', banner: 'https://jbac.in/baneers/Banner05.png' },
    { id: '6', banner: 'https://jbac.in/baneers/Banner06.png' },
    { id: '7', banner: 'https://jbac.in/baneers/Banner07.png' },
  ]`;

const newBannersStr = `  banners = [
    { id: '1', banner: 'assets/images/Banner01.png' },
    { id: '2', banner: 'assets/images/Banner02.png' },
    { id: '3', banner: 'assets/images/Banner03.png' },
    { id: '4', banner: 'assets/images/Banner04.png' },
    { id: '5', banner: 'assets/images/Banner05.png' },
    { id: '6', banner: 'assets/images/Banner06.png' },
    { id: '7', banner: 'assets/images/Banner07.png' },
    { id: '8', banner: 'assets/images/Banner08.png' }
  ]`;

if (content.includes("https://jbac.in/baneers/Banner01.png")) {
    const startIdx = content.indexOf("banners = [");
    const endIdx = content.indexOf("]", startIdx) + 1;
    content = content.slice(0, startIdx) + newBannersStr.trim() + content.slice(endIdx);
    fs.writeFileSync(homeTsPath, content, 'utf8');
    console.log('Successfully replaced banners with local assets in home.ts');
} else {
    console.log('Target string not found');
}
