$headers = @{ "User-Agent" = "PowerShell" }
$runId = 35989620777
$artifacts = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/runs/$runId/artifacts" -Headers $headers
$artId = $artifacts.artifacts[0].id

# Try to download artifact archive
$url = "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/artifacts/$artId/zip"
Write-Output "Download URL: $url"
try {
    $wc = New-Object System.Net.WebClient
    $wc.Headers.Add("User-Agent", "PowerShell")
    $wc.DownloadFile($url, "c:\Users\rajes\Documents\jbac_web\build-log.zip")
    Write-Output "Downloaded build-log.zip successfully!"
    Expand-Archive -Path "c:\Users\rajes\Documents\jbac_web\build-log.zip" -DestinationPath "c:\Users\rajes\Documents\jbac_web\build-log-extracted" -Force
    Get-Content "c:\Users\rajes\Documents\jbac_web\build-log-extracted\build.log" | Select-Object -First 50 | ForEach-Object { Write-Output $_ }
} catch {
    Write-Output "Download error: $_"
}
