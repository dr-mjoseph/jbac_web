import urllib.request
import json
import base64

url = "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query"
auth_header = "Basic " + base64.b64encode(b"admin:JbacAdmin@2026").decode('ascii')

queries = [
    "SELECT * FROM wings LIMIT 5;",
    "SELECT * FROM wingleaderstype LIMIT 5;"
]

for q in queries:
    req = urllib.request.Request(url, data=json.dumps({"query": q}).encode('utf-8'), headers={
        "Content-Type": "application/json",
        "Authorization": auth_header,
        "x-admin-auth": "true",
        "User-Agent": "Mozilla/5.0"
    })
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            print("Query:", q)
            print("Row count:", len(data.get("data", [])))
            for row in data.get("data", []):
                print("  ", row)
    except Exception as e:
        print("Error running query:", e)
