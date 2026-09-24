$headers = @{ "User-Agent" = "PowerShell" }
$run = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/35984552942/jobs" -Headers $headers
foreach ($job in $run.jobs) {
    Write-Output "Job: $($job.name) -> $($job.conclusion)"
    foreach ($step in $job.steps) {
        Write-Output "  Step $($step.number): $($step.name) -> $($step.conclusion)"
    }
}
