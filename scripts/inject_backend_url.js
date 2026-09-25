const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const urlFile = path.join(rootDir, 'backend_url.txt');

let targetUrl = (process.env.TARGET_BACKEND_URL || process.env.API_GATEWAY_URL || process.env.FUNCTION_URL || '').trim();

if (!targetUrl && fs.existsSync(urlFile)) {
  targetUrl = fs.readFileSync(urlFile, 'utf8').trim();
}

console.log('Detected Backend Target URL:', targetUrl);

if (!targetUrl) {
  console.log('[WARN] No target URL found in process.env or backend_url.txt');
  process.exit(0);
}

const apiEndpoint = targetUrl.endsWith('/') ? targetUrl + 'dashboardapi/' : targetUrl + '/dashboardapi/';
const fallbackEndpoint = (process.env.FALLBACK_URL || process.env.API_GATEWAY_URL || '')
  ? ((process.env.FALLBACK_URL || process.env.API_GATEWAY_URL).endsWith('/') ? (process.env.FALLBACK_URL || process.env.API_GATEWAY_URL) + 'dashboardapi/' : (process.env.FALLBACK_URL || process.env.API_GATEWAY_URL) + '/dashboardapi/')
  : apiEndpoint;

const envFiles = [
  path.join(rootDir, 'src', 'environments', 'environment.prod.ts'),
  path.join(rootDir, 'src', 'environments', 'environment.ts')
];

for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    let content = fs.readFileSync(envFile, 'utf8');
    content = content.replace(/apiUrl:\s*['"][^'"]+['"]/g, `apiUrl: '${apiEndpoint}'`);
    content = content.replace(/fallbackApiUrl:\s*['"][^'"]+['"]/g, `fallbackApiUrl: '${fallbackEndpoint}'`);
    fs.writeFileSync(envFile, content, 'utf8');
    console.log('[SUCCESS] Injected live AWS apiUrl into:', envFile);
  }
}
