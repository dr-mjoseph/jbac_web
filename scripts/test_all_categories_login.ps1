$testCases = @(
    @{ name = "Student Sandy"; cat = "2"; phone = "8886814149"; pass = "raj123" },
    @{ name = "Student Rajesh"; cat = "2"; phone = "9848229988"; pass = "raj123" },
    @{ name = "Believer Justy"; cat = "1"; phone = "9281506386"; pass = "9281506386" },
    @{ name = "Ministry Bermuda"; cat = "3"; phone = "9848998866"; pass = "bermuda@123" },
    @{ name = "Church Immanuel"; cat = "5"; phone = "9391316776"; pass = "sahayam1" },
    @{ name = "Pastors Assn Sudheer"; cat = "7"; phone = "9154545454"; pass = "sudh123" },
    @{ name = "Users Dr Joseph"; cat = "1"; phone = "9849482182"; pass = "6202" },
    @{ name = "Wrong Password Test"; cat = "2"; phone = "8886814149"; pass = "wrongpass" },
    @{ name = "Unregistered Phone Test"; cat = "1"; phone = "1111111111"; pass = "random" }
)

foreach ($tc in $testCases) {
    $body = @{
        category = $tc.cat
        mobile_number = $tc.phone
        password = $tc.pass
    } | ConvertTo-Json

    try {
        $res = Invoke-RestMethod -Uri "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/passwordwebsitelogin" -Method Post -Body $body -ContentType "application/json"
        Write-Host "[$($tc.name)]: Status $($res.status) | Message: $($res.message) | Name: $($res.data[0].name) | Cat: $($res.data[0].category)"
    } catch {
        Write-Host "[$($tc.name)]: ERROR - $($_.Exception.Message)"
    }
}
