$awsUrl = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/'
$serviceFile = 'C:\Users\rajes\StudioProjects\jbac_app\src\providers\service\service.ts'
if (Test-Path $serviceFile) {
    $content = Get-Content $serviceFile -Raw
    $newContent = $content.Replace('https://jbac.in:9762/dashboardapi/', $awsUrl)
    Set-Content -Path $serviceFile -Value $newContent -Encoding UTF8 -NoNewline
    Write-Host '[SUCCESS] Patched service.ts in mobile app with AWS URL'
}

$mainJsFile = 'C:\Users\rajes\StudioProjects\jbac_app\www\build\main.js'
if (Test-Path $mainJsFile) {
    $content = Get-Content $mainJsFile -Raw
    $newContent = $content.Replace('https://jbac.in:9762/dashboardapi/', $awsUrl)
    Set-Content -Path $mainJsFile -Value $newContent -Encoding UTF8 -NoNewline
    Write-Host '[SUCCESS] Patched main.js in mobile app with AWS URL'
}
