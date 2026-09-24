$path = "C:\Users\rajes\StudioProjects\jbac_app\.github\workflows\build-apk.yml"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
$oldLine = "cordova build android --release -- --packageType=apk 2>&1 | tee cordova-build.log || (echo `"### Cordova Build Failed`" >> `$GITHUB_STEP_SUMMARY; echo '`' >> `$GITHUB_STEP_SUMMARY; tail -n 80 cordova-build.log >> `$GITHUB_STEP_SUMMARY; echo '`' >> `$GITHUB_STEP_SUMMARY; exit 1)"
$newLine = "cordova build android --release -- --packageType=apk 2>&1 | tee cordova-build.log || (echo `"### Cordova Build Failed`" >> `$GITHUB_STEP_SUMMARY; echo `"<pre>`" >> `$GITHUB_STEP_SUMMARY; tail -n 80 cordova-build.log >> `$GITHUB_STEP_SUMMARY; echo `"</pre>`" >> `$GITHUB_STEP_SUMMARY; exit 1)"
$content = $content.Replace($oldLine, $newLine)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
Write-Output "Successfully updated to pre tag in build-apk.yml"
