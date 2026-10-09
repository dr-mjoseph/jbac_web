const fs = require('fs');

console.log('jdk exists:', fs.existsSync('C:\\Users\\rajes\\jdk-17.0.10+7'));
console.log('androidSdk exists:', fs.existsSync('C:\\Users\\rajes\\AppData\\Local\\Android\\Sdk'));
console.log('gradlew.bat exists:', fs.existsSync('C:\\Users\\rajes\\StudioProjects\\jbac_app\\platforms\\android\\gradlew.bat'));
