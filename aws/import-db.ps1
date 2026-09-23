<#
.SYNOPSIS
    Imports the MySQL database dump (jbac_structure.sql) into AWS RDS MySQL instance.

.PARAMETER Hostname
    AWS RDS endpoint address (e.g. jbac-mysql-db.cxxxxxx.us-east-1.rds.amazonaws.com)

.PARAMETER Username
    Master username (default: admin)

.PARAMETER DatabaseName
    Target database name (default: jbac_jbac)

.PARAMETER SqlFile
    Path to SQL dump file (default: ../database/jbac_structure.sql)
#>
param (
    [Parameter(Mandatory=$true, HelpMessage="Enter your AWS RDS MySQL endpoint address")]
    [string]$Hostname,

    [Parameter(Mandatory=$false)]
    [string]$Username = "admin",

    [Parameter(Mandatory=$false)]
    [string]$DatabaseName = "jbac_jbac",

    [Parameter(Mandatory=$false)]
    [string]$SqlFile = "$PSScriptRoot/../database/jbac_structure.sql"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "AWS RDS MySQL Database Import Utility" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

if (-not (Test-Path $SqlFile)) {
    Write-Error "Database SQL file not found at: $SqlFile"
    exit 1
}

Write-Host "Target Endpoint : $Hostname:3306" -ForegroundColor Yellow
Write-Host "Database Name   : $DatabaseName" -ForegroundColor Yellow
Write-Host "SQL File        : $SqlFile" -ForegroundColor Yellow
Write-Host "User            : $Username" -ForegroundColor Yellow

# Check for mysql client
$mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlCmd) {
    Write-Warning "'mysql' CLI client not found in PATH."
    Write-Host "You can import via any of the following methods:" -ForegroundColor White
    Write-Host "1. Install MySQL CLI: winget install Oracle.MySQL"
    Write-Host "2. Use MySQL Workbench / DBeaver / Navicat:"
    Write-Host "   - Host: $Hostname, Port: 3306, User: $Username, Database: $DatabaseName"
    Write-Host "   - Run 'Server' -> 'Data Import' -> choose '$SqlFile'"
    Write-Host "3. Or use Docker to run the import command:"
    Write-Host "   docker run -i --rm mysql:8 mysql -h $Hostname -u $Username -p $DatabaseName < $SqlFile"
    exit 0
}

Write-Host "`nImporting database into AWS RDS (you will be prompted for your RDS master password)..." -ForegroundColor Green
Get-Content -Path $SqlFile -Encoding UTF8 | & mysql -h $Hostname -P 3306 -u $Username -p --default-character-set=utf8mb4 $DatabaseName

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Database $DatabaseName successfully restored to AWS RDS!" -ForegroundColor Green
} else {
    Write-Error "`n[FAILED] Database import exited with error code $LASTEXITCODE."
}
