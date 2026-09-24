$headers = @{ "User-Agent" = "PowerShell" }
$runId = 35988971742
$artifacts = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/artifacts" -Headers $headers
$art = $artifacts.artifacts[0]
Write-Output "Artifact: $($art.name) download url: $($art.archive_download_url)"
