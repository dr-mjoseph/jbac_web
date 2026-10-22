$c = Get-Content 'C:\Users\rajes\StudioProjects\jbac_app\www\build\12.js' -Raw -Encoding UTF8
Write-Host "Length: $($c.Length)"
Write-Host "Contains student: $($c.Contains('student'))"
Write-Host "Contains studentform: $($c.Contains('studentform'))"
Write-Host "Contains states: $($c.Contains('states'))"
Write-Host "Contains district: $($c.Contains('district'))"
Write-Host "Contains state_id: $($c.Contains('state_id'))"
