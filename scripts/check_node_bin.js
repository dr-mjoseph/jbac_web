const fs = require('fs');
const d = 'C:\\Users\\rajes\\AppData\\Local\\OpenAI\\Codex\\runtimes\\cua_node\\cfb32733c877621e\\bin';
if (fs.existsSync(d)) {
    console.log(fs.readdirSync(d));
} else {
    console.log('Not found:', d);
}
