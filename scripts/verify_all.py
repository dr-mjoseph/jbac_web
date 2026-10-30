import urllib.request
import json
import hashlib

token = hashlib.sha256("admin:JbacAdmin@2026:jbac_cockpit_auth_secret_token_2026".encode('utf-8')).hexdigest()

queries = [
    ('institutes', "SELECT count(*) as total, sum(case when image is not null and image != '' then 1 else 0 end) as with_img FROM institutes"),
    ('independentorganisation_reg', "SELECT count(*) as total, sum(case when image is not null and image != '' then 1 else 0 end) as with_img FROM independentorganisation_reg"),
    ('helps', "SELECT count(*) as total, sum(case when image is not null and image != '' then 1 else 0 end) as with_img FROM helps"),
    ('gallery', "SELECT count(*) as total, sum(case when image is not null and image != '' then 1 else 0 end) as with_img FROM gallery"),
    ('gallery_category', "SELECT count(*) as total FROM gallery_category"),
    ('church_timings', "SELECT count(*) as total, max(id) as max_id FROM church_timings"),
    ('attacks', "SELECT count(*) as total, max(id) as max_id FROM attacks"),
    ('news', "SELECT count(*) as total, max(id) as max_id FROM news"),
    ('post_news', "SELECT count(*) as total, max(id) as max_id FROM post_news")
]

for tbl, q in queries:
    req = urllib.request.Request(
        'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query',
        data=json.dumps({'query': q}).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'x-admin-token': token}
    )
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print(f"[{tbl}]:", res.get('data'))
