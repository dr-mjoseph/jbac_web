const { execSync } = require('child_process');

try {
  const log = execSync('git log -n 5 --oneline', { cwd: 'C:\\Users\\rajes\\StudioProjects\\jbac_app', encoding: 'utf8' });
  console.log('git log in jbac_app:');
  console.log(log);
} catch (e) {
  console.error('git log error:', e.message);
}
