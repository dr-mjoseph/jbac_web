$p18 = 'C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js'
$c18 = [System.IO.File]::ReadAllText($p18, [System.Text.Encoding]::UTF8)
Write-Host "18.js has formControlName=""state_id"": $($c18.Contains('formControlName=""state_id""'))"
Write-Host "18.js has onStateChange: $($c18.Contains('onStateChange'))"

$p23 = 'C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js'
$c23 = [System.IO.File]::ReadAllText($p23, [System.Text.Encoding]::UTF8)
Write-Host "23.js has formControlName=""state_id"": $($c23.Contains('formControlName=""state_id""'))"
Write-Host "23.js has onStateChange: $($c23.Contains('onStateChange'))"

$idx = $c23.IndexOf('formControlName="district_id"')
Write-Host "23.js district_id index: $idx"
if ($idx -gt 0) {
    Write-Host "Snippet around district_id in 23.js:"
    Write-Host $c23.Substring($idx - 150, 300)
}
