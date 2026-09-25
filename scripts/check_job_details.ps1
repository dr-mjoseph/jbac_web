$headers = @{ "User-Agent" = "PowerShell" }
$runs = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_web/actions/runs?per_page=2" -Headers $headers
foreach ($r in $runs.workflow_runs) {
    Write-Host "Workflow: $($r.name) (Status: $($r.status))"
    $jobs = Invoke-RestMethod -Uri $r.jobs_url -Headers $headers
    foreach ($j in $jobs.jobs) {
        Write-Host "  Job: $($j.name) (Status: $($j.status))"
        foreach ($s in $j.steps) {
            Write-Host "    - Step: $($s.name) [$($s.status) : $($s.conclusion)]"
        }
    }
}
