$loc = "C:\Users\rajes\StudioProjects\jbac_app\www\build"

$chunks = @(
    @{ File = "23.js"; Name = "JobsPage"; DistField = "district_id" },
    @{ File = "13.js"; Name = "SearchorganisationPage"; DistField = "district_id" },
    @{ File = "18.js"; Name = "OrganisationPage"; DistField = "districts" },
    @{ File = "16.js"; Name = "PastorPage"; DistField = "district_id" },
    @{ File = "35.js"; Name = "ChurchPage"; DistField = "district_id" },
    @{ File = "38.js"; Name = "AssociationPage"; DistField = "district_id" },
    @{ File = "14.js"; Name = "SearchhousePage"; DistField = "district_id" },
    @{ File = "22.js"; Name = "MarriagePage"; DistField = "district_id" },
    @{ File = "41.js"; Name = "AddjobsPage"; DistField = "districtname" },
    @{ File = "37.js"; Name = "BelieverPage"; DistField = "districts" },
    @{ File = "12.js"; Name = "StudentPage"; DistField = "district_id" },
    @{ File = "32.js"; Name = "EntryFormPage"; DistField = "district_id" }
)

foreach ($item in $chunks) {
    $p = "$loc\$($item.File)"
    $c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
    $d = $item.DistField
    $fName = $item.Name
    
    # Find $d: [
    $m = [regex]::Match($c, "$($d)\s*:\s*\[")
    if ($m.Success) {
        $idx = $m.Index
        Write-Host "----------------------------------------"
        Write-Host "$fName ($($item.File)) - Form snippet:"
        Write-Host $c.Substring([math]::Max(0, $idx - 50), 150)
    } else {
        Write-Host "----------------------------------------"
        Write-Host "$fName ($($item.File)) - Form field '$d' NOT MATCHED"
    }
}
