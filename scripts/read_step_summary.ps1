$headers = @{ "User-Agent" = "PowerShell" }
$runId = 35991931328
$jobs = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/jobs" -Headers $headers
$job = $jobs.jobs[0]
Write-Output "Job: $($job.name) | Conclusion: $($job.conclusion)"

$checkSuiteId = $job.check_run_url
if ($checkSuiteId) {
    $checkRun = Invoke-RestMethod -Uri $checkSuiteId -Headers $headers
    Write-Output "=== CHECK RUN SUMMARY ==="
    Write-Output $checkRun.output.summary
    Write-Output "=== CHECK RUN TEXT ==="
    Write-Output $checkRun.output.text
}
