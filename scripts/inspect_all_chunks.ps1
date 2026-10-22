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
    if (Test-Path $f) {
        $c = Get-Content $f -Raw -Encoding UTF8
        Write-Host "=== $($item.Name) ($($item.Chunk)) ==="
        $m = [regex]::Match($c, "formControlName=\`"$($item.DistField)\`"")
        Write-Host "Found formControlName=$($item.DistField): $($m.Success)"
        $mForm = [regex]::Match($c, "$($item.DistField):\s*\[")
        Write-Host "Found in form group: $($mForm.Success)"
    }
}
