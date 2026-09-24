$configPath = "C:\Users\rajes\StudioProjects\jbac_app\config.xml"
$content = [System.IO.File]::ReadAllText($configPath, [System.Text.Encoding]::UTF8)
$content = $content -replace 'version="beta2"', 'version="0.0.2"'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($configPath, $content, $utf8NoBom)
Write-Output "Successfully updated config.xml version to 0.0.2"
