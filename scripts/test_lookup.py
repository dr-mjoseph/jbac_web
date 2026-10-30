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

# Sample student
student = run_query("SELECT id, studentname, fathername, number, whatsapp, study, district_id, constituency_id, mandal_id, village_id, address, caste, gender, dob FROM student_reg WHERE number IS NOT NULL AND TRIM(number) != '' ORDER BY id DESC LIMIT 1")
print("Sample student:", student)

