import urllib.request
import json
import hashlib

token = hashlib.sha256("admin:JbacAdmin@2026:jbac_cockpit_auth_secret_token_2026".encode('utf-8')).hexdigest()

def run_query(q):
    req = urllib.request.Request(
        'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query',
        data=json.dumps({'query': q}).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'x-admin-token': token}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

print("Adding enddate and event_id columns to adds_data...")
try:
    print(run_query("ALTER TABLE adds_data ADD COLUMN enddate varchar(255) DEFAULT NULL"))
except Exception as e:
    print("enddate add error:", e)

try:
    print(run_query("ALTER TABLE adds_data ADD COLUMN event_id int DEFAULT NULL"))
except Exception as e:
    print("event_id add error:", e)

# Backfill enddate for meetings in adds_data matching events table
print("Backfilling enddate from events...")
backfill_q = """
UPDATE adds_data a
JOIN events e ON (a.image = e.image OR a.title COLLATE utf8mb4_unicode_ci = e.orgname COLLATE utf8mb4_unicode_ci)
SET a.enddate = e.enddate, a.event_id = e.id
WHERE LOWER(a.type) LIKE '%meet%' AND e.enddate IS NOT NULL AND e.enddate != ''
"""
print(run_query(backfill_q))

# Check the results
print("Updated adds_data meetings:")
print(run_query("SELECT id, type, title, enddate, event_id FROM adds_data WHERE LOWER(type) LIKE '%meet%' ORDER BY id DESC LIMIT 15"))

