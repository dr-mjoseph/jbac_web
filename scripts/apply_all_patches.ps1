# Robust patch executor for jbac_app
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mobileRoot = "C:\Users\rajes\StudioProjects\jbac_app"

Write-Host "=================================================="
Write-Host "Applying Current Location Patches to jbac_app"
Write-Host "Mobile Root: $mobileRoot"
Write-Host "=================================================="

# 1. Patch addmeetings.html
$htmlFile = Join-Path $mobileRoot "src\pages\addmeetings\addmeetings.html"
$htmlContent = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)

$htmlTarget = [System.IO.File]::ReadAllText((Join-Path $scriptDir "patch_html_target.txt"), [System.Text.Encoding]::UTF8)
$htmlReplacement = [System.IO.File]::ReadAllText((Join-Path $scriptDir "patch_html_replacement.txt"), [System.Text.Encoding]::UTF8)

$normHtml = $htmlContent.Replace("`r`n", "`n")
$normTarget = $htmlTarget.Replace("`r`n", "`n")
$normReplacement = $htmlReplacement.Replace("`r`n", "`n")

if ($normHtml.Contains($normTarget)) {
    $normHtml = $normHtml.Replace($normTarget, $normReplacement)
    [System.IO.File]::WriteAllText($htmlFile, $normHtml.Replace("`n", "`r`n"), [System.Text.Encoding]::UTF8)
    Write-Host "[SUCCESS] addmeetings.html updated with Current Location button"
} elseif ($normHtml.Contains("useCurrentLocation()")) {
    Write-Host "[INFO] addmeetings.html already contains useCurrentLocation()"
} else {
    Write-Error "Could not find target in addmeetings.html"
}

# 2. Patch addmeetings.ts
$tsFile = Join-Path $mobileRoot "src\pages\addmeetings\addmeetings.ts"
$tsContent = [System.IO.File]::ReadAllText($tsFile, [System.Text.Encoding]::UTF8)
$normTs = $tsContent.Replace("`r`n", "`n")

# Update imports
$importOld = "import { Component } from '@angular/core';"
$importNew = "import { Component, NgZone, ChangeDetectorRef } from '@angular/core';"
if ($normTs.Contains($importOld)) {
    $normTs = $normTs.Replace($importOld, $importNew)
    Write-Host "[SUCCESS] addmeetings.ts imports updated"
}

# Add state properties
$propTarget = "export class AddmeetingsPage {`n  form: FormGroup"
$propNew = "export class AddmeetingsPage {`n  form: FormGroup;`n  locationLoading: boolean = false;`n  locationError: string = '';`n  locationSuccess: string = '';`n  locationName: string = '';`n  locationSourceMessage: string = '';"
if ($normTs.Contains($propTarget)) {
    $normTs = $normTs.Replace($propTarget, $propNew)
    Write-Host "[SUCCESS] addmeetings.ts properties added"
}

# Add constructor injection
$ctorOld = "constructor(public navCtrl: NavController, public navParams: NavParams, public service: ServiceProvider, public frombuilder: FormBuilder, public actionSheetCtrl: ActionSheetController, public camera: Camera, private loadingCtrl: LoadingController, private alertctrl: AlertController) {"
$ctorNew = "constructor(public navCtrl: NavController, public navParams: NavParams, public service: ServiceProvider, public frombuilder: FormBuilder, public actionSheetCtrl: ActionSheetController, public camera: Camera, private loadingCtrl: LoadingController, private alertctrl: AlertController, public zone: NgZone, public cdr: ChangeDetectorRef) {"
if ($normTs.Contains($ctorOld)) {
    $normTs = $normTs.Replace($ctorOld, $ctorNew)
    Write-Host "[SUCCESS] addmeetings.ts constructor updated"
}

# Add method
$tsMethod = [System.IO.File]::ReadAllText((Join-Path $scriptDir "patch_ts_method.txt"), [System.Text.Encoding]::UTF8).Replace("`r`n", "`n")
$openphotoSearch = "  async openphoto() {"
if ($normTs.Contains($openphotoSearch) -and -not $normTs.Contains("useCurrentLocation()")) {
    $normTs = $normTs.Replace($openphotoSearch, $tsMethod + "`n  async openphoto() {")
    Write-Host "[SUCCESS] addmeetings.ts useCurrentLocation() method inserted"
}

[System.IO.File]::WriteAllText($tsFile, $normTs.Replace("`n", "`r`n"), [System.Text.Encoding]::UTF8)

# 3. Patch config.xml
$configPath = Join-Path $mobileRoot "config.xml"
$configContent = [System.IO.File]::ReadAllText($configPath, [System.Text.Encoding]::UTF8)
if (-not $configContent.Contains("android.permission.ACCESS_FINE_LOCATION")) {
    $platformOld = '<platform name="android">'
    $platformNew = @"
    <platform name="android">
        <config-file file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest" xmlns:android="http://schemas.android.com/apk/res/android">
            <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
            <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
            <uses-feature android:name="android.hardware.location.gps" android:required="false" />
        </config-file>
"@.Replace("`r`n", "`n")
    $configContent = $configContent.Replace("`r`n", "`n").Replace($platformOld, $platformNew).Replace("`n", "`r`n")
    [System.IO.File]::WriteAllText($configPath, $configContent, [System.Text.Encoding]::UTF8)
    Write-Host "[SUCCESS] config.xml location permissions added"
}

# 4. Patch AndroidManifest.xml
$manifestPath = Join-Path $mobileRoot "platforms\android\app\src\main\AndroidManifest.xml"
if (Test-Path $manifestPath) {
    $manifestContent = [System.IO.File]::ReadAllText($manifestPath, [System.Text.Encoding]::UTF8)
    if (-not $manifestContent.Contains("android.permission.ACCESS_FINE_LOCATION")) {
        $internetPerm = '<uses-permission android:name="android.permission.INTERNET" />'
        $allPerms = @"
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-feature android:name="android.hardware.location.gps" android:required="false" />
"@.Replace("`r`n", "`n")
        $manifestContent = $manifestContent.Replace("`r`n", "`n").Replace($internetPerm, $allPerms).Replace("`n", "`r`n")
        [System.IO.File]::WriteAllText($manifestPath, $manifestContent, [System.Text.Encoding]::UTF8)
        Write-Host "[SUCCESS] AndroidManifest.xml location permissions added"
    }
}

# 5. Patch 39.js chunks
$chunkTarget = [System.IO.File]::ReadAllText((Join-Path $scriptDir "patch_chunk_target.txt"), [System.Text.Encoding]::UTF8).Trim()
$chunkReplacement = [System.IO.File]::ReadAllText((Join-Path $scriptDir "patch_chunk_replacement.txt"), [System.Text.Encoding]::UTF8).Trim()
$chunkMethod = [System.IO.File]::ReadAllText((Join-Path $scriptDir "patch_chunk_method.txt"), [System.Text.Encoding]::UTF8)

$chunkFiles = @(
    (Join-Path $mobileRoot "www\build\39.js"),
    (Join-Path $mobileRoot "platforms\android\app\src\main\assets\www\build\39.js")
)

foreach ($cPath in $chunkFiles) {
    if (-not (Test-Path $cPath)) { continue }
    $cContent = [System.IO.File]::ReadAllText($cPath, [System.Text.Encoding]::UTF8)
    $normC = $cContent.Replace("`r`n", "`n")

    # Add constructor properties
    $cPropTarget = "this.submitted = false;"
    $cPropAdd = "this.submitted = false;`n        this.locationLoading = false;`n        this.locationError = '';`n        this.locationSuccess = '';`n        this.locationName = '';`n        this.locationSourceMessage = '';"
    if ($normC.Contains($cPropTarget) -and -not $normC.Contains("this.locationLoading = false;")) {
        $normC = $normC.Replace($cPropTarget, $cPropAdd)
        Write-Host "[SUCCESS] Added constructor properties to $cPath"
    }

    # Add method
    $cMethodSearch = "    AddmeetingsPage.prototype.openphoto = function () {"
    if ($normC.Contains($cMethodSearch) -and -not $normC.Contains("AddmeetingsPage.prototype.useCurrentLocation")) {
        $normC = $normC.Replace($cMethodSearch, $chunkMethod.Replace("`r`n", "`n") + "`n" + $cMethodSearch)
        Write-Host "[SUCCESS] Added useCurrentLocation to prototype in $cPath"
    }

    # Replace template string
    if ($normC.Contains($chunkTarget)) {
        $normC = $normC.Replace($chunkTarget, $chunkReplacement)
        Write-Host "[SUCCESS] Replaced inline template in $cPath"
    } elseif ($normC.Contains("useCurrentLocation()")) {
        Write-Host "[INFO] Template already contains useCurrentLocation() in $cPath"
    } else {
        Write-Host "[WARN] Chunk target not found in $cPath"
    }

    [System.IO.File]::WriteAllText($cPath, $normC.Replace("`n", "`r`n"), [System.Text.Encoding]::UTF8)
}

Write-Host "=================================================="
Write-Host "All Patches Applied Successfully!"
Write-Host "=================================================="
