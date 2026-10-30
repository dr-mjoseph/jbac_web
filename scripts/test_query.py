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

print("Believer leaders count by generaltype:")
print(run_query("SELECT generaltype, count(*) FROM signup_form WHERE leadership = 'YES' OR leadertype IS NOT NULL GROUP BY generaltype"))

print("Pastor leaders count by generaltype:")
print(run_query("SELECT generaltype, count(*) FROM pastor_reg WHERE leadership = 'YES' OR leadertype IS NOT NULL GROUP BY generaltype"))
