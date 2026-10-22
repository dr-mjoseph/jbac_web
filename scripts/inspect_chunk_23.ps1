$c = Get-Content "C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js" -Raw -Encoding UTF8
Write-Host "--- Template District Match ---"
$m = [regex]::Match($c, '<ion-col col-12 col-md-3>[\s\S]*?<ion-label stacked>[^<]*</ion-label>[\s\S]*?district_id[\s\S]*?</ion-col>')
if ($m.Success) {
    Write-Host $m.Value
} else {
    Write-Host "District col not matched in template"
}

Write-Host "--- FormBuilder Group Match ---"
$m2 = [regex]::Match($c, 'this\.form\s*=\s*this\.formbuilder\.group\(\{[\s\S]*?\}\);')
if ($m2.Success) {
    Write-Host $m2.Value
} else {
    Write-Host "FormBuilder group not matched"
}
