$c = [System.IO.File]::ReadAllText("C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js", [System.Text.Encoding]::UTF8)
$idx = $c.IndexOf('district_id')
Write-Host "Index of district_id: $idx"
Write-Host "Raw substring (length 200):"
Write-Host $c.Substring($idx - 80, 160)
