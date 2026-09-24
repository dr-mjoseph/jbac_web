$headers = @{ "User-Agent" = "PowerShell" }
$runId = 35992723154
$run = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/jobs" -Headers $headers
$job = $run.jobs[0]
Write-Output "Job: $($job.name) | Status: $($job.status) | Conclusion: $($job.conclusion)"
foreach ($step in $job.steps) {
    Write-Output "  Step $($step.number): $($step.name) -> status=$($step.status), conclusion=$($step.conclusion)"
}
