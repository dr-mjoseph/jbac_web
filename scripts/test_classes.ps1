$c18 = [System.IO.File]::ReadAllText('C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js', [System.Text.Encoding]::UTF8)
$m18 = [regex]::Matches($c18, 'var\s+([A-Za-z0-9_]+)\s*=\s*\(?function')
foreach ($m in $m18) { Write-Host "18.js class: $($m.Groups[1].Value)" }

$c32 = [System.IO.File]::ReadAllText('C:\Users\rajes\StudioProjects\jbac_app\www\build\32.js', [System.Text.Encoding]::UTF8)
$m32 = [regex]::Matches($c32, 'var\s+([A-Za-z0-9_]+)\s*=\s*\(?function')
foreach ($m in $m32) { Write-Host "32.js class: $($m.Groups[1].Value)" }
