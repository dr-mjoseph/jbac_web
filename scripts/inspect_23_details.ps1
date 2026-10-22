$c = Get-Content 'C:\Users\rajes\StudioProjects\jbac_app\www\build\23.js' -Raw -Encoding UTF8
# Let's find where the template is and where the class methods are
$idxTemplate = $c.IndexOf("జిల్లాలను")
Write-Host "Index of జిల్లాలను: $idxTemplate"
if ($idxTemplate -gt 0) {
    Write-Host "Around జిల్లాలను:"
    Write-Host $c.Substring($idxTemplate - 200, 600)
}
$idxClass = $c.IndexOf("JobsPage =")
Write-Host "Index of JobsPage =: $idxClass"
if ($idxClass -gt 0) {
    Write-Host "Around JobsPage =:"
    Write-Host $c.Substring($idxClass, 1200)
}
