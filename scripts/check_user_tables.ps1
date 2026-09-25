$tables = @('student_reg', 'ministry_signup', 'independentorganisation_reg', 'pastors_associations', 'church_reg', 'pastor_reg', 'signup_form')
foreach ($t in $tables) {
    $uri = "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/crud/$t"
    $r = Invoke-RestMethod -Uri $uri
    Write-Host "$t : $($r.data.Count) rows"
    if ($r.data.Count -gt 0) {
        $sample = $r.data[0]
        $props = ($sample.PSObject.Properties | Select-Object -ExpandProperty Name) -join ', '
        Write-Host "  Columns: $props"
        $ph = $sample.mobile_number
        if (-not $ph) { $ph = $sample.phonenumber }
        Write-Host "  First row id: $($sample.id), phone: $ph"
    }
}
