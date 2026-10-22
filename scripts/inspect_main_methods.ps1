$main = Get-Content "C:\Users\rajes\StudioProjects\jbac_app\www\build\main.js" -Raw -Encoding UTF8
Write-Host "Contains searchjobswise:" ($main.Contains("searchjobswise"))
Write-Host "Contains getjobs:" ($main.Contains("getjobs"))
Write-Host "Contains getorganizations:" ($main.Contains("getorganizations"))
