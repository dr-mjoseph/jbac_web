$content = Get-Content "C:\Users\rajes\StudioProjects\jbac_app\www\build\12.js" -Raw -Encoding UTF8
$idx = $content.IndexOf("state_id")
if ($idx -gt 0) {
    $start = [Math]::Max(0, $idx - 300)
    $len = [Math]::Min($content.Length - $start, 600)
    Write-Host "Snippet around state_id in 12.js:"
    Write-Host $content.Substring($start, $len)
} else {
    Write-Host "state_id not found in 12.js"
}
