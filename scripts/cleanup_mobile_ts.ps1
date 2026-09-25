$tsPath = "C:\Users\rajes\StudioProjects\jbac_app\src\pages\addmeetings\addmeetings.ts"
$c = [System.IO.File]::ReadAllText($tsPath, [System.Text.Encoding]::UTF8)

# Replace repeated properties
$pattern = '(?s)export class AddmeetingsPage \{.*?(?=districts: any;)'
$replacement = @"
export class AddmeetingsPage {
  form: FormGroup;
  locationLoading: boolean = false;
  locationError: string = '';
  locationSuccess: string = '';
  locationName: string = '';
  locationSourceMessage: string = '';
  
"@

$c = [System.Text.RegularExpressions.Regex]::Replace($c, $pattern, $replacement)
[System.IO.File]::WriteAllText($tsPath, $c, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Cleaned up addmeetings.ts properties."
