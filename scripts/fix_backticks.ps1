$path = "C:\Users\rajes\StudioProjects\jbac_app\.github\workflows\build-apk.yml"
$lines = [System.IO.File]::ReadAllLines($path, [System.Text.Encoding]::UTF8)
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "echo '`'") {
        $lines[$i] = $lines[$i] -replace "echo '`'", "echo '```'"
    }
}
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines($path, $lines, $utf8NoBom)
Write-Output "Fixed backticks successfully."
