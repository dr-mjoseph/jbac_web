Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = (Resolve-Path "backend/backend-deploy.zip").Path
$serverJsPath = (Resolve-Path "backend/server.js").Path
$pkgJsonPath = (Resolve-Path "backend/package.json").Path

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Update')

$oldServer = $zip.GetEntry('server.js')
if ($null -ne $oldServer) { $oldServer.Delete() }
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $serverJsPath, 'server.js')

$oldPkg = $zip.GetEntry('package.json')
if ($null -ne $oldPkg) { $oldPkg.Delete() }
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $pkgJsonPath, 'package.json')

$zip.Dispose()
Write-Output "Successfully updated server.js and package.json inside backend/backend-deploy.zip"
