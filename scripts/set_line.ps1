$path = "C:\Users\rajes\StudioProjects\jbac_app\.github\workflows\build-apk.yml"
$lines = Get-Content $path
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'cordova-build.log') {
        $lines[$i] = '        cordova build android --release -- --packageType=apk 2>&1 | tee cordova-build.log || (echo "### Cordova Build Failed" >> $GITHUB_STEP_SUMMARY; echo "<pre>" >> $GITHUB_STEP_SUMMARY; tail -n 80 cordova-build.log >> $GITHUB_STEP_SUMMARY; echo "</pre>" >> $GITHUB_STEP_SUMMARY; exit 1)'
    }
}
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines($path, $lines, $utf8NoBom)
Write-Output "Updated successfully."
