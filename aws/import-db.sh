#!/bin/bash
set -e

# AWS RDS MySQL Database Import Script
# Usage: ./import-db.sh <RDS_ENDPOINT> [USERNAME] [DATABASE_NAME] [SQL_FILE]

HOSTNAME=${1:-""}
USERNAME=${2:-"admin"}
DATABASE_NAME=${3:-"jbac_jbac"}
SQL_FILE=${4:-"$(dirname "$0")/../database/jbac_structure.sql"}

if [ -z "$HOSTNAME" ]; then
  echo "Usage: ./import-db.sh <RDS_ENDPOINT> [USERNAME] [DATABASE_NAME] [SQL_FILE]"
  echo "Example: ./import-db.sh jbac-mysql-db.cxxxxxx.us-east-1.rds.amazonaws.com admin jbac_jbac"
  exit 1
fi

echo "=========================================="
echo "AWS RDS MySQL Database Import Utility"
echo "=========================================="
echo "Target Endpoint : $HOSTNAME:3306"
echo "Database Name   : $DATABASE_NAME"
echo "SQL File        : $SQL_FILE"
echo "User            : $USERNAME"

if [ ! -f "$SQL_FILE" ]; then
  echo "Error: Database SQL file not found at $SQL_FILE"
  exit 1
fi

echo "Importing into RDS MySQL (enter master password when prompted)..."
mysql -h "$HOSTNAME" -P 3306 -u "$USERNAME" -p --init-command="SET FOREIGN_KEY_CHECKS=0;" --default-character-set=utf8mb4 "$DATABASE_NAME" < "$SQL_FILE"

echo "Database $DATABASE_NAME successfully imported!"
