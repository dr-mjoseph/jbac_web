$errors = $null
$tokens = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile("C:\Users\rajes\Documents\jbac_web\scripts\build_and_sign_release_v37.ps1", [ref]$tokens, [ref]$errors)
if ($errors.Count -gt 0) {
    Write-Host "Parser Errors: $($errors.Count)" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host $_.Message -ForegroundColor Red }
} else {
    Write-Host "No syntax errors found in build_and_sign_release_v37.ps1!" -ForegroundColor Green
}
