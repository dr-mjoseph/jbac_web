const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Update zip using PowerShell ZipFile
const psScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = (Resolve-Path "backend/backend-deploy.zip").Path
$serverJsPath = (Resolve-Path "backend/server.js").Path
$publicHtmlPath = (Resolve-Path "backend/public.html").Path
$pkgJsonPath = (Resolve-Path "backend/package.json").Path

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Update')

$oldServer = $zip.GetEntry('server.js')
if ($null -ne $oldServer) { $oldServer.Delete() }
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $serverJsPath, 'server.js')

$oldHtml = $zip.GetEntry('public.html')
if ($null -ne $oldHtml) { $oldHtml.Delete() }
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $publicHtmlPath, 'public.html')

$oldAdminHtml = $zip.GetEntry('admin_db.html')
if ($null -ne $oldAdminHtml) { $oldAdminHtml.Delete() }
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $publicHtmlPath, 'admin_db.html')

$oldPkg = $zip.GetEntry('package.json')
if ($null -ne $oldPkg) { $oldPkg.Delete() }
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $pkgJsonPath, 'package.json')

$zip.Dispose()
Write-Output "Successfully updated backend-deploy.zip with server.js, public.html, admin_db.html, package.json"
`;

fs.writeFileSync('scripts/_temp_zip.ps1', psScript, 'utf8');

try {
  console.log('Updating backend-deploy.zip...');
  const zipOut = execSync('powershell -ExecutionPolicy Bypass -File scripts/_temp_zip.ps1', { encoding: 'utf8' });
  console.log(zipOut);
} catch (e) {
  console.error('Error updating zip:', e.message);
} finally {
  try { fs.unlinkSync('scripts/_temp_zip.ps1'); } catch (_) {}
}

// 2. Deploy to AWS Lambda
try {
  console.log('Deploying updated zip to AWS Lambda jbac-backend-api...');
  const awsCmd = 'aws lambda update-function-code --function-name jbac-backend-api --zip-file fileb://backend/backend-deploy.zip --region ap-southeast-2';
  const lambdaOut = execSync(awsCmd, { encoding: 'utf8' });
  const parsed = JSON.parse(lambdaOut);
  console.log('Lambda Update Success! FunctionArn:', parsed.FunctionArn, 'LastModified:', parsed.LastModified);
} catch (err) {
  console.error('Lambda deployment error (checking aws cli):', err.message);
}
