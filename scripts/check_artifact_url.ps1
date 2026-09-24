$headers = @{ "User-Agent" = "PowerShell" }
$headers = @{ "User-Agent" = "PowerShell" }
$runId = "36042234525"
$artifacts = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/artifacts" -Headers $headers
foreach ($art in $artifacts.artifacts) {
    Write-Output "Artifact Name: $($art.name) | Size: $([math]::Round($art.size_in_bytes/1MB, 2)) MB | ID: $($art.id)"
    Write-Output "Direct API Download: $($art.archive_download_url)"
}
Write-Output "GitHub Actions Run Link: https://github.com/dr-mjoseph/jbac_app/actions/runs/$runId"
