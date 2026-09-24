$path = "C:\Users\rajes\StudioProjects\jbac_app\.github\workflows\build-apk.yml"
$lines = Get-Content $path
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'npm run build -- --prod > aot-build.log') {
        $lines[$i] = "      run: |`n        npm run build -- --prod > aot-build.log 2>&1 || (echo `"### AoT Build Failed`" >> `$GITHUB_STEP_SUMMARY; echo `"<pre>`" >> `$GITHUB_STEP_SUMMARY; tail -n 80 aot-build.log >> `$GITHUB_STEP_SUMMARY; echo `"</pre>`" >> `$GITHUB_STEP_SUMMARY; cat aot-build.log; exit 1)"
    }
}
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines($path, $lines, $utf8NoBom)
Write-Output "Fixed run block in build-apk.yml"
