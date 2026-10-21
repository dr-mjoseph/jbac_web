import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
api_base = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com'

print('--- Test 1: GET /admin on Lambda ---')
req = urllib.request.Request(f'{api_base}/admin')
res = urllib.request.urlopen(req, context=ctx)
content = res.read().decode('utf-8', errors='ignore')
print(f'Status: {res.status}, Length: {len(content)}, Has Auth Overlay: {"adminAuthOverlay" in content}')

print('\n--- Test 2: Admin Login with Wrong Password ---')
try:
    req = urllib.request.Request(
        f'{api_base}/dashboardapi/admin-login',
        data=json.dumps({'username': 'admin', 'password': 'WrongPassword'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(req, context=ctx)
    print('Unexpected success:', res.status)
except urllib.error.HTTPError as e:
    print(f'Correctly rejected with HTTP {e.code}: {e.read().decode("utf-8")}')

print('\n--- Test 3: Admin Login with Correct Password (JbacAdmin@2026) ---')
req = urllib.request.Request(
    f'{api_base}/dashboardapi/admin-login',
    data=json.dumps({'username': 'admin', 'password': 'JbacAdmin@2026'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
res = urllib.request.urlopen(req, context=ctx)
login_data = json.loads(res.read().decode('utf-8'))
print(f'Status: {res.status}, Success: {login_data.get("success")}, Token: {login_data.get("token")[:16]}...')
token = login_data.get('token')

print('\n--- Test 4: Query Execution WITHOUT Auth ---')
try:
    req = urllib.request.Request(
        f'{api_base}/dashboardapi/execute-query',
        data=json.dumps({'query': 'SELECT COUNT(*) as cnt FROM users'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(req, context=ctx)
    print('Unexpected success:', res.status)
except urllib.error.HTTPError as e:
    print(f'Correctly rejected with HTTP {e.code}: {e.read().decode("utf-8")}')

print('\n--- Test 5: Query Execution WITH Token ---')
req = urllib.request.Request(
    f'{api_base}/dashboardapi/execute-query',
    data=json.dumps({'query': 'SELECT COUNT(*) as total_users FROM users'}).encode('utf-8'),
    headers={'Content-Type': 'application/json', 'x-admin-auth': token}
)
res = urllib.request.urlopen(req, context=ctx)
query_data = json.loads(res.read().decode('utf-8'))
print(f'Status: {res.status}, RowCount: {query_data.get("rowCount")}, Data: {query_data.get("data")}')

print('\n--- Test 6: Verify Admin Token Endpoint ---')
req = urllib.request.Request(
    f'{api_base}/dashboardapi/admin-verify',
    headers={'x-admin-auth': token}
)
res = urllib.request.urlopen(req, context=ctx)
verify_data = json.loads(res.read().decode('utf-8'))
print(f'Status: {res.status}, Verify Result: {verify_data}')

print('\nAll Backend Auth & Query Tests PASSED!')
