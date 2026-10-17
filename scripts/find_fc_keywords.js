const fs = require('fs');
const path = require('path');
const m = 'C:/Users/rajes/StudioProjects/jbac_app';

const fcHtml = fs.readFileSync(path.join(m, 'src/pages/family-councelling/family-councelling.html'), 'utf8');
const fcTs = fs.readFileSync(path.join(m, 'src/pages/family-councelling/family-councelling.ts'), 'utf8');

// Find all segment buttons and headings with profile / booking / register
const lines = fcHtml.split('\n');
lines.forEach((l, i) => {
  if (l.includes('profile') || l.includes('booking') || l.includes('register') || l.includes('రిజిస్టర్') || l.includes('ప్రొఫైల్') || l.includes('బుకింగ్')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
