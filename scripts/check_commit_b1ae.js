const { execSync } = require('child_process');

try {
  const diff = execSync('git show --stat b1ae0dd', { cwd: 'C:\\Users\\rajes\\StudioProjects\\jbac_app', encoding: 'utf8' });
  console.log(diff);
} catch (e) {
  console.error(e.message);
}
