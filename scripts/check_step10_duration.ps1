$headers = @{ "User-Agent" = "PowerShell" }
$runId = 35992258407
$jobs = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/jobs" -Headers $headers
$step10 = $jobs.jobs[0].steps | Where-Object { $_.number -eq 10 }
Write-Output "Step 10 started: $($step10.started_at), completed: $($step10.completed_at)"
