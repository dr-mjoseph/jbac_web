import hashlib
import urllib.request
import json

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'JbacAdmin@2026'
ADMIN_AUTH_SECRET = 'jbac_cockpit_auth_secret_token_2026'
token = hashlib.sha256(f"{ADMIN_USERNAME}:{ADMIN_PASSWORD}:{ADMIN_AUTH_SECRET}".encode('utf-8')).hexdigest()

def execute(sql):
    url = "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/execute-query"
    payload = json.dumps({"query": sql}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={
        "Content-Type": "application/json",
        "x-admin-token": token
    })
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode('utf-8'))

# Curated list of active, verified S3 image URLs from websiteimages
AVAILABLE_IMAGES = [
    "https://jbac.in/websiteimages/1075041739121030413.jpg",
    "https://jbac.in/websiteimages/1083021739247372336.jpeg",
    "https://jbac.in/websiteimages/1110711761293995945.jpeg",
    "https://jbac.in/websiteimages/1156531741397053470.jpg",
    "https://jbac.in/websiteimages/1183181736999717186.jpeg",
    "https://jbac.in/websiteimages/1216811750493516778.jpeg",
    "https://jbac.in/websiteimages/1230381737823169311.jpeg",
    "https://jbac.in/websiteimages/1260371739812995158.jpg",
    "https://jbac.in/websiteimages/1424421736840158958.jpeg",
    "https://jbac.in/websiteimages/1466471736756187555.jpeg",
    "https://jbac.in/websiteimages/1585871738152915722.jpeg",
    "https://jbac.in/websiteimages/1586751743691991648.jpg",
    "https://jbac.in/websiteimages/1660671739808431580.jpeg",
    "https://jbac.in/websiteimages/1774201740038309255.jpg",
    "https://jbac.in/websiteimages/1775331739123203049.jpeg",
    "https://jbac.in/websiteimages/1809491739165191241.jpg",
    "https://jbac.in/websiteimages/1848121739121693390.jpg",
    "https://jbac.in/websiteimages/1918871756520363172.jpeg",
    "https://jbac.in/websiteimages/1988981759811874199.jpg",
    "https://jbac.in/websiteimages/2023601743778556568.jpeg",
    "https://jbac.in/websiteimages/2047111737299782985.jpeg",
    "https://jbac.in/websiteimages/2114611739163294586.jpg",
    "https://jbac.in/websiteimages/2124921740441825925.jpg",
    "https://jbac.in/websiteimages/2223931740166838666.jpg",
    "https://jbac.in/websiteimages/2314841789104729160.jpeg",
    "https://jbac.in/websiteimages/2375841738834927289.jpeg",
    "https://jbac.in/websiteimages/2464731739121404113.jpeg",
    "https://jbac.in/websiteimages/2513471739120610537.jpg",
    "https://jbac.in/websiteimages/2539121737198754125.jpeg",
    "https://jbac.in/websiteimages/2567951737440621342.jpeg"
]

def fix_table_images(table, where_condition="image IS NULL OR image = ''"):
    res = execute(f"SELECT id FROM `{table}` WHERE {where_condition}")
    rows = res.get('data', [])
    print(f"Found {len(rows)} rows with null/empty image in {table}")
    for idx, r in enumerate(rows):
        img = AVAILABLE_IMAGES[idx % len(AVAILABLE_IMAGES)]
        up_res = execute(f"UPDATE `{table}` SET image = '{img}', cts = COALESCE(cts, '2026-10-20 10:00:00') WHERE id = {r['id']}")
        print(f"Updated {table} id {r['id']} with image {img}: affected {up_res.get('affectedRows')}")

if __name__ == '__main__':
    fix_table_images('institutes')
    fix_table_images('independentorganisation_reg')
    fix_table_images('helps')
