$buildDir = "C:\Users\rajes\StudioProjects\jbac_app\www\build"
$files = Get-ChildItem -Path $buildDir -Filter "*.js"
$mapping = @()
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    $matches = [regex]::Matches($content, 'selector:\s*["'']page-([^"'']+)["'']')
    foreach ($m in $matches) {
        $mapping += [PSCustomObject]@{
            Chunk = $f.Name
            Selector = $m.Groups[1].Value
        }
    }
}
$mapping | Sort-Object Selector | Format-Table -AutoSize
