const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
const mainJs = path.join(mobilePath, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'www', 'build', 'main.js');

if (fs.existsSync(mainJs)) {
  const content = fs.readFileSync(mainJs, 'utf8');
  const idx = content.indexOf('MyApp =');
  if (idx !== -1) {
    console.log('Found MyApp in main.js:');
    console.log(content.substring(idx, idx + 1200));
  } else {
    // Search for pages = [
    const idx2 = content.indexOf('.pages = [');
    if (idx2 !== -1) {
      console.log('Found .pages = [ in main.js:');
      console.log(content.substring(idx2 - 50, idx2 + 1000));
    } else {
      console.log('Neither MyApp nor .pages = [ found directly');
      // search for 'HelpinghandsPage' in quotes:
      const matches = [...content.matchAll(/page:\s*['"]HelpinghandsPage['"]/g)];
      console.log('Matches for page: HelpinghandsPage:', matches.length);
      for (const m of matches) {
        console.log(content.substring(m.index - 100, m.index + 200));
      }
    }
  }
}
