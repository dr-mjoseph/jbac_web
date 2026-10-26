import urllib.request, json, base64, subprocess

def run_sql(query):
    req = urllib.request.Request(
        'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query',
        headers={'Content-Type': 'application/json'},
        data=json.dumps({
            'adminUsername': 'admin',
            'adminPassword': 'JbacAdmin@2026',
            'query': query
        }).encode('utf-8')
    )
    res = urllib.request.urlopen(req)
    return json.loads(res.read().decode('utf-8'))

rows = run_sql('SELECT id, LEFT(image, 40) as pfx, LENGTH(image) as sz FROM adds_data WHERE image IS NOT NULL AND LENGTH(image) > 0')['data']
print('Total rows with images in adds_data:', len(rows))
large_rows = [r for r in rows if r['sz'] and r['sz'] > 1000]
print('Large image rows:', len(large_rows))
for r in large_rows[:15]:
    print(r)
