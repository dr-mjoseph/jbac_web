$main = Get-Content "C:\Users\rajes\StudioProjects\jbac_app\www\build\main.js" -Raw -Encoding UTF8
Write-Host "Contains getstates:" ($main.Contains("getstates"))
if ($main.Contains("getstates")) {
    $idx = $main.IndexOf("getstates")
    Write-Host $main.Substring($idx - 50, 200)
}
