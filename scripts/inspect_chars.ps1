$c = [System.IO.File]::ReadAllText("C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js", [System.Text.Encoding]::UTF8)
$m = [regex]::Match($c, '<ion-label stacked>(.*?)</ion-label>')
while ($m.Success) {
    $text = $m.Groups[1].Value
    $chars = $text.ToCharArray() | ForEach-Object { "U+{0:X4} " -f [int]$_ }
    Write-Host "Label: $text -> $($chars -join '')"
    $m = $m.NextMatch()
}
