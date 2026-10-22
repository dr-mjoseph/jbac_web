$p18 = 'C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js'
$c18 = [System.IO.File]::ReadAllText($p18, [System.Text.Encoding]::UTF8)
$idx = $c18.IndexOf('onStateChange')
Write-Host "onStateChange index in 18.js: $idx"
if ($idx -gt 0) {
    Write-Host "--- ONSTATECHANGE SNIPPET ---"
    Write-Host $c18.Substring($idx - 50, 400)
}

$idxTpl = $c18.IndexOf('formControlName="state_id"')
Write-Host "formControlName='state_id' index in 18.js: $idxTpl"
if ($idxTpl -gt 0) {
    Write-Host "--- TEMPLATE SNIPPET ---"
    Write-Host $c18.Substring($idxTpl - 100, 300)
}

$idxForm = $c18.IndexOf('state_id:')
Write-Host "state_id: index in 18.js: $idxForm"
if ($idxForm -gt 0) {
    Write-Host "--- FORM SNIPPET ---"
    Write-Host $c18.Substring($idxForm - 50, 200)
}
