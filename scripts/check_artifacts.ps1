$headers = @{ "User-Agent" = "PowerShell" }
$runs = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs?per_page=3" -Headers $headers
foreach ($r in $runs.workflow_runs) {
    Write-Host "Run ID: $($r.id) | Status: $($r.status) | Conclusion: $($r.conclusion)"
    $arts = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$($r.id)/artifacts" -Headers $headers
    foreach ($a in $arts.artifacts) {
        Write-Host "  - Artifact: $($a.name) | Size: $($a.size_in_bytes) bytes | ID: $($a.id) | Created: $($a.created_at)"
    }
}
