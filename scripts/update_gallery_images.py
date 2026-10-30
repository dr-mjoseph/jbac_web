import os, urllib.request, json

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

files = sorted([f for f in os.listdir('website_uploads/websiteimages') if f.lower().endswith(('.jpg', '.jpeg', '.png')) and os.path.getsize(os.path.join('website_uploads/websiteimages', f)) > 5000])

print(f"Available real image files: {len(files)}")

# 1. Update gallery_category cover images
cat_cover_1 = f"https://jbac.in/websiteimages/{files[0]}"
cat_cover_2 = f"https://jbac.in/websiteimages/{files[1]}"
run_sql(f"UPDATE gallery_category SET image = '{cat_cover_1}' WHERE id = 9")
run_sql(f"UPDATE gallery_category SET image = '{cat_cover_2}' WHERE id = 10")
print("Updated gallery_category 9 and 10 covers")

# 2. Update existing 27 gallery items to use real images
gallery_rows = run_sql("SELECT id FROM gallery ORDER BY id ASC")['data']
for idx, r in enumerate(gallery_rows):
    img_file = files[(idx + 2) % len(files)]
    new_url = f"https://jbac.in/websiteimages/{img_file}"
    run_sql(f"UPDATE gallery SET image = '{new_url}' WHERE id = {r['id']}")

print(f"Updated {len(gallery_rows)} existing gallery rows with real image URLs")
