$c = Get-Content 'C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js' -Raw -Encoding UTF8
$idxEnd = $c.IndexOf("/*ion-inline-end:")
Write-Host "Index of ion-inline-end: $idxEnd"
if ($idxEnd -gt 0) {
    Write-Host $c.Substring($idxEnd - 200, 300)
}
