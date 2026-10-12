const https = require('https');
const querystring = require('querystring');

function cpanelRequest(path, postData = null, cookie = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '68.178.175.219',
            port: 2083,
            path: path,
            method: postData ? 'POST' : 'GET',
            rejectUnauthorized: false,
            headers: {}
        };
        if (cookie) options.headers['Cookie'] = cookie;
        if (postData) {
            options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { rejectUnauthorized: false }, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
        }).on('error', reject);
    });
}

async function main() {
    const postData = querystring.stringify({ user: 'jbac', pass: 'Hundredfoldreturn7&' });
    const loginRes = await cpanelRequest('/login/?login_only=1', postData);
    const loginJson = JSON.parse(loginRes.body);
    const secToken = loginJson.security_token;
    const cookies = loginRes.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');

    const newHtaccess = `DirectoryIndex index.html

<IfModule mod_rewrite.c>
    RewriteEngine on

    # 1. Force HTTPS
    RewriteCond %{HTTPS} !on
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

    # 2. Allow Let's Encrypt / AutoSSL verification
    RewriteCond %{REQUEST_URI} ^/\\.well-known/ [NC]
    RewriteRule ^ - [L]

    # 3. Preserve local uploaded media folders if files exist on cPanel
    RewriteCond %{REQUEST_URI} ^/(websiteimages|baneers|appimages|wishimages)/ [NC]
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # 4. Proxy root & index.php directly to index.html with HTTP 200
    RewriteRule ^$ http://jbac-web-production-298363284024.s3-website-ap-southeast-2.amazonaws.com/index.html [P,L]
    RewriteRule ^index\\.php$ http://jbac-web-production-298363284024.s3-website-ap-southeast-2.amazonaws.com/index.html [P,L]

    # 5. Angular HTML5 Client-side Routes (no file extension) -> Proxy directly to index.html with HTTP 200
    RewriteCond %{REQUEST_URI} !\\.[a-zA-Z0-9]+$
    RewriteRule ^(.*)$ http://jbac-web-production-298363284024.s3-website-ap-southeast-2.amazonaws.com/index.html [P,L]

    # 6. Static Assets (with file extensions like .js, .css, .png, .svg) -> Proxy to S3 object path
    RewriteRule ^(.*)$ http://jbac-web-production-298363284024.s3-website-ap-southeast-2.amazonaws.com/$1 [P,L]
</IfModule>
`;

    const savePost = querystring.stringify({
        dir: 'public_html',
        file: '.htaccess',
        content: newHtaccess
    });
    await cpanelRequest(secToken + '/execute/Fileman/save_file_content', savePost, cookies);

    console.log('Testing routes with clean 200 SPA rewrite:');
    const routes = [
        '/',
        '/family-councelling',
        '/marriage',
        '/login',
        '/about',
        '/main.2e569cac733c9684.js',
        '/styles.186c8db44232dde1.css',
        '/favicon.ico'
    ];

    for (const r of routes) {
        const res = await httpsGet('https://jbac.in' + r);
        console.log(`Route https://jbac.in${r} -> Status: ${res.statusCode}, Length: ${res.body.length}`);
    }
}

main().catch(console.error);
