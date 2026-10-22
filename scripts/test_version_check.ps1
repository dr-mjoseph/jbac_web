$cfg = "C:\Users\rajes\StudioProjects\jbac_app\config.xml"
$c = Get-Content $cfg -Raw -Encoding UTF8
$m = [regex]::Match($c, 'version="([^"]+)"\s+android-versionCode="([^"]+)"')
if ($m.Success) {
    Write-Host "config.xml: version=$($m.Groups[1].Value), versionCode=$($m.Groups[2].Value)"
} else {
    $m2 = [regex]::Match($c, '<widget[^>]+>')
    Write-Host "config.xml widget tag: $($m2.Value)"
}

$gradle = "C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\build.gradle"
$cg = Get-Content $gradle -Raw -Encoding UTF8
$vc = [regex]::Match($cg, 'versionCode\s+(\d+)')
$vn = [regex]::Match($cg, 'versionName\s+"([^"]+)"')
Write-Host "build.gradle: versionCode=$($vc.Groups[1].Value), versionName=$($vn.Groups[1].Value)"
