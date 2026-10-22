$pages = Get-ChildItem -Path "C:\Users\rajes\StudioProjects\jbac_app\src\pages" -Directory
$results = @()
foreach ($p in $pages) {
    $h = Join-Path $p.FullName ($p.Name + ".html")
    if (Test-Path $h) {
        $content = Get-Content $h -Raw -Encoding UTF8
        $hasDist = $content -match "district"
        $hasState = ($content -match "state_id") -or ($content -match "రాష్ట్రం")
        if ($hasDist) {
            $results += [PSCustomObject]@{
                Page = $p.Name
                HasDistrict = $hasDist
                HasState = $hasState
            }
        }
    }
}
$results | Format-Table -AutoSize
