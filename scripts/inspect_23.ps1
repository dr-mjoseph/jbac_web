$c = Get-Content 'C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js' -Raw -Encoding UTF8
Write-Host "23.js length: $($c.Length)"
# print first 1500 chars
Write-Host $c.Substring(0, [Math]::Min(1500, $c.Length))
