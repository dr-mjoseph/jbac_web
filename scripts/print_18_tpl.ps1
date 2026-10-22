$c = [System.IO.File]::ReadAllText("C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js", [System.Text.Encoding]::UTF8)
Write-Host $c.Substring(16750, 220)
