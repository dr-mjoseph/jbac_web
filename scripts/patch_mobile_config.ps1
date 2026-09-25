$ErrorActionPreference = "Stop"

$mobileDir = "C:\Users\rajes\StudioProjects\jbac_app"
$configXmlPath = Join-Path $mobileDir "config.xml"
$packageJsonPath = Join-Path $mobileDir "package.json"

Write-Host "Updating config.xml in $mobileDir..."
$configContent = [System.IO.File]::ReadAllText($configXmlPath, [System.Text.Encoding]::UTF8)

if (-not $configContent.Contains("cordova-plugin-geolocation")) {
    $pluginTag = '    <plugin name="cordova-plugin-geolocation" spec="^4.1.0" />'
    $lastPlugin = '<plugin name="cordova-plugin-ionic-keyboard" spec="^2.0.5" />'
    if ($configContent.Contains($lastPlugin)) {
        $configContent = $configContent.Replace($lastPlugin, "$lastPlugin`n$pluginTag")
    } else {
        $configContent = $configContent.Replace("</widget>", "$pluginTag`n</widget>")
    }
    [System.IO.File]::WriteAllText($configXmlPath, $configContent, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "[SUCCESS] Added cordova-plugin-geolocation to config.xml"
} else {
    Write-Host "[INFO] cordova-plugin-geolocation already in config.xml"
}

Write-Host "Updating package.json in $mobileDir..."
$pkgJsonContent = [System.IO.File]::ReadAllText($packageJsonPath, [System.Text.Encoding]::UTF8)
$pkg = $pkgJsonContent | ConvertFrom-Json

$updated = $false
if (-not $pkg.dependencies."cordova-plugin-geolocation") {
    $pkg.dependencies | Add-Member -MemberType NoteProperty -Name "cordova-plugin-geolocation" -Value "^4.1.0" -Force
    $updated = $true
}
if (-not $pkg.devDependencies."cordova-plugin-geolocation") {
    $pkg.devDependencies | Add-Member -MemberType NoteProperty -Name "cordova-plugin-geolocation" -Value "^4.1.0" -Force
    $updated = $true
}

if ($updated) {
    $newPkgJson = $pkg | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($packageJsonPath, $newPkgJson, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "[SUCCESS] Added cordova-plugin-geolocation to package.json"
} else {
    Write-Host "[INFO] cordova-plugin-geolocation already in package.json"
}
