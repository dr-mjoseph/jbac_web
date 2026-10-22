$env:PATH.Split(';') | ForEach-Object {
    if ($_ -and (Test-Path $_)) {
        Write-Host "PATH: $_"
        Get-ChildItem -Path $_ -Filter "*.exe" | ForEach-Object {
            if ($_.Name -like "*node*" -or $_.Name -like "*npm*" -or $_.Name -like "*python*") {
                Write-Host "   Found: $($_.FullName)"
            }
        }
    }
}
