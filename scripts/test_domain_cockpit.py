import urllib.request
import json

urls = [
    'https://www.jbac.in/admin',
    'https://www.jbac.in/admin/',
    'https://jbac.in/admin',
    'https://jbac.in/admin/',
    'https://www.jbac.in/public.html',
    'https://jbac.in/public.html',
    'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/admin'
]

print("=== CHECKING ALL DOMAIN AND LAMBDA ENDPOINTS ===")
for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            title = content.split('<title>')[1].split('</title>')[0] if '<title>' in content else 'None'
            is_cockpit = 'JBAC Cloud Database & Query Cockpit' in content
            is_overlay = 'adminAuthOverlay' in content
            print(f"Status: {resp.status} | Cockpit: {is_cockpit} | Overlay: {is_overlay} | URL: {u}")
    except Exception as e:
        print(f"FAILED | URL: {u} | Error: {e}")

print("\n=== TESTING ADMIN LOGIN API VIA BACKEND ===")
try:
    auth_req = urllib.request.Request(
        'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/admin-login',
        data=json.dumps({'username': 'admin', 'password': 'JbacAdmin@2026'}).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(auth_req, timeout=10) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print(f"API Result: success={res.get('success')} | role={res.get('role')} | token_received={bool(res.get('token'))}")
except Exception as e:
    print(f"API Login Error: {e}")
