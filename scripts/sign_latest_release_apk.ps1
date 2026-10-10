$ErrorActionPreference = "Stop"

$env:JAVA_HOME = "C:\Users\rajes\.jdks\jbr_dcevm-11.0.16"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH

$zipalign = "C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\zipalign.exe"
$apksigner = "C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\apksigner.bat"
$keystore = "C:\Users\rajes\StudioProjects\jbac_app\Jbac.keystore"

$srcApk = "C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\build\outputs\apk\debug\jbacApp-0.0.24.apk"
$workDir = "C:\Users\rajes\StudioProjects\jbac_app\build_temp"
if (-not (Test-Path $workDir)) { New-Item -ItemType Directory -Path $workDir | Out-Null }

$unsignedApk = "$workDir\app-unsigned.apk"
$alignedApk = "$workDir\app-aligned.apk"
$finalApk = "C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.24.apk"

Write-Host "Copying source APK to temporary workspace..."
Copy-Item $srcApk $unsignedApk -Force

Write-Host "Removing debug signature entries from APK..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$zip = [System.IO.Compression.ZipFile]::Open($unsignedApk, 'Update')
$toRemove = @()
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -like "META-INF/*.SF" -or $entry.FullName -like "META-INF/*.RSA" -or $entry.FullName -like "META-INF/*.DSA" -or $entry.FullName -like "META-INF/*.MF") {
        $toRemove += $entry
    }
}
foreach ($entry in $toRemove) {
    Write-Host "  Removing $($entry.FullName)"
    $entry.Delete()
}
$zip.Dispose()

if (Test-Path $alignedApk) { Remove-Item $alignedApk -Force }
if (Test-Path $finalApk) { Remove-Item $finalApk -Force }

Write-Host "`nAligning APK with zipalign..."
& $zipalign -f -p 4 $unsignedApk $alignedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "zipalign failed with exit code $LASTEXITCODE"
    exit 1
}

Write-Host "`nSigning APK with official Jbac.keystore..."
& $apksigner sign --ks $keystore --ks-pass "pass:123456" --ks-key-alias "jbac" --key-pass "pass:123456" --v1-signing-enabled true --v2-signing-enabled true --out $finalApk $alignedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "apksigner failed with exit code $LASTEXITCODE"
    exit 1
}

Write-Host "`nVerifying finalized signed APK..."
& $apksigner verify --verbose --print-certs $finalApk

$apkInfo = Get-Item $finalApk
Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " SUCCESS! Official Signed Release APK Ready:" -ForegroundColor Green
Write-Host " File: $($apkInfo.FullName)" -ForegroundColor Green
Write-Host " Size: $([math]::Round($apkInfo.Length / 1MB, 2)) MB ($($apkInfo.Length) bytes)" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
