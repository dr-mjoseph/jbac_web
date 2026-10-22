$loc1 = "C:\Users\rajes\StudioProjects\jbac_app\www\build"
$loc2 = "C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\src\main\assets\www\build"

$files = @("main.js", "23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js")

foreach ($f in $files) {
    Copy-Item "$loc1\$f" "$loc2\$f" -Force
}

Write-Host "Synchronized all 13 files from www\build to platforms Android assets!" -ForegroundColor Green
