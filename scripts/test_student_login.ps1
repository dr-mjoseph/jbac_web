$body = @{
    category = "2"
    mobile_number = "8886814149"
    password = "raj123"
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/passwordwebsitelogin" -Method Post -Body $body -ContentType "application/json"
    $res | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
