$u_rashtram = [regex]::Unescape("\u0C30\u0C3E\u0C37\u0C4D\u0C1F\u0C4D\u0C30\u0C02")
$u_anni = [regex]::Unescape("\u0C05\u0C28\u0C4D\u0C28\u0C40")
$u_ap = [regex]::Unescape("\u0C06\u0C02\u0C27\u0C4D\u0C30\u0C2A\u0C4D\u0C30\u0C26\u0C47\u0C36\u0C4D")
$u_tg = [regex]::Unescape("\u0C24\u0C46\u0C32\u0C02\u0C17\u0C3E\u0C23")

Write-Host "Rashtram chars:" ($u_rashtram.ToCharArray() | ForEach-Object { "U+{0:X4}" -f [int]$_ })
Write-Host "Anni chars:" ($u_anni.ToCharArray() | ForEach-Object { "U+{0:X4}" -f [int]$_ })
Write-Host "AP chars:" ($u_ap.ToCharArray() | ForEach-Object { "U+{0:X4}" -f [int]$_ })
Write-Host "TG chars:" ($u_tg.ToCharArray() | ForEach-Object { "U+{0:X4}" -f [int]$_ })
