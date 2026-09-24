$headers = @{ "User-Agent" = "PowerShell" }
$runId = 35988971742
$run = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/jobs" -Headers $headers
$job = $run.jobs[0]
foreach ($s in $job.steps) {
    Write-Output "Step $($s.number): $($s.name) -> status=$($s.status), conclusion=$($s.conclusion)"
}
