# Script to restore the native Ionic 3 mobile UI matching Google Play Store in jbac_app
$ErrorActionPreference = "Stop"

$appDir = "C:\Users\rajes\StudioProjects\jbac_app"
$wwwDir = "$appDir\www"
$androidWww = "$appDir\platforms\android\app\src\main\assets\www"

Write-Output "===================================================="
Write-Output "  Restoring Play Store Ionic 3 Mobile UI"
Write-Output "===================================================="

# 1. Foreign Angular 15 website bundle files to remove
$foreignPatterns = @(
    "main.*.js",
    "polyfills.*.js",
    "runtime.*.js",
    "styles.*.css",
    "3rdpartylicenses.txt",
    "*.*.*.png",
    "*.*.png"
)

foreach ($pattern in $foreignPatterns) {
    Get-ChildItem -Path $wwwDir -Filter $pattern -File -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_.FullName -Force
        Write-Output "Removed from www: $($_.Name)"
    }
    if (Test-Path $androidWww) {
        Get-ChildItem -Path $androidWww -Filter $pattern -File -ErrorAction SilentlyContinue | ForEach-Object {
            Remove-Item $_.FullName -Force
            Write-Output "Removed from android assets: $($_.Name)"
        }
    }
}

# 2. Pristine Ionic 3 index.html content
$ionicIndex = @'
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <script data-ionic="inject">
    (function(w){var i=w.Ionic=w.Ionic||{};i.version='3.9.9';i.angular='5.2.11';i.staticDir='build/';})(window);
  </script>
  <meta charset="UTF-8">
  <title>JBAC-AP</title>
  <meta name="viewport"
    content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">

  <link rel="icon" type="image/x-icon" href="assets/icon/favicon.ico">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#00548F">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

  <!-- add to homescreen for ios -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">

  <!-- cordova.js required for cordova apps -->
  <script src="cordova.js"></script>

  <link href="build/main.css" rel="stylesheet">
</head>

<body>
  <ion-app></ion-app>
  <script src="build/polyfills.js"></script>
  <script src="build/vendor.js"></script>
  <script src="build/main.js"></script>
</body>

</html>
'@

# 3. Write index.html to www and android assets
[System.IO.File]::WriteAllText("$wwwDir\index.html", $ionicIndex, [System.Text.Encoding]::UTF8)
Write-Output "Successfully restored Ionic 3 mobile UI at $wwwDir\index.html"

if (Test-Path $androidWww) {
    [System.IO.File]::WriteAllText("$androidWww\index.html", $ionicIndex, [System.Text.Encoding]::UTF8)
    Write-Output "Successfully restored Ionic 3 mobile UI at $androidWww\index.html"
}

# 4. Verify www directory contents
Write-Output "`n[VERIFY] www directory contents:"
Get-ChildItem -Path $wwwDir | Select-Object Name, Length | Format-Table -AutoSize

Write-Output "`n===================================================="
Write-Output "  Restoration Complete!"
Write-Output "===================================================="
