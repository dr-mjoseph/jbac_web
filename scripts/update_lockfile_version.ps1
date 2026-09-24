$path = "C:\Users\rajes\StudioProjects\jbac_app\package-lock.json"
$lines = [System.IO.File]::ReadAllLines($path, [System.Text.Encoding]::UTF8)

# Update root package version at line 3 and line 9
for ($i = 0; $i -lt 15; $i++) {
    if ($lines[$i] -match '"version": "0.0.1"') {
        $lines[$i] = $lines[$i] -replace '"version": "0.0.1"', '"version": "0.0.1-beta.2"'
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines($path, $lines, $utf8NoBom)
Write-Output "Updated root version in package-lock.json successfully."
