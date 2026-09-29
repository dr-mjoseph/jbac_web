$src = "C:\Users\rajes\StudioProjects\jbac_app\www"
$dst = "C:\Users\rajes\StudioProjects\jbac_app\platforms\android\app\src\main\assets\www"

Write-Output "Syncing web assets from $src to $dst..."

# Remove old files except cordova.js, cordova_plugins.js
Get-ChildItem $dst -File | Where-Object { $_.Name -notmatch "^cordova" } | Remove-Item -Force

# Copy updated distribution from www
Copy-Item -Path "$src\*" -Destination $dst -Recurse -Force

Write-Output "Web assets successfully synced to platforms/android."
Get-ChildItem $dst | Select-Object Name, Length, LastWriteTime
