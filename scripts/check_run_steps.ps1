$headers = @{ "User-Agent" = "PowerShell" }
$runId = 35992723154
$jobs = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/jobs" -Headers $headers
$job = $jobs.jobs[0]
foreach ($s in $job.steps) {
    Write-Output "Step $($s.number): $($s.name) -> status=$($s.status), conclusion=$($s.conclusion)"
}
