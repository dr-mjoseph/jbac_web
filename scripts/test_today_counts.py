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

for t in ['signup_form', 'pastor_reg', 'church_reg', 'student_reg', 'ministry_signup', 'independentorganisation_reg', 'users']:
    total = run_query(f"SELECT COUNT(*) as cnt FROM `{t}`")['data'][0]['cnt']
    today = run_query(f"SELECT COUNT(*) as cnt FROM `{t}` WHERE cts LIKE '2026-10-28%'")['data'][0]['cnt']
    yesterday = run_query(f"SELECT COUNT(*) as cnt FROM `{t}` WHERE cts LIKE '2026-10-27%'")['data'][0]['cnt']
    print(f"{t}: Total={total}, Today(2026-10-28)={today}, Yesterday(2026-10-27)={yesterday}")

