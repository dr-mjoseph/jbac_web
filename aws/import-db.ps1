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
    [string]$SqlFile = ""
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "AWS RDS MySQL Database Import Utility" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Robust path resolution for database SQL dump
if ([string]::IsNullOrWhiteSpace($SqlFile) -or -not (Test-Path $SqlFile)) {
    $candidates = @(
        (Join-Path (Get-Location) "database\jbac_structure.sql"),
        (Join-Path $PSScriptRoot "..\database\jbac_structure.sql"),
        "database\jbac_structure.sql",
        "..\database\jbac_structure.sql"
    )
    foreach ($candidate in $candidates) {
        if (-not [string]::IsNullOrWhiteSpace($candidate) -and (Test-Path $candidate)) {
            $SqlFile = (Resolve-Path $candidate).Path
            break
        }
    }
}

if (-not (Test-Path $SqlFile)) {
    Write-Error "Database SQL file not found. Expected at: database\jbac_structure.sql"
    exit 1
}

Write-Host "Target Endpoint : ${Hostname}:3306" -ForegroundColor Yellow
Write-Host "Database Name   : $DatabaseName" -ForegroundColor Yellow
Write-Host "SQL File        : $SqlFile" -ForegroundColor Yellow
Write-Host "User            : $Username" -ForegroundColor Yellow

# Check for mysql client
$mysqlPath = "mysql"
$mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlCmd) {
    # Auto-detect installed MySQL in Program Files
    $knownLocations = @(
        "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.2\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.3\bin\mysql.exe"
    )
    foreach ($loc in $knownLocations) {
        if (Test-Path $loc) {
            $mysqlPath = $loc
            $mysqlCmd = $loc
            Write-Host "Found MySQL at: $loc" -ForegroundColor Cyan
            break
        }
    }
}

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
Get-Content -Path $SqlFile -Encoding UTF8 | & $mysqlPath -h $Hostname -P 3306 -u $Username -p --init-command="SET FOREIGN_KEY_CHECKS=0;" --default-character-set=utf8mb4 $DatabaseName

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Database $DatabaseName successfully restored to AWS RDS!" -ForegroundColor Green
} else {
    Write-Error "`n[FAILED] Database import exited with error code $LASTEXITCODE."
}
