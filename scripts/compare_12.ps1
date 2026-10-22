$c1 = Get-Content 'C:\Users\rajes\StudioProjects\jbac_app\www\build\12.js' -Raw -Encoding UTF8
$c2 = Get-Content 'C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\src\main\assets\www\build\12.js' -Raw -Encoding UTF8
Write-Host "www/build/12.js length: $($c1.Length), contains state_id: $($c1.Contains('state_id'))"
Write-Host "assets/www/build/12.js length: $($c2.Length), contains state_id: $($c2.Contains('state_id'))"
