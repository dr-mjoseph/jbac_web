import urllib.request
import json

# Test against local server endpoint simulation or script
print("=== Testing User Type Isolation Logic ===")
# We can import db or test queries directly using mysql.connector
import os

db_host = "database-1.cv2s640y0004.ap-southeast-2.rds.amazonaws.com"
db_user = "admin"
db_pass = "jbac_2026_rds"
db_name = "jbac_jbac"

try:
    import mysql.connector
    conn = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_pass,
        database=db_name
    )
    cursor = conn.cursor(dictionary=True)
    print("[DB] Connected to AWS RDS successfully.")

    # Test 1: Pastor Sample (usr_id: 1438, District 40)
    # Target level: 3 (Constituency)
    # When user_type == 'pastor':
    # Only pastor_reg should be queried
    cursor.execute("""
        SELECT pr.id, pr.pastorname, pr.generaltype, pr.leadertype, pr.district_id, pr.constituency_id
        FROM pastor_reg pr
        WHERE pr.district_id = 40
          AND (pr.generaltype = 2 OR pr.generaltype = '2' OR pr.generaltype = 'Constituency')
          AND (COALESCE(pr.leadertype, '1') != '2' AND (pr.wingtypes IS NULL OR pr.wingtypes IN ('', 'null', 'undefined')))
          AND COALESCE(pr.approval_ind, 0) != 2
          AND pr.id != 1438
    """)
    pastors = cursor.fetchall()
    print(f"Pastor 1438 -> Subordinate Pastors count: {len(pastors)}")
    for p in pastors:
        print(f"  - Pastor: ID={p['id']}, Name={p['pastorname']}, generaltype={p['generaltype']}")

    assert len(pastors) == 1, f"Expected 1 pastor subordinate, got {len(pastors)}"
    assert pastors[0]['pastorname'] == 'sample1', f"Expected sample1, got {pastors[0]['pastorname']}"

    print("[SUCCESS] Live DB verification passed! Subordinate Pastors properly isolated to sample1 only.")
    conn.close()
except Exception as e:
    print(f"[ERROR] {e}")

