$tables = @(
    @{ name = 'users'; phoneCol = 'number'; passCol = 'otp'; nameCol = 'name' },
    @{ name = 'signup_form'; phoneCol = 'mobile_number'; passCol = 'password'; nameCol = 'fname' },
    @{ name = 'student_reg'; phoneCol = 'number'; passCol = 'password'; nameCol = 'studentname' },
    @{ name = 'ministry_signup'; phoneCol = 'headnmber'; passCol = 'password'; nameCol = 'ministryname' },
    @{ name = 'pastor_reg'; phoneCol = 'phonenumber'; passCol = 'password'; nameCol = 'pastorname' },
    @{ name = 'church_reg'; phoneCol = 'contactnumber'; passCol = 'password'; nameCol = 'church_name' },
    @{ name = 'independentorganisation_reg'; phoneCol = 'contact_num'; passCol = 'password'; nameCol = 'organisation_name' },
    @{ name = 'pastors_associations'; phoneCol = 'phonenumber'; passCol = 'password'; nameCol = 'paname' }
)

foreach ($t in $tables) {
    $uri = "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/crud/$($t.name)?limit=3"
    $r = Invoke-RestMethod -Uri $uri
    Write-Host "=== $($t.name) (Total: $($r.total)) ==="
    foreach ($row in $r.data) {
        $p = $row.($t.phoneCol)
        $pass = $row.($t.passCol)
        $n = $row.($t.nameCol)
        Write-Host "  ID: $($row.id) | Name: $n | Phone: $p | Pass: $pass"
    }
}
