$c = [System.IO.File]::ReadAllText("C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js", [System.Text.Encoding]::UTF8)
Write-Host "18.js contains state_id: $($c.Contains('state_id'))"
$pos = 0
while (($idx = $c.IndexOf('state_id', $pos)) -ge 0) {
    Write-Host "Index $idx : " $c.Substring([Math]::Max(0, $idx - 30), 80)
    $pos = $idx + 1
}
