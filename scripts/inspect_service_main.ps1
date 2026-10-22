$main = Get-Content "C:\Users\rajes\StudioProjects\jbac_app\www\build\main.js" -Raw -Encoding UTF8
$idx = $main.IndexOf("ServiceProvider.prototype.getdistrict = function")
Write-Host $main.Substring($idx, 600)
