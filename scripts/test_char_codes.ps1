$p23 = "C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js"
$bytes = [System.IO.File]::ReadAllBytes($p23)
$c = [System.Text.Encoding]::UTF8.GetString($bytes)
$idx = $c.IndexOf('formControlName="state_id"')
$sub = $c.Substring($idx - 60, 40)
Write-Host "String: $sub"
foreach ($ch in $sub.ToCharArray()) {
    Write-Host ("Char: '{0}' (Code: 0x{1:X4})" -f $ch, [int]$ch)
}
