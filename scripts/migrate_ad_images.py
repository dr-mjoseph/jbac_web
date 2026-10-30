import urllib.request, json, base64, subprocess, os

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

os.makedirs('temp_ad_images', exist_ok=True)

# Fetch each large row one by one to avoid 6MB limit
rows_info = run_sql('SELECT id, LENGTH(image) as sz FROM adds_data WHERE image IS NOT NULL AND LENGTH(image) > 1000')['data']
print(f"Migrating {len(rows_info)} ad images to S3...")

for item in rows_info:
    ad_id = item['id']
    row_data = run_sql(f'SELECT id, image FROM adds_data WHERE id = {ad_id}')['data']
    if not row_data:
        continue
    img_str = row_data[0]['image']
    if not img_str:
        continue
    
    ext = 'jpg'
    b64_content = img_str
    if ',' in img_str and 'data:image/' in img_str:
        header, b64_content = img_str.split(',', 1)
        if 'png' in header:
            ext = 'png'
        elif 'jpeg' in header or 'jpg' in header:
            ext = 'jpg'
        elif 'gif' in header:
            ext = 'gif'
        elif 'webp' in header:
            ext = 'webp'
            
    try:
        raw_bytes = base64.b64decode(b64_content)
        file_path = f"temp_ad_images/ad_{ad_id}.{ext}"
        with open(file_path, 'wb') as f:
            f.write(raw_bytes)
        
        s3_key = f"websiteimages/ad_{ad_id}.{ext}"
        # Upload to S3 using aws cli
        cmd = f'aws s3 cp "{file_path}" "s3://jbac-web-production-298363284024/{s3_key}" --region ap-southeast-2'
        subprocess.run(cmd, shell=True, check=True)
        
        new_url = f"https://jbac.in/{s3_key}"
        # Update row in DB
        update_query = f"UPDATE adds_data SET image = '{new_url}' WHERE id = {ad_id}"
        run_sql(update_query)
        print(f"Updated Ad #{ad_id} -> {new_url} ({len(raw_bytes)} bytes)")
    except Exception as e:
        print(f"Error migrating Ad #{ad_id}: {e}")

print("Migration complete!")
