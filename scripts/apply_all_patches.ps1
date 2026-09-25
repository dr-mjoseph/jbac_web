# Robust patch executor for jbac_app
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mobileRoot = "C:\Users\rajes\StudioProjects\jbac_app"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

Write-Host "=================================================="
Write-Host "Applying Current Location Patches to jbac_app"
Write-Host "Mobile Root: $mobileRoot"
Write-Host "=================================================="

# 1. Patch addmeetings.html
$htmlFile = Join-Path $mobileRoot "src\pages\addmeetings\addmeetings.html"
if (Test-Path $htmlFile) {
    $htmlContent = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)
    $htmlTarget = [System.IO.File]::ReadAllText((Join-Path $scriptDir "patch_html_target.txt"), [System.Text.Encoding]::UTF8)
    $htmlReplacement = [System.IO.File]::ReadAllText((Join-Path $scriptDir "patch_html_replacement.txt"), [System.Text.Encoding]::UTF8)

    $normHtml = $htmlContent.Replace("`r`n", "`n")
    $normTarget = $htmlTarget.Replace("`r`n", "`n")
    $normReplacement = $htmlReplacement.Replace("`r`n", "`n")

    if ($normHtml.Contains($normTarget)) {
        $normHtml = $normHtml.Replace($normTarget, $normReplacement)
        [System.IO.File]::WriteAllText($htmlFile, $normHtml.Replace("`n", "`r`n"), $utf8NoBom)
        Write-Host "[SUCCESS] addmeetings.html updated with Current Location button"
    } elseif ($normHtml.Contains("useCurrentLocation()")) {
        Write-Host "[INFO] addmeetings.html already contains useCurrentLocation()"
    } else {
        Write-Host "[WARN] Could not find target in addmeetings.html"
    }
}

# 2. Patch addmeetings.ts
$tsFile = Join-Path $mobileRoot "src\pages\addmeetings\addmeetings.ts"
if (Test-Path $tsFile) {
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

    # Method insertion / replacement
    $tsMethod = [System.IO.File]::ReadAllText((Join-Path $scriptDir "patch_ts_method.txt"), [System.Text.Encoding]::UTF8).Replace("`r`n", "`n")
    if ($normTs.Contains("async useCurrentLocation()")) {
        # Replace existing useCurrentLocation method up to openphoto
        $pattern = "(?s)  async useCurrentLocation\(\).*?(?=  async openphoto\(\))"
        $normTs = [System.Text.RegularExpressions.Regex]::Replace($normTs, $pattern, $tsMethod + "`n")
        Write-Host "[SUCCESS] addmeetings.ts updated existing useCurrentLocation() method"
    } elseif ($normTs.Contains("useCurrentLocation(): void")) {
        $pattern = "(?s)  useCurrentLocation\(\): void.*?(?=  async openphoto\(\))"
        $normTs = [System.Text.RegularExpressions.Regex]::Replace($normTs, $pattern, $tsMethod + "`n")
        Write-Host "[SUCCESS] addmeetings.ts updated existing useCurrentLocation() method"
    } else {
        $openphotoSearch = "  async openphoto() {"
        if ($normTs.Contains($openphotoSearch)) {
            $normTs = $normTs.Replace($openphotoSearch, $tsMethod + "`n  async openphoto() {")
            Write-Host "[SUCCESS] addmeetings.ts inserted useCurrentLocation() method"
        }
    }

    [System.IO.File]::WriteAllText($tsFile, $normTs.Replace("`n", "`r`n"), $utf8NoBom)
}

# 3. Patch config.xml
$configPath = Join-Path $mobileRoot "config.xml"
if (Test-Path $configPath) {
    $configContent = [System.IO.File]::ReadAllText($configPath, [System.Text.Encoding]::UTF8)
    $cfgUpdated = $false

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
        $cfgUpdated = $true
        Write-Host "[SUCCESS] config.xml location permissions added"
    }

    if (-not $configContent.Contains("cordova-plugin-geolocation")) {
        $pluginTag = '    <plugin name="cordova-plugin-geolocation" spec="^4.1.0" />'
        $lastPlugin = '<plugin name="cordova-plugin-ionic-keyboard" spec="^2.0.5" />'
        if ($configContent.Contains($lastPlugin)) {
            $configContent = $configContent.Replace($lastPlugin, "$lastPlugin`n$pluginTag")
        } else {
            $configContent = $configContent.Replace("</widget>", "$pluginTag`n</widget>")
        }
        $cfgUpdated = $true
        Write-Host "[SUCCESS] config.xml cordova-plugin-geolocation added"
    }

    if ($cfgUpdated) {
        [System.IO.File]::WriteAllText($configPath, $configContent, $utf8NoBom)
    }
}

# 4. Patch package.json in mobile
$packageJsonPath = Join-Path $mobileRoot "package.json"
if (Test-Path $packageJsonPath) {
    $pkgJsonContent = [System.IO.File]::ReadAllText($packageJsonPath, [System.Text.Encoding]::UTF8)
    $pkg = $pkgJsonContent | ConvertFrom-Json
    $pkgUpdated = $false
    if (-not $pkg.dependencies."cordova-plugin-geolocation") {
        $pkg.dependencies | Add-Member -MemberType NoteProperty -Name "cordova-plugin-geolocation" -Value "^4.1.0" -Force
        $pkgUpdated = $true
    }
    if ($pkgUpdated) {
        $newPkgJson = $pkg | ConvertTo-Json -Depth 10
        [System.IO.File]::WriteAllText($packageJsonPath, $newPkgJson, $utf8NoBom)
        Write-Host "[SUCCESS] package.json updated with cordova-plugin-geolocation"
    }
}

Write-Host "=================================================="
Write-Host "All Patches Applied Successfully!"
Write-Host "=================================================="
