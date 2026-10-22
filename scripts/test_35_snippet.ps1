$c35 = [System.IO.File]::ReadAllText('C:\Users\rajes\StudioProjects\jbac_app\www\build\35.js', [System.Text.Encoding]::UTF8)
$idx = $c35.IndexOf('formControlName="district_id"')
Write-Host "Snippet around district_id in 35.js:"
Write-Host $c35.Substring($idx - 300, 500)
