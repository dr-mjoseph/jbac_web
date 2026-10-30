import urllib.request, json

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

for tbl in ['pastor_reg', 'pastors_associations', 'business_table', 'marriages', 'jobs', 'church_reg', 'signup_form', 'student_reg', 'ministry_signup', 'independentorganisation_reg']:
    cols_res = run_sql(f'DESCRIBE `{tbl}`')['data']
    cols = [c['Field'] for c in cols_res]
    dist_col = 'districtname' if 'districtname' in cols else ('districts' if 'districts' in cols else 'district_id')
    try:
        q = f'SELECT COUNT(*) as cnt FROM `{tbl}` WHERE CAST({dist_col} AS UNSIGNED) >= 31 AND CAST({dist_col} AS UNSIGNED) <= 63 AND (state_id = 1 OR state = "Andhra Pradesh")'
        r = run_sql(q)['data'][0]['cnt']
        print(f'{tbl} (col: {dist_col}): {r} rows with Telangana district wrongly marked as AP')
    except Exception as e:
        print(f'{tbl}: {e}')
