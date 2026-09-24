$headers = @{ "User-Agent" = "PowerShell" }
$runId = 36022648213
$artifacts = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/artifacts" -Headers $headers
Write-Output "Artifacts count: $($artifacts.total_count)"
foreach ($a in $artifacts.artifacts) {
    Write-Output "  - $($a.name): $($a.size_in_bytes) bytes"
}
