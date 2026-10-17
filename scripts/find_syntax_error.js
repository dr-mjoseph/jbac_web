const fs = require('fs');
const c = fs.readFileSync('C:/Users/rajes/StudioProjects/jbac_app/www/build/0.js', 'utf8');

// Use babylon or node vm or esprima or check via eval to find line
const vm = require('vm');
try {
  new vm.Script(c);
  console.log('Script is valid!');
} catch (e) {
  console.error('Syntax error details:', e.message);
  console.error('Stack:', e.stack);
}
