$apksigner = "C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\apksigner.bat"
$jarsigner = "C:\Program Files\Android\Android Studio\jbr\bin\jarsigner.exe"
$aapt = "C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\aapt.exe"
$apk = "C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.23.apk"
$aab = "C:\Users\rajes\StudioProjects\jbac_app\appreleasesigned.aab"

Write-Output "=== APK Badging (Version & Permissions) ==="
& $aapt dump badging $apk | Select-String "package: name="

Write-Output "`n=== Verifying APK Signature ==="
& $apksigner verify --verbose $apk

Write-Output "`n=== Verifying AAB Signature ==="
& $jarsigner -verify $aab

Write-Output "`n=== AAB Manifest Inspection ==="
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($aab)
$entry = $zip.GetEntry("base/manifest/AndroidManifest.xml")
$stream = $entry.Open()
$bytes = New-Object byte[] $entry.Length
$stream.Read($bytes, 0, $bytes.Length)
$stream.Dispose()
$zip.Dispose()
$text = [System.Text.Encoding]::ASCII.GetString($bytes)

$idxVerName = $text.IndexOf("versionName")
$idxVerCode = $text.IndexOf("versionCode")

if ($idxVerName -ge 0) {
    Write-Output "versionName raw snippet: $([System.Text.Encoding]::ASCII.GetString($bytes, $idxVerName, 25))"
}
if ($idxVerCode -ge 0) {
    Write-Output "versionCode raw snippet: $([System.Text.Encoding]::ASCII.GetString($bytes, $idxVerCode, 25))"
}

Write-Output "`n=== Artifact Sizes and Paths ==="
Get-Item $apk, $aab | Format-Table FullName, Length, LastWriteTime
