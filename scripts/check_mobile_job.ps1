$headers = @{ "User-Agent" = "PowerShell" }
$run = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/36154001574" -Headers $headers
Write-Host "Run ID: $($run.id) | Status: $($run.status) | Conclusion: $($run.conclusion) | Commit: $($run.head_commit.message)"
$jobs = Invoke-RestMethod -Uri $run.jobs_url -Headers $headers
foreach ($j in $jobs.jobs) {
    Write-Host "  Job: $($j.name) (Status: $($j.status))"
    foreach ($s in $j.steps) {
        Write-Host "    - Step: $($s.name) [$($s.status) : $($s.conclusion)]"
    }
}
