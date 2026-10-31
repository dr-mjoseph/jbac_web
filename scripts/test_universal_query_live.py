import urllib.request
import json

# We can query all records and test our logic in Python
url = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/getLeaderswebsiteData'

payload = json.dumps({}).encode('utf-8')
req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())
    all_pastors = data['data'][2]

print(f'Total pastors in DB: {len(all_pastors)}')

# Let us simulate the query for Pastor 1438 (Sample):
# logged_in_canonical_level = 2 (District Leader)
# targetLevel = 3 (Constituency Leader)
# leader_type = 'general'
# district_id = 40
# currentUserId = 1438

matches = []
for pr in all_pastors:
    # 1. Self check
    if str(pr.get('id')) == '1438':
        continue
    # 2. Rejected check
    if str(pr.get('approval_ind')) == '2':
        continue
    # 3. Geo check: district_id == 40
    if str(pr.get('district_id')) != '40':
        continue
    # 4. Target Level check (targetLevel == 3 -> Constituency Leader):
    gen = str(pr.get('generaltype') or '')
    lt = str(pr.get('leadertype') or '1')
    wt = str(pr.get('wingtype') or '')
    is_lvl_3 = (gen in ['2', 'Constituency Level'] or 'నియోజకవర్గ' in gen or (lt == '2' and (wt in ['2', 'Constituency Level'] or 'నియోజకవర్గ' in wt)))
    if not is_lvl_3:
        continue
    # 5. Leader type check (leader_type == 'general'):
    wtypes = str(pr.get('wingtypes') or '').strip().lower()
    is_general = (lt != '2') and (wtypes in ['', 'none', 'null', 'undefined'])
    if not is_general:
        continue

    matches.append(pr)

print(f'Filtered matches for District Leader 1438 in District 40: {len(matches)}')
for m in matches:
    print(' ->', m.get('id'), m.get('pastorname'), 'gen:', m.get('generaltype'), 'lt:', m.get('leadertype'), 'const:', m.get('constituency_name'))

