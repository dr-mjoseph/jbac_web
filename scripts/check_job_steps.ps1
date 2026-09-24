$headers = @{ "User-Agent" = "PowerShell" }
$runs = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs?per_page=1" -Headers $headers
$runId = $runs.workflow_runs[0].id
Write-Output "Latest Run ID: $runId ($($runs.workflow_runs[0].status) / $($runs.workflow_runs[0].conclusion))"
$run = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/jobs" -Headers $headers
$job = $run.jobs[0]
foreach ($s in $job.steps) {
    Write-Output "Step $($s.number): $($s.name) -> status=$($s.status), conclusion=$($s.conclusion)"
}
