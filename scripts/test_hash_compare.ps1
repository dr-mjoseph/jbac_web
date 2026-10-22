$loc1 = "C:\Users\rajes\StudioProjects\jbac_app\www\build"
$loc2 = "C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\src\main\assets\www\build"

$files = @("main.js", "23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js")

foreach ($f in $files) {
    $p1 = "$loc1\$f"
    $p2 = "$loc2\$f"
    $h1 = (Get-FileHash $p1).Hash
    $h2 = (Get-FileHash $p2).Hash
    $match = ($h1 -eq $h2)
    Write-Host "$($f): Match=$match (Hash=$($h1.Substring(0,8))...)"
}
