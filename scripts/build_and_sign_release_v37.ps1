$ErrorActionPreference = "Stop"

$javaHome = "C:\Users\rajes\jdk-17.0.10+7"
$androidSdk = "C:\Users\rajes\AppData\Local\Android\Sdk"
$buildTools = "$androidSdk\build-tools\30.0.3"
$appRoot = "C:\Users\rajes\StudioProjects\jbac_app"
$androidDir = "$appRoot\platforms\android"
$keystore = "$appRoot\Jbac.keystore"
$keystorePass = "123456"
$keyAlias = "jbac"

$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $androidSdk
$env:ANDROID_SDK_ROOT = $androidSdk
$env:PATH = "$javaHome\bin;$buildTools;$env:PATH"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Building & Signing Android Release v0.0.37 (API 36)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Java Home   : $env:JAVA_HOME"
Write-Host "Android SDK : $env:ANDROID_HOME"
Write-Host "Build Tools : $buildTools"
Write-Host "Android Dir : $androidDir"

Set-Location -Path $androidDir

# Step 1: Run Gradle build
Write-Host "`n[1/5] Executing Gradle assembleRelease and bundleRelease..." -ForegroundColor Yellow
& .\gradlew.bat clean assembleRelease bundleRelease "-PcdvBuildToolsVersion=30.0.3" --stacktrace

if ($LASTEXITCODE -ne 0) {
    Write-Error "Gradle build failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

# Step 2: Locate outputs
Write-Host "`n[2/5] Locating raw Gradle outputs..." -ForegroundColor Yellow
$apkDir = "$androidDir\app\build\outputs\apk\release"
$bundleDir = "$androidDir\app\build\outputs\bundle\release"

$rawApk = Get-ChildItem -Path $apkDir -Filter "*.apk" | Select-Object -First 1
$rawAab = Get-ChildItem -Path $bundleDir -Filter "*.aab" | Select-Object -First 1

if (-not $rawApk) {
    Write-Error "No release APK generated in $apkDir"
    exit 1
}
if (-not $rawAab) {
    Write-Error "No release AAB generated in $bundleDir"
    exit 1
}

Write-Host "Raw APK: $($rawApk.FullName) ($([math]::Round($rawApk.Length / 1MB, 2)) MB)"
Write-Host "Raw AAB: $($rawAab.FullName) ($([math]::Round($rawAab.Length / 1MB, 2)) MB)"

# Step 3: Zipalign & Sign Release APK
Write-Host "`n[3/5] Zipaligning and signing Release APK..." -ForegroundColor Yellow
$zipalign = "$buildTools\zipalign.exe"
$apksigner = "$buildTools\apksigner.bat"
$jarsigner = "$javaHome\bin\jarsigner.exe"
$aapt = "$buildTools\aapt.exe"

$alignedApk = "$androidDir\app\build\outputs\apk\release\app-release-aligned.apk"
$signedApk = "$appRoot\jbacApp-0.0.37.apk"

if (Test-Path $alignedApk) { Remove-Item $alignedApk -Force }
if (Test-Path $signedApk) { Remove-Item $signedApk -Force }

# Remove existing signatures if any
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($rawApk.FullName, 'Update')
$toRemove = @()
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -like "META-INF/*.SF" -or $entry.FullName -like "META-INF/*.RSA" -or $entry.FullName -like "META-INF/*.DSA" -or $entry.FullName -like "META-INF/*.MF") {
        $toRemove += $entry
    }
}
foreach ($entry in $toRemove) {
    $entry.Delete()
}
$zip.Dispose()

& $zipalign -f -p 4 $rawApk.FullName $alignedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "zipalign failed with exit code $LASTEXITCODE"
    exit 1
}

& $apksigner sign --ks $keystore --ks-pass "pass:$keystorePass" --ks-key-alias $keyAlias --key-pass "pass:$keystorePass" --v1-signing-enabled true --v2-signing-enabled true --out $signedApk $alignedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "apksigner failed with exit code $LASTEXITCODE"
    exit 1
}

Write-Host "Verifying Signed APK..."
& $apksigner verify --verbose --print-certs $signedApk

# Step 4: Sign Release AAB (Android App Bundle)
Write-Host "`n[4/5] Signing Release AAB with jarsigner..." -ForegroundColor Yellow
$signedAab = "$appRoot\jbacApp-0.0.37.aab"
Copy-Item $rawAab.FullName $signedAab -Force

# Sign AAB using jarsigner
& $jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore $keystore -storepass $keystorePass -keypass $keystorePass $signedAab $keyAlias
if ($LASTEXITCODE -ne 0) {
    Write-Error "jarsigner failed for AAB with exit code $LASTEXITCODE"
    exit 1
}

# Verify AAB signature
& $jarsigner -verify -verbose -certs $signedAab | Select-Object -Last 10

# Copy signed AAB to standard bundle locations for convenience
Copy-Item $signedAab "$appRoot\app-release.aab" -Force
Copy-Item $signedAab "$appRoot\appreleasesigned.aab" -Force

# Step 5: Verify APK Badging (targetSdkVersion, versionCode, versionName)
Write-Host "`n[5/5] Inspecting APK badging with aapt..." -ForegroundColor Yellow
$badging = & $aapt dump badging $signedApk
$badging | Select-String -Pattern "package:|sdkVersion:|targetSdkVersion:" | ForEach-Object { Write-Host "  $_" -ForegroundColor Green }

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " BUILD & SIGNING COMPLETE FOR GOOGLE PLAY SUBMISSION!" -ForegroundColor Green
Write-Host " Signed APK : $signedApk ($([math]::Round((Get-Item $signedApk).Length / 1MB, 2)) MB)" -ForegroundColor Green
Write-Host " Signed AAB : $signedAab ($([math]::Round((Get-Item $signedAab).Length / 1MB, 2)) MB)" -ForegroundColor Green
Write-Host " Standard Upload Bundle: $appRoot\appreleasesigned.aab" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
