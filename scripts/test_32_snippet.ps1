$c32 = [System.IO.File]::ReadAllText('C:\Users\rajes\StudioProjects\jbac_app\www\build\32.js', [System.Text.Encoding]::UTF8)
$idx = $c32.IndexOf('formControlName="district_id"')
Write-Host "Snippet around district_id in 32.js:"
Write-Host $c32.Substring($idx - 300, 500)
