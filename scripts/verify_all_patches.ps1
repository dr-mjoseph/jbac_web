$appRoot = "C:\Users\rajes\StudioProjects\jbac_app"
$locations = @(
    "$appRoot\www\build",
    "$appRoot\platforms\android\app\src\main\assets\www\build"
)

$chunks = @(
    @{ File = "23.js"; Name = "JobsPage" },
    @{ File = "13.js"; Name = "SearchorganisationPage" },
    @{ File = "18.js"; Name = "OrganisationPage" },
    @{ File = "16.js"; Name = "PastorPage" },
    @{ File = "35.js"; Name = "ChurchPage" },
    @{ File = "38.js"; Name = "AssociationPage" },
    @{ File = "14.js"; Name = "SearchhousePage" },
    @{ File = "22.js"; Name = "MarriagePage" },
    @{ File = "41.js"; Name = "AddjobsPage" },
    @{ File = "37.js"; Name = "BelieverPage" },
    @{ File = "12.js"; Name = "StudentPage" },
    @{ File = "32.js"; Name = "EntryFormPage" }
)

$allPassed = $true

foreach ($loc in $locations) {
    Write-Host "`nChecking Location: $loc" -ForegroundColor Cyan
    # Check main.js
    $mainPath = "$loc\main.js"
    $mainContent = [System.IO.File]::ReadAllText($mainPath, [System.Text.Encoding]::UTF8)
    $hasGetStates = $mainContent.Contains("getstates")
    $hasStateFilter = $mainContent.Contains("state_id: stateId")
    Write-Host "  main.js -> getstates: $hasGetStates, stateId filter: $hasStateFilter"
    if (-not ($hasGetStates -and $hasStateFilter)) {
        $allPassed = $false
        Write-Host "  [FAIL] main.js missing getstates or state filter" -ForegroundColor Red
    }

    foreach ($item in $chunks) {
        $filePath = "$loc\$($item.File)"
        if (-not (Test-Path $filePath)) {
            Write-Host "  [MISSING] $filePath" -ForegroundColor Red
            $allPassed = $false
            continue
        }
        $c = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
        $hasTplState = ($c.Contains('formControlName=\"state_id\"') -or $c.Contains('formControlName="state_id"'))
        $hasFormState = ($c.Contains("state_id: ['") -or $c.Contains('state_id: ["') -or $c.Contains("state_id: ["))
        $hasProto = $c.Contains("onStateChange = function")

        $status = if ($hasTplState -and $hasFormState -and $hasProto) { "[PASS]" } else { "[FAIL]" }
        $color = if ($status -eq "[PASS]") { "Green" } else { "Red" }
        Write-Host "  $status $($item.Name) ($($item.File)) -> Tpl: $hasTplState, Form: $hasFormState, Proto: $hasProto" -ForegroundColor $color
        if ($status -eq "[FAIL]") {
            $allPassed = $false
        }
    }
}

if ($allPassed) {
    Write-Host "`n>>> ALL 12 CHUNKS AND MAIN.JS VALIDATED SUCCESSFULLY! <<<" -ForegroundColor Green
} else {
    Write-Host "`n>>> SOME CHUNKS FAILED VALIDATION! <<<" -ForegroundColor Red
}
