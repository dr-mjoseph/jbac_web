$content = @"
storeFile=C:/Users/rajes/StudioProjects/jbac_app/Jbac.keystore
storePassword=123456
keyAlias=jbac
keyPassword=123456
storeType=jks
"@

Set-Content -Path "C:\Users\rajes\StudioProjects\jbac_app\platforms\android\release-signing.properties" -Value $content
Set-Content -Path "C:\Users\rajes\StudioProjects\jbac_app\release-signing.properties" -Value $content

Write-Output "Created release-signing.properties in platforms/android and jbac_app root."
