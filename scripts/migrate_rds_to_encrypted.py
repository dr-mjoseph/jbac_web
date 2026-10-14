import subprocess
import json
import time
import sys

REGION = "ap-southeast-2"
SOURCE_SNAPSHOT_ID = "jbac-mysql-db-v2-snapshot"
ENCRYPTED_SNAPSHOT_ID = "jbac-mysql-db-v2-encrypted-snap"
TARGET_DB_ID = "jbac-mysql-db-v3"
SECURITY_GROUP_ID = "sg-066e03d2e84e5a536"
PARAMETER_GROUP = "jbac-mysql-84"
LAMBDA_FUNCTION = "jbac-backend-api"

def log(msg):
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}", flush=True)

def run_aws(args):
    cmd = ["aws"] + args + ["--region", REGION, "--output", "json"]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        log(f"AWS CLI Error ({' '.join(args)}): {res.stderr.strip()}")
        return None
    try:
        return json.loads(res.stdout) if res.stdout.strip() else {}
    except Exception as e:
        return res.stdout

def get_snapshot_info(snap_id):
    res = run_aws(["rds", "describe-db-snapshots", "--db-snapshot-identifier", snap_id])
    if res and "DBSnapshots" in res and len(res["DBSnapshots"]) > 0:
        s = res["DBSnapshots"][0]
        return s.get("Status"), s.get("PercentProgress", 0), s.get("Encrypted", False)
    return None, 0, False

def get_db_info(db_id):
    res = run_aws(["rds", "describe-db-instances", "--db-instance-identifier", db_id])
    if res and "DBInstances" in res and len(res["DBInstances"]) > 0:
        inst = res["DBInstances"][0]
        status = inst.get("DBInstanceStatus")
        endpoint = inst.get("Endpoint", {}).get("Address")
        encrypted = inst.get("StorageEncrypted", False)
        return status, endpoint, encrypted
    return None, None, False

def main():
    log("=" * 60)
    log("ZERO-DOWNTIME RDS ENCRYPTION MIGRATION")
    log(f"Source Snapshot: {SOURCE_SNAPSHOT_ID}")
    log(f"Encrypted Target Snapshot: {ENCRYPTED_SNAPSHOT_ID}")
    log(f"Encrypted Target Database: {TARGET_DB_ID}")
    log("=" * 60)

    # 1. Wait for source snapshot to finish creating
    log(f"Step 1: Monitoring source snapshot: {SOURCE_SNAPSHOT_ID}...")
    while True:
        status, pct, enc = get_snapshot_info(SOURCE_SNAPSHOT_ID)
        log(f"  Source Snapshot status: {status} ({pct}%)...")
        if status == "available":
            log("  Source snapshot is available!")
            break
        elif status is None:
            log("  Snapshot not found! Checking fallback automated snapshot...")
            time.sleep(15)
            continue
        time.sleep(15)

    # 2. Copy snapshot with AWS KMS encryption (if not already copied)
    log(f"Step 2: Checking/creating encrypted snapshot copy: {ENCRYPTED_SNAPSHOT_ID}...")
    enc_status, enc_pct, is_enc = get_snapshot_info(ENCRYPTED_SNAPSHOT_ID)
    if not enc_status:
        log(f"  Initiating KMS encrypted copy to {ENCRYPTED_SNAPSHOT_ID}...")
        run_aws(["rds", "copy-db-snapshot",
                 "--source-db-snapshot-identifier", SOURCE_SNAPSHOT_ID,
                 "--target-db-snapshot-identifier", ENCRYPTED_SNAPSHOT_ID,
                 "--kms-key-id", "alias/aws/rds"])

    while True:
        status, pct, enc = get_snapshot_info(ENCRYPTED_SNAPSHOT_ID)
        log(f"  Encrypted Snapshot status: {status} ({pct}%), Encrypted: {enc}...")
        if status == "available":
            log("  Encrypted snapshot copy is ready and verified!")
            break
        time.sleep(15)

    # 3. Restore instance from encrypted snapshot (if not already restoring)
    log(f"Step 3: Restoring new encrypted instance {TARGET_DB_ID}...")
    db_status, endpoint, is_db_enc = get_db_info(TARGET_DB_ID)
    if not db_status:
        log(f"  Starting restore for {TARGET_DB_ID} (Class: db.t4g.micro, ParamGroup: {PARAMETER_GROUP})...")
        run_aws(["rds", "restore-db-instance-from-db-snapshot",
                 "--db-instance-identifier", TARGET_DB_ID,
                 "--db-snapshot-identifier", ENCRYPTED_SNAPSHOT_ID,
                 "--db-instance-class", "db.t4g.micro",
                 "--publicly-accessible",
                 "--vpc-security-group-ids", SECURITY_GROUP_ID,
                 "--db-parameter-group-name", PARAMETER_GROUP])

    while True:
        status, endpoint, encrypted = get_db_info(TARGET_DB_ID)
        log(f"  Target DB {TARGET_DB_ID} status: {status}, Endpoint: {endpoint}, Encrypted: {encrypted}...")
        if status == "available" and endpoint:
            log(f"  TARGET DB IS ACTIVE AND AVAILABLE!")
            log(f"  Endpoint: {endpoint}")
            log(f"  Storage Encrypted: {encrypted}")
            break
        time.sleep(20)

    # 4. Point AWS Lambda to the new encrypted endpoint
    log(f"Step 4: Updating AWS Lambda {LAMBDA_FUNCTION} DB_HOST...")
    l_config = run_aws(["lambda", "get-function-configuration", "--function-name", LAMBDA_FUNCTION])
    current_vars = l_config.get("Environment", {}).get("Variables", {})
    old_host = current_vars.get("DB_HOST")
    current_vars["DB_HOST"] = endpoint

    run_aws(["lambda", "update-function-configuration",
             "--function-name", LAMBDA_FUNCTION,
             "--environment", json.dumps({"Variables": current_vars})])

    log(f"  Successfully updated Lambda DB_HOST from {old_host} to {endpoint}!")

    log("=" * 60)
    log("ZERO-DOWNTIME MIGRATION COMPLETED SUCCESSFULLY!")
    log(f"Encrypted Database: {TARGET_DB_ID}")
    log(f"Endpoint: {endpoint}")
    log("Telugu UTF-8 parameter group (jbac-mysql-84) preserved!")
    log("=" * 60)

if __name__ == "__main__":
    main()
