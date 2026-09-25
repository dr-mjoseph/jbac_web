$body = @{
    category = "1"
    mobile_number = "9281506386"
    password = "9281506386"
} | ConvertTo-Json

$res = Invoke-RestMethod -Uri "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/passwordwebsitelogin" -Method Post -Body $body -ContentType "application/json"
$res | ConvertTo-Json
