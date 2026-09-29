$apksigner = "C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\apksigner.bat"
$aapt = "C:\Users\rajes\AppData\Local\Android\Sdk\build-tools\30.0.3\aapt.exe"
$apk = "C:\Users\rajes\StudioProjects\jbac_app\jbacApp-0.0.23.apk"

Write-Output "APK Badging:"
& $aapt dump badging $apk | Select-Object -First 3

Write-Output "`nApksigner Verify:"
& $apksigner verify --verbose $apk
