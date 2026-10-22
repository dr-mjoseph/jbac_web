$c18 = [System.IO.File]::ReadAllText('C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js', [System.Text.Encoding]::UTF8)
$m18 = [regex]::Matches($c18, '([A-Za-z0-9_]+)\.prototype\.')
$set18 = @{}
foreach ($m in $m18) { $set18[$m.Groups[1].Value] = $true }
Write-Host "18.js prototypes: $(($set18.Keys) -join ', ')"

$c32 = [System.IO.File]::ReadAllText('C:\Users\rajes\StudioProjects\jbac_app\www\build\32.js', [System.Text.Encoding]::UTF8)
$m32 = [regex]::Matches($c32, '([A-Za-z0-9_]+)\.prototype\.')
$set32 = @{}
foreach ($m in $m32) { $set32[$m.Groups[1].Value] = $true }
Write-Host "32.js prototypes: $(($set32.Keys) -join ', ')"
