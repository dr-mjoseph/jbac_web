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

# Look at district 22 leaders in pastor_reg and signup_form
print("District 22 Pastors:")
pastors = run_query("""
SELECT pr.id, pr.pastorname, pr.phonenumber, pr.generaltype, pr.leadership, pr.leadertype,
       COALESCE(c.const_nm, '') as constituency_name,
       COALESCE(m.mndl_nm, '') as mandal_name,
       COALESCE(p.pnchyt_nm, '') as panchayat_name
FROM pastor_reg pr
LEFT JOIN const_dtl_t c ON pr.constituency_id = c.id
LEFT JOIN mndls_lst_t m ON pr.mandal_id = m.id
LEFT JOIN pnchyt_lst_t p ON pr.village_id = p.id
WHERE pr.district_id = '22' AND (LOWER(COALESCE(pr.leadership, '')) = 'yes' OR pr.leadertype = '1' OR pr.generaltype IS NOT NULL)
""")
print("Pastors count:", pastors.get('rowCount'), pastors.get('data')[:3])

print("District 22 Believers:")
believers = run_query("""
SELECT s.id, s.fname, s.mobile_number, s.generaltype, s.leadership, s.leadertype,
       COALESCE(c.const_nm, '') as constituency_name,
       COALESCE(m.mndl_nm, '') as mandal_name,
       COALESCE(p.pnchyt_nm, '') as panchayat_name
FROM signup_form s
LEFT JOIN const_dtl_t c ON s.constituency_id = c.id
LEFT JOIN mndls_lst_t m ON s.mandal_id = m.id
LEFT JOIN pnchyt_lst_t p ON s.panchayat_id = p.id
WHERE s.district_id = '22' AND (LOWER(COALESCE(s.leadership, '')) = 'yes' OR s.leadertype = '1' OR s.generaltype IS NOT NULL)
""")
print("Believers count:", believers.get('rowCount'), believers.get('data')[:3])

