$file = "C:\Users\rajes\StudioProjects\jbac_app\platforms\android\cdv-gradle-config.json"
$cfg = Get-Content $file -Raw | ConvertFrom-Json
$cfg | Add-Member -Name "BUILD_TOOLS_VERSION" -Value "30.0.3" -MemberType NoteProperty -Force
$json = $cfg | ConvertTo-Json -Depth 5
Set-Content -Path $file -Value $json

Write-Output "Successfully updated cdv-gradle-config.json:"
Get-Content $file
