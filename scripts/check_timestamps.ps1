Get-ChildItem "C:\Users\rajes\StudioProjects\jbac_app\www\build\*.js" | Select-Object Name, Length, LastWriteTime | Select-Object -First 10 | Format-Table -AutoSize
