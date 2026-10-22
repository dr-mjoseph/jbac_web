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
    Write-Host "`n=== $($item.Name) ($($item.Chunk)) ==="
    $m = [regex]::Match($c, '(<ion-col[^>]*>[\s\S]*?' + $item.DistField + '[\s\S]*?</ion-col>)')
    if ($m.Success) {
        $val = $m.Groups[1].Value
        Write-Host "Matched col (length $($val.Length)):"
        Write-Host $val.Substring(0, [Math]::Min(300, $val.Length))
    } else {
        # Check without ion-col, e.g. ion-item
        $mItem = [regex]::Match($c, '(<ion-item[^>]*>[\s\S]*?' + $item.DistField + '[\s\S]*?</ion-item>)')
        if ($mItem.Success) {
            $val = $mItem.Groups[1].Value
            Write-Host "Matched item (length $($val.Length)):"
            Write-Host $val.Substring(0, [Math]::Min(300, $val.Length))
        } else {
            Write-Host "No match for $($item.DistField) in template"
        }
    }
}
