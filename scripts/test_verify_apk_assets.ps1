Add-Type -AssemblyName System.IO.Compression.FileSystem

$apkPath = "C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.37.apk"
$zip = [System.IO.Compression.ZipFile]::OpenRead($apkPath)

$entryMain = $zip.GetEntry("assets/www/build/main.js")
$streamMain = $entryMain.Open()
$readerMain = New-Object System.IO.StreamReader($streamMain, [System.Text.Encoding]::UTF8)
$contentMain = $readerMain.ReadToEnd()
$readerMain.Close()
$streamMain.Close()

$entry23 = $zip.GetEntry("assets/www/build/23.js")
$stream23 = $entry23.Open()
$reader23 = New-Object System.IO.StreamReader($stream23, [System.Text.Encoding]::UTF8)
$content23 = $reader23.ReadToEnd()
$reader23.Close()
$stream23.Close()

$zip.Dispose()

Write-Host "APK assets/www/build/main.js contains 'getstates': $($contentMain.Contains('getstates'))"
Write-Host "APK assets/www/build/main.js contains 'state_id: stateId': $($contentMain.Contains('state_id: stateId'))"
Write-Host "APK assets/www/build/23.js contains 'formControlName=""state_id""': $($content23.Contains('formControlName=""state_id""'))"
Write-Host "APK assets/www/build/23.js contains 'JobsPage.prototype.onStateChange': $($content23.Contains('JobsPage.prototype.onStateChange'))"
