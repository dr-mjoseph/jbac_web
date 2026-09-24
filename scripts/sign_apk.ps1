$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH

$zipalign = "C:\Users\rajes\StudioProjects\jbac_app\zipalign.exe"
$apksigner = "C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\apksigner.bat"
$keystore = "C:\Users\rajes\StudioProjects\jbac_app\Jbac.keystore"
$unsignedApk = "C:\Users\rajes\Downloads\app-release-unsigned.apk"
$alignedApk = "C:\Users\rajes\Downloads\app-release-aligned.apk"
$signedApk = "C:\Users\rajes\Downloads\app-release.apk"

if (Test-Path $alignedApk) { Remove-Item $alignedApk -Force }
if (Test-Path $signedApk) { Remove-Item $signedApk -Force }

Write-Output "Aligning APK with zipalign..."
& $zipalign -f -p 4 $unsignedApk $alignedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "zipalign failed with exit code $LASTEXITCODE"
    exit 1
}

Write-Output "Signing APK with Jbac.keystore..."
& $apksigner sign --ks $keystore --ks-pass "pass:123456" --ks-key-alias "jbac" --key-pass "pass:123456" --out $signedApk $alignedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "apksigner failed with exit code $LASTEXITCODE"
    exit 1
}

Write-Output "Verifying signed APK..."
& $apksigner verify --verbose $signedApk

$apkInfo = Get-Item $signedApk
Write-Output "SUCCESS! Signed APK created:"
Write-Output "File: $($apkInfo.FullName)"
Write-Output "Size: $($apkInfo.Length) bytes"
