$p23 = "C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js"
$c23 = [System.IO.File]::ReadAllText($p23, [System.Text.Encoding]::UTF8)
$idx = $c23.IndexOf('formControlName="state_id"')
Write-Host "Snippet around state_id in 23.js:"
Write-Host $c23.Substring($idx - 100, 350)

$p18 = "C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js"
$c18 = [System.IO.File]::ReadAllText($p18, [System.Text.Encoding]::UTF8)
$idx18 = $c18.IndexOf('formControlName="state_id"')
Write-Host "`nSnippet around state_id in 18.js:"
Write-Host $c18.Substring($idx18 - 100, 350)
