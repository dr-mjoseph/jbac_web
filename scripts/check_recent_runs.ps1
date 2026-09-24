$headers = @{ "User-Agent" = "PowerShell" }
$runs = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs?per_page=3" -Headers $headers
foreach ($r in $runs.workflow_runs) {
    Write-Output "Run ID: $($r.id) | Status: $($r.status) | Conclusion: $($r.conclusion) | Commit: $($r.head_sha.Substring(0,7)) | Msg: $($r.head_commit.message)"
}
