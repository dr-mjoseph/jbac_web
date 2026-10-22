$c = [System.IO.File]::ReadAllText("C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js", [System.Text.Encoding]::UTF8)
$pos = 0
while (($idx = $c.IndexOf('district_id', $pos)) -ge 0) {
    Write-Host "Occurrence at index: $idx"
    $start = [Math]::Max(0, $idx - 60)
    $len = [Math]::Min($c.Length - $start, 120)
    Write-Host "  -> " $c.Substring($start, $len)
    $pos = $idx + 1
}
