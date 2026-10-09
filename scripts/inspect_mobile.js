const fs = require('fs');
const path = require('path');

const mobilePath = 'C:\\Users\\rajes\\StudioProjects\\jbac_app';
console.log('Inspecting Mobile App at:', mobilePath);

if (!fs.existsSync(mobilePath)) {
  console.error('Mobile path does not exist!');
  process.exit(1);
}

// 1. Check src/pages/forms2/
const forms2Html = path.join(mobilePath, 'src', 'pages', 'forms2', 'forms2.html');
const forms2Ts = path.join(mobilePath, 'src', 'pages', 'forms2', 'forms2.ts');
if (fs.existsSync(forms2Html)) {
  console.log('\n--- forms2.html ---');
  console.log(fs.readFileSync(forms2Html, 'utf8'));
}
if (fs.existsSync(forms2Ts)) {
  console.log('\n--- forms2.ts ---');
  console.log(fs.readFileSync(forms2Ts, 'utf8'));
}

// 2. Check src/pages/home/home.html & home.ts
const homeHtml = path.join(mobilePath, 'src', 'pages', 'home', 'home.html');
const homeTs = path.join(mobilePath, 'src', 'pages', 'home', 'home.ts');
if (fs.existsSync(homeHtml)) {
  console.log('\n--- home.html (First 100 lines) ---');
  const lines = fs.readFileSync(homeHtml, 'utf8').split('\n');
  console.log(lines.slice(0, 100).join('\n'));
}
if (fs.existsSync(homeTs)) {
  console.log('\n--- home.ts ---');
  const lines = fs.readFileSync(homeTs, 'utf8').split('\n');
  console.log(lines.slice(0, 120).join('\n'));
}

// 3. Check src/providers/service/service.ts snippet
const serviceTs = path.join(mobilePath, 'src', 'providers', 'service', 'service.ts');
if (fs.existsSync(serviceTs)) {
  console.log('\n--- service.ts sample methods ---');
  const content = fs.readFileSync(serviceTs, 'utf8');
  console.log('Length:', content.length);
  const getJobsMatch = content.match(/getjobs[\s\S]{1,250}/);
  if (getJobsMatch) console.log(getJobsMatch[0]);
}

// 4. List existing pages in src/pages
const pagesDir = path.join(mobilePath, 'src', 'pages');
if (fs.existsSync(pagesDir)) {
  console.log('\n--- src/pages directories ---');
  console.log(fs.readdirSync(pagesDir).join(', '));
}
