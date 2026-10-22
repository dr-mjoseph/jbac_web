$c = Get-Content 'C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js' -Raw -Encoding UTF8
$idxTpl = $c.IndexOf('template: "')
if ($idxTpl -lt 0) { $idxTpl = $c.IndexOf('template: \"') }
if ($idxTpl -lt 0) { $idxTpl = $c.IndexOf('template:') }
Write-Host "Index of template: $idxTpl"
if ($idxTpl -gt 0) {
    Write-Host $c.Substring($idxTpl, 1000)
} else {
    # Let's search for *.html in 23.js
    Write-Host "Searching for html export in 23.js:"
    $m = [regex]::Match($c, '(/\*\*\*.*?\.html.*?\*/[\s\S]*?module\.exports\s*=\s*[\s\S]*?;)')
    if ($m.Success) {
        Write-Host $m.Value.Substring(0, [Math]::Min(1000, $m.Value.Length))
    }
}
