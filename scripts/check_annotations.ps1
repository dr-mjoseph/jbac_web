$headers = @{ "User-Agent" = "PowerShell" }
$runId = 36017161452
$jobs = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/jobs" -Headers $headers
$job = $jobs.jobs[0]
Write-Output "Job: $($job.name) | Conclusion: $($job.conclusion)"

$checkSuiteId = $job.check_run_url
if ($checkSuiteId) {
    $annotationsUrl = "$checkSuiteId/annotations"
    $annotations = Invoke-RestMethod -Uri $annotationsUrl -Headers $headers
    Write-Output "Annotations count: $($annotations.Count)"
    foreach ($ann in $annotations) {
        Write-Output "Annotation: $($ann.title) | $($ann.message)"
    }
}
