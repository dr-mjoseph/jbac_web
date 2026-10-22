$chunks = @(
    @{ Chunk = '16.js'; Name = 'pastor'; DistField = 'district_id' },
    @{ Chunk = '35.js'; Name = 'church'; DistField = 'district_id' },
    @{ Chunk = '38.js'; Name = 'association'; DistField = 'district_id' },
    @{ Chunk = '14.js'; Name = 'searchhouse'; DistField = 'district_id' },
    @{ Chunk = '22.js'; Name = 'marriage'; DistField = 'district_id' },
    @{ Chunk = '41.js'; Name = 'addjobs'; DistField = 'districtname' },
    @{ Chunk = '37.js'; Name = 'believer'; DistField = 'districts' },
    @{ Chunk = '12.js'; Name = 'student'; DistField = 'district_id' },
    @{ Chunk = '32.js'; Name = 'entry-form'; DistField = 'district_id' }
)

foreach ($item in $chunks) {
    $f = "C:\Users\rajes\StudioProjects\jbac_app\www\build\$($item.Chunk)"
    $c = Get-Content $f -Raw -Encoding UTF8
    Write-Host "`n================== $($item.Name) ($($item.Chunk)) =================="
    $idx = $c.IndexOf("formControlName=\`"$($item.DistField)\`"")
    if ($idx -gt 0) {
        $start = [Math]::Max(0, $idx - 150)
        $len = [Math]::Min($c.Length - $start, 300)
        Write-Host "Snippet around template $($item.DistField):"
        Write-Host $c.Substring($start, $len)
    }
    $idxForm = $c.IndexOf("$($item.DistField):")
    if ($idxForm -gt 0) {
        $start = [Math]::Max(0, $idxForm - 50)
        $len = [Math]::Min($c.Length - $start, 120)
        Write-Host "Snippet around formBuilder $($item.DistField):"
        Write-Host $c.Substring($start, $len)
    }
}
