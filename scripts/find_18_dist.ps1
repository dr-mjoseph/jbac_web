$c = [System.IO.File]::ReadAllText("C:\Users\rajes\StudioProjects\jbac_app\www\build\18.js", [System.Text.Encoding]::UTF8)
$pos = 0
while (($idx = $c.IndexOf('districts', $pos)) -ge 0) {
    Write-Host "Index $idx : " $c.Substring([Math]::Max(0, $idx - 30), 100)
    $pos = $idx + 1
}
