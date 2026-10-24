param(
    [switch]$SkipGradle
)

$ErrorActionPreference = "Stop"

$version = "0.0.44"
$versionCode = "44"
$targetSdk = "36"

$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-8.0.504.1-hotspot"
$androidSdk = "C:\Users\rajes\AppData\Local\Android\Sdk"
$buildTools = "$androidSdk\build-tools\30.0.3"
$appRoot = "C:\Users\rajes\StudioProjects\jbac_app"
$androidDir = "$appRoot\platforms\android"
$keystore = "$appRoot\Jbac.keystore"
$keystorePass = "123456"
$keyAlias = "jbac"
$gradleBat = "C:\Users\rajes\.gradle\wrapper\dists\gradle-4.10.3-all\81msde2dx9p4vji0mjgtvxkcb\gradle-4.10.3\bin\gradle.bat"

$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $androidSdk
$env:ANDROID_SDK_ROOT = $androidSdk
$env:PATH = "$javaHome\bin;$buildTools;$env:PATH"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Building & Signing Android Release v$version (versionCode $versionCode, targetSdk $targetSdk)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Java Home   : $env:JAVA_HOME"
Write-Host "Android SDK : $env:ANDROID_HOME"
Write-Host "Build Tools : $buildTools"
Write-Host "Android Dir : $androidDir"
Write-Host "Gradle Bat  : $gradleBat"

# Step 0: Sync compiled web assets from www to platforms/android
if (-not $SkipGradle) {
    Write-Host "`n[0/5] Syncing web assets from www to platforms/android..." -ForegroundColor Yellow
    $src = "$appRoot\www"
    $dst = "$androidDir\app\src\main\assets\www"

    if (Test-Path $src) {
        Copy-Item -Path "$src\*" -Destination $dst -Recurse -Force
        Write-Host "  Synced assets from $src to $dst" -ForegroundColor Green
    }
}

# Step 1: Clean build outputs if requested
if (-not $SkipGradle) {
    Write-Host "`n[1/5] Compiling Release APK and AAB with Gradle..." -ForegroundColor Yellow
    $apkReleaseDir = "$androidDir\app\build\outputs\apk\release"
    $bundleReleaseDir = "$androidDir\app\build\outputs\bundle\release"

    if (Test-Path $apkReleaseDir) {
        Remove-Item "$apkReleaseDir\*" -Force -Recurse -ErrorAction SilentlyContinue
    }
    if (Test-Path $bundleReleaseDir) {
        Remove-Item "$bundleReleaseDir\*" -Force -Recurse -ErrorAction SilentlyContinue
    }

    $gradleArgs = @(
        "-p", $androidDir,
        "assembleRelease",
        "bundleRelease",
        "-PcdvVersionCode=$versionCode",
        "-PcdvTargetSdkVersion=$targetSdk",
        "--stacktrace"
    )

    & $gradleBat @gradleArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Gradle build failed with exit code $LASTEXITCODE"
        exit 1
    }
    Write-Host "  Gradle compilation successful!" -ForegroundColor Green
}

# Step 2: Locate raw outputs
Write-Host "`n[2/5] Locating raw build artifacts..." -ForegroundColor Yellow
$apkDir = "$androidDir\app\build\outputs\apk\release"
$bundleDir = "$androidDir\app\build\outputs\bundle\release"

$rawApk = Get-ChildItem -Path $apkDir -Filter "*.apk" | Where-Object { $_.Name -notlike "*aligned*" } | Select-Object -First 1
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

# Step 3: Sign with jarsigner (v1), Zipalign, and Sign with apksigner (v1 + v2 + v3)
Write-Host "`n[3/5] Signing with jarsigner (v1), zipaligning, and signing with apksigner (v1+v2+v3)..." -ForegroundColor Yellow
$zipalign = "$buildTools\zipalign.exe"
$apksigner = "$buildTools\apksigner.bat"
$jarsigner = "$javaHome\bin\jarsigner.exe"
$aapt = "$buildTools\aapt.exe"

$alignedApk = "$androidDir\app\build\outputs\apk\release\app-release-aligned-v$versionCode.apk"
$signedApk = "$appRoot\jbacApp-$version.apk"

if (Test-Path $alignedApk) { Remove-Item $alignedApk -Force }
if (Test-Path $signedApk) { Remove-Item $signedApk -Force }

# 1. Sign raw APK with jarsigner (v1 JAR signature scheme)
& $jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore $keystore -storepass $keystorePass -keypass $keystorePass $rawApk.FullName $keyAlias
if ($LASTEXITCODE -ne 0) {
    Write-Error "jarsigner failed with exit code $LASTEXITCODE"
    exit 1
}

# 2. Zipalign the signed APK
& $zipalign -f -p 4 $rawApk.FullName $alignedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "zipalign failed with exit code $LASTEXITCODE"
    exit 1
}

# 3. Sign aligned APK with apksigner (enforcing v1 + v2 + v3 APK Signature Schemes)
& $apksigner sign --ks $keystore --ks-pass "pass:$keystorePass" --ks-key-alias $keyAlias --key-pass "pass:$keystorePass" --min-sdk-version 23 --max-sdk-version 36 --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --out $signedApk $alignedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "apksigner failed with exit code $LASTEXITCODE"
    exit 1
}

Write-Host "Verifying Signed APK..."
& $apksigner verify --verbose --print-certs $signedApk

# Step 4: Sign Release AAB (Android App Bundle)
Write-Host "`n[4/5] Signing Release AAB with jarsigner..." -ForegroundColor Yellow
$signedAab = "$appRoot\jbacApp-$version.aab"
Copy-Item $rawAab.FullName $signedAab -Force

# Sign AAB using jarsigner
& $jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore $keystore -storepass $keystorePass -keypass $keystorePass $signedAab $keyAlias
if ($LASTEXITCODE -ne 0) {
    Write-Error "jarsigner failed for AAB with exit code $LASTEXITCODE"
    exit 1
}

# Also update the canonical appreleasesigned.aab in jbac_app root
Copy-Item $signedAab "$appRoot\appreleasesigned.aab" -Force
Write-Host "  Copied signed AAB to $appRoot\appreleasesigned.aab"

# Step 5: Final Validation & Badging Dump
Write-Host "`n[5/5] Final Badging and Package Inspection..." -ForegroundColor Yellow
& $aapt dump badging $signedApk | Select-String -Pattern "package: name|sdkVersion|targetSdkVersion"
& $jarsigner -verify $signedAab

Write-Host "`n====================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Release v$version build completed." -ForegroundColor Green
Write-Host "  Signed APK : $signedApk ($([math]::Round((Get-Item $signedApk).Length / 1MB, 2)) MB)" -ForegroundColor Green
Write-Host "  Signed AAB : $signedAab ($([math]::Round((Get-Item $signedAab).Length / 1MB, 2)) MB)" -ForegroundColor Green
Write-Host "  Play Store : $appRoot\appreleasesigned.aab" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
