$loc = "C:\Users\rajes\StudioProjects\jbac_app\www\build"

$chunks = @("main.js", "23.js", "13.js", "18.js", "16.js", "35.js", "38.js", "14.js", "22.js", "41.js", "37.js", "12.js", "32.js")

foreach ($f in $chunks) {
    $p = "$loc\$f"
    $c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
    
    # Check if there is literal \n near state_id: [
    $idx = $c.IndexOf('state_id: [')
    if ($idx -gt 0) {
        $snippet = $c.Substring($idx, 40)
        Write-Host "$($f): Form snippet -> '$snippet'"
    } else {
        Write-Host "$($f): state_id: [ NOT FOUND"
    }
}
