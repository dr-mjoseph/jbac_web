$headers = @{ "User-Agent" = "PowerShell" }
$runs = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_web/actions/runs?per_page=5" -Headers $headers
foreach ($r in $runs.workflow_runs) {
    Write-Host "Name: $($r.name) | Status: $($r.status) | Conclusion: $($r.conclusion) | Commit: $($r.head_commit.message)"
}
