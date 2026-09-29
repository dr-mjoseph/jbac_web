$ErrorActionPreference = "Stop"

$javaHome = "C:\Users\rajes\jdk-17.0.10+7"
$androidSdk = "C:\Users\rajes\AppData\Local\Android\Sdk"
$buildTools = "$androidSdk\build-tools\30.0.3"
$appRoot = "C:\Users\rajes\StudioProjects\jbac_app"
$androidDir = "$appRoot\platforms\android"

$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $androidSdk
$env:ANDROID_SDK_ROOT = $androidSdk
$env:PATH = "$javaHome\bin;$buildTools;$env:PATH"

Write-Output "===================================================="
Write-Output "  Building Android Release APK and AAB"
Write-Output "===================================================="
Write-Output "Java Home   : $env:JAVA_HOME"
Write-Output "Android SDK : $env:ANDROID_HOME"
Write-Output "Working Dir : $androidDir"

Set-Location -Path $androidDir

Write-Output "`n[1/3] Executing Gradle assembleRelease and bundleRelease..."
& .\gradlew.bat assembleRelease bundleRelease "-PcdvBuildToolsVersion=30.0.3" --stacktrace

if ($LASTEXITCODE -ne 0) {
    Write-Error "Gradle build failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Output "`n[2/3] Checking build outputs..."
$apkDir = "$androidDir\app\build\outputs\apk\release"
$bundleDir = "$androidDir\app\build\outputs\bundle\release"

$apks = Get-ChildItem -Path $apkDir -Filter "*.apk" -ErrorAction SilentlyContinue
$aabs = Get-ChildItem -Path $bundleDir -Filter "*.aab" -ErrorAction SilentlyContinue

Write-Output "Generated APKs:"
$apks | ForEach-Object { Write-Output "  - $($_.FullName) ($([math]::Round($_.Length / 1MB, 2)) MB)" }

Write-Output "Generated AABs:"
$aabs | ForEach-Object { Write-Output "  - $($_.FullName) ($([math]::Round($_.Length / 1MB, 2)) MB)" }

Write-Output "`n[3/3] Copying finalized artifacts to jbac_app root..."
foreach ($apk in $apks) {
    Copy-Item $apk.FullName -Destination "$appRoot\$($apk.Name)" -Force
    Write-Output "Copied APK to $appRoot\$($apk.Name)"
}
foreach ($aab in $aabs) {
    Copy-Item $aab.FullName -Destination "$appRoot\app-release.aab" -Force
    Copy-Item $aab.FullName -Destination "$appRoot\appreleasesigned.aab" -Force
    Write-Output "Copied AAB to $appRoot\app-release.aab and $appRoot\appreleasesigned.aab"
}

Write-Output "`n===================================================="
Write-Output "  Build Finished Successfully!"
Write-Output "===================================================="
