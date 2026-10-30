import hashlib
import urllib.request
import json
import sys

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'JbacAdmin@2026'
ADMIN_AUTH_SECRET = 'jbac_cockpit_auth_secret_token_2026'

token = hashlib.sha256(f"{ADMIN_USERNAME}:{ADMIN_PASSWORD}:{ADMIN_AUTH_SECRET}".encode('utf-8')).hexdigest()

def execute(sql):
    url = "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query"
    payload = json.dumps({"query": sql}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={
        "Content-Type": "application/json",
        "x-admin-token": token
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            text = resp.read().decode('utf-8')
            data = json.loads(text)
            print("Status:", resp.status)
            print(json.dumps(data, indent=2))
            return data
    except Exception as e:
        print("Error:", e)
        if hasattr(e, 'read'):
            try:
                print("Error body:", e.read().decode('utf-8'))
            except:
                pass
        return None

if __name__ == '__main__':
    sql = sys.argv[1] if len(sys.argv) > 1 else "SELECT COUNT(*) FROM institutes"
    execute(sql)
