$apiUrl = "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/getdistricts"

Write-Host "Calling getdistricts with state_id: 1 (AP)..."
$resp1 = Invoke-RestMethod -Uri $apiUrl -Method Post -Body '{"state_id":1}' -ContentType "application/json"
Write-Host "AP Districts count: $($resp1.data.Count)"
if ($resp1.data.Count -gt 0) {
    Write-Host "First 3 AP: $($resp1.data[0..2].distrct_nm -join ', ')"
}

Write-Host "`nCalling getdistricts with state_id: 2 (TG)..."
$resp2 = Invoke-RestMethod -Uri $apiUrl -Method Post -Body '{"state_id":2}' -ContentType "application/json"
Write-Host "TG Districts count: $($resp2.data.Count)"
if ($resp2.data.Count -gt 0) {
    Write-Host "First 3 TG: $($resp2.data[0..2].distrct_nm -join ', ')"
}

Write-Host "`nCalling getdistricts with no state_id (All)..."
$respAll = Invoke-RestMethod -Uri $apiUrl -Method Post -Body '{}' -ContentType "application/json"
Write-Host "All Districts count: $($respAll.data.Count)"
