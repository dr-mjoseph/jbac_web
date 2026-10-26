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

queries = [
    'UPDATE pastors_associations SET state_id = 2, state = "Telangana" WHERE CAST(districtname AS UNSIGNED) >= 31 AND CAST(districtname AS UNSIGNED) <= 63',
    'UPDATE marriages SET state_id = 2, state = "Telangana" WHERE CAST(district_id AS UNSIGNED) >= 31 AND CAST(district_id AS UNSIGNED) <= 63',
    'UPDATE pastor_reg SET state_id = 2, state = "Telangana" WHERE CAST(district_id AS UNSIGNED) >= 31 AND CAST(district_id AS UNSIGNED) <= 63',
    'UPDATE business_table SET state_id = 2, state = "Telangana" WHERE CAST(districtname AS UNSIGNED) >= 31 AND CAST(districtname AS UNSIGNED) <= 63',
    'UPDATE jobs SET state_id = 2, state = "Telangana" WHERE CAST(district_id AS UNSIGNED) >= 31 AND CAST(district_id AS UNSIGNED) <= 63',
    'UPDATE church_reg SET state_id = 2, state = "Telangana" WHERE CAST(district_id AS UNSIGNED) >= 31 AND CAST(district_id AS UNSIGNED) <= 63',
    'UPDATE signup_form SET state_id = 2, state = "Telangana" WHERE CAST(district_id AS UNSIGNED) >= 31 AND CAST(district_id AS UNSIGNED) <= 63',
    'UPDATE student_reg SET state_id = 2, state = "Telangana" WHERE CAST(district_id AS UNSIGNED) >= 31 AND CAST(district_id AS UNSIGNED) <= 63',
    'UPDATE ministry_signup SET state_id = 2, state = "Telangana" WHERE CAST(district_id AS UNSIGNED) >= 31 AND CAST(district_id AS UNSIGNED) <= 63',
    'UPDATE independentorganisation_reg SET state_id = 2, state = "Telangana" WHERE CAST(districts AS UNSIGNED) >= 31 AND CAST(districts AS UNSIGNED) <= 63'
]

for q in queries:
    res = run_sql(q)
    print(res.get('affectedRows', 0), 'rows updated for:', q[:40])

print('Done fixing existing Telangana rows.')
