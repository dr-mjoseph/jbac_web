import urllib.request
import json
import base64

auth_str = base64.b64encode(b'admin:JbacAdmin@2026').decode()

def q(sql):
    req = urllib.request.Request(
        'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/api/query',
        data=json.dumps({'query': sql}).encode(),
        headers={'Content-Type': 'application/json', 'Authorization': f'Basic {auth_str}'}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

tables = q('SHOW TABLES')['data']
for t in tables:
    tbl_name = list(t.values())[0]
    try:
        desc = q(f'DESCRIBE `{tbl_name}`')['data']
        for col in desc:
            field = col['Field']
            ctype = col['Type'].lower()
            if 'char' in ctype or 'text' in ctype:
                sql_q = f"SELECT COUNT(*) as c FROM `{tbl_name}` WHERE `{field}` LIKE '%websiteimages%'"
                res = q(sql_q)
                cnt = res['data'][0]['c']
                if cnt > 0:
                    print(f"{tbl_name}.{field}: {cnt} rows")
    except Exception as e:
        pass
