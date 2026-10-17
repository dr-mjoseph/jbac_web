const fs = require('fs');

const configXml = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\config.xml';
const manifestXml = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\platforms\\android\\app\\src\\main\\AndroidManifest.xml';
const gradleProps = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\platforms\\android\\project.properties';
const appGradle = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\platforms\\android\\app\\build.gradle';
const cdvConfig = 'C:\\Users\\rajes\\StudioProjects\\jbac_app\\platforms\\android\\cdv-gradle-config.json';

[configXml, manifestXml, gradleProps, appGradle, cdvConfig].forEach(f => {
    if (fs.existsSync(f)) {
        console.log(`\n=== ${f} ===`);
        const content = fs.readFileSync(f, 'utf8');
        content.split('\n').forEach(line => {
            if (line.includes('version') || line.includes('targetSdk') || line.includes('compileSdk') || line.includes('target=') || line.includes('SDK_VERSION')) {
                console.log('  ', line.trim());
            }
        });
    } else {
        console.log('Not found:', f);
    }
});
