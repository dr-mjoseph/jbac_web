$configXml = "C:\Users\rajes\StudioProjects\jbac_app\config.xml"
$manifestXml = "C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\src\main\AndroidManifest.xml"

# Update config.xml
$c = Get-Content $configXml -Raw
$c = $c -replace 'android-versionCode="\d+"', 'android-versionCode="23"'
Set-Content -Path $configXml -Value $c -NoNewline

# Update AndroidManifest.xml
$m = Get-Content $manifestXml -Raw
$m = $m -replace 'android:versionCode="\d+"', 'android:versionCode="23"'
$m = $m -replace 'android:versionName="[^"]+"', 'android:versionName="0.0.23"'
Set-Content -Path $manifestXml -Value $m -NoNewline

Write-Output "Updated config.xml:"
Get-Content $configXml | Select-Object -First 3

Write-Output "`nUpdated AndroidManifest.xml:"
Get-Content $manifestXml | Select-Object -First 3
