$files = Get-ChildItem -Path "c:\Users\rajes\Documents\jbac_web\src\app\jesus" -Recurse -Filter "*.html"
$results = @()
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    $hasDist = $content -match "district"
    $hasState = ($content -match "state_id") -or ($content -match "రాష్ట్రం")
    if ($hasDist) {
        $results += [PSCustomObject]@{
            Component = $f.Directory.Name
            File = $f.Name
            HasDistrict = $hasDist
            HasState = $hasState
        }
    }
}
$results | Format-Table -AutoSize
