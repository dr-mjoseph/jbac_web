$main = Get-Content "C:\Users\rajes\StudioProjects\jbac_app\www\build\main.js" -Raw -Encoding UTF8
$idx = $main.IndexOf("getdistrict")
if ($idx -gt 0) {
    Write-Host "Found getdistrict in www/build/main.js:"
    Write-Host $main.Substring($idx - 50, 400)
} else {
    Write-Host "getdistrict not found in www/build/main.js"
}
