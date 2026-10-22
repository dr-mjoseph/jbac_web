Add-Type -AssemblyName System.IO.Compression.FileSystem

$aabPath = "C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.37.aab"
$zip = [System.IO.Compression.ZipFile]::OpenRead($aabPath)

$entryMain = $zip.GetEntry("base/assets/www/build/main.js")
$streamMain = $entryMain.Open()
$readerMain = New-Object System.IO.StreamReader($streamMain, [System.Text.Encoding]::UTF8)
$contentMain = $readerMain.ReadToEnd()
$readerMain.Close()
$streamMain.Close()

$entry23 = $zip.GetEntry("base/assets/www/build/23.js")
$stream23 = $entry23.Open()
$reader23 = New-Object System.IO.StreamReader($stream23, [System.Text.Encoding]::UTF8)
$content23 = $reader23.ReadToEnd()
$reader23.Close()
$stream23.Close()

$zip.Dispose()

Write-Host "AAB base/assets/www/build/main.js contains 'getstates': $($contentMain.Contains('getstates'))"
Write-Host "AAB base/assets/www/build/main.js contains 'state_id: stateId': $($contentMain.Contains('state_id: stateId'))"
Write-Host "AAB base/assets/www/build/23.js contains 'formControlName=""state_id""': $($content23.Contains('formControlName=""state_id""'))"
Write-Host "AAB base/assets/www/build/23.js contains 'JobsPage.prototype.onStateChange': $($content23.Contains('JobsPage.prototype.onStateChange'))"
