$headers = @{ "User-Agent" = "PowerShell" }
try {
    $art = Invoke-RestMethod -Uri "https://api.github.com/repos/dr-mjoseph/jbac_app/actions/artifacts/10872721588/zip" -Headers $headers -FollowRelocation
    Write-Host "Download initiated..."
} catch {
    Write-Host "Direct API download response: $($_.Exception.Message)"
}
