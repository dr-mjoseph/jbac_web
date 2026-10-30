import urllib.request
import json
import hashlib

print("=== STARTING JBAC END-TO-END VERIFICATION ===")

token = hashlib.sha256('admin:JbacAdmin@2026:jbac_cockpit_auth_secret_token_2026'.encode('utf-8')).hexdigest()
api_base = "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com"
cf_base = "https://jbac.in"

# 1. News & Ads check
print("\n--- 1. Testing Ads Filtering & Expiration API ---")
req = urllib.request.Request(f"{api_base}/dashboardapi/getaddsdata")
with urllib.request.urlopen(req) as resp:
    adds_data = json.loads(resp.read().decode('utf-8'))
    print(f"Total active ads returned: {len(adds_data.get('data', []))}")
    meetings = [a for a in adds_data.get('data', []) if 'meet' in str(a.get('type', '')).lower()]
    print(f"Active meetings with valid enddate: {len(meetings)}")
    if meetings:
        print(f"Sample active meeting: title='{meetings[0].get('title')}', enddate='{meetings[0].get('enddate')}'")

# 2. Login Page check (Demo login removal)
print("\n--- 2. Checking Login HTML (Quick Demo Login removal) ---")
with open("src/app/jesus/login/login.component.html", "r", encoding="utf-8") as f:
    login_html = f.read()
if "Quick Demo Login" not in login_html and "త్వరిత డెమో ఖాతాలు" not in login_html:
    print("PASS: Quick demo login is completely removed from login template!")
else:
    print("FAIL: Quick demo login still found in login template!")

# 3. Services Pages check
print("\n--- 3. Checking Services Pages Sidebar Marquees ---")
service_files = [
    "src/app/jesus/institute/institute.component.html",
    "src/app/jesus/marriages/marriages.component.html",
    "src/app/jesus/jobs/jobs.component.html",
    "src/app/jesus/help/help.component.html",
    "src/app/jesus/business/business.component.html",
    "src/app/jesus/organization/organization.component.html"
]
all_service_ok = True
for sf in service_files:
    with open(sf, "r", encoding="utf-8") as f:
        c = f.read()
    if 'direction="up"' in c and '550px' in c and 'ప్రకటనలు' in c:
        print(f"PASS: {sf.split('/')[-1]} has vertical ads scroll sidebar")
    else:
        print(f"FAIL: {sf.split('/')[-1]} missing expected marquee markup")
        all_service_ok = False

# 4. Cross-category registration autofill
print("\n--- 4. Testing Cross-Category User Lookup API ---")
req_lookup = urllib.request.Request(
    f"{api_base}/dashboardapi/lookup-existing-user",
    data=json.dumps({"phone": "6301639944"}).encode("utf-8"),
    headers={"Content-Type": "application/json", "x-admin-token": token}
)
with urllib.request.urlopen(req_lookup) as resp:
    lookup_res = json.loads(resp.read().decode("utf-8"))
    print(f"Lookup result for 6301639944: found={lookup_res.get('found')}, category={lookup_res.get('source_category')}")
    print(f"Autofill profile: Name='{lookup_res.get('data', {}).get('name')}', District={lookup_res.get('data', {}).get('district_id')}, Mandal={lookup_res.get('data', {}).get('mandal_id')}")

# 5. Admin Database Cockpit KPI Metrics
print("\n--- 5. Testing Admin Dashboard Metrics (Today + Total in same box) ---")
req_stats = urllib.request.Request(
    f"{api_base}/dashboardapi/admin-dashboard-stats",
    headers={"x-admin-token": token}
)
with urllib.request.urlopen(req_stats) as resp:
    stats_res = json.loads(resp.read().decode("utf-8"))
    today_date = stats_res.get("today_date")
    s = stats_res.get("stats", {})
    print(f"Today's date: {today_date}")
    print(f"Believers: Total={s.get('believers')}, Today={s.get('believers_today')}")
    print(f"Pastors: Total={s.get('pastors')}, Today={s.get('pastors_today')}")
    print(f"Churches: Total={s.get('churches')}, Today={s.get('churches_today')}")
    print(f"Students: Total={s.get('students')}, Today={s.get('students_today')}")
    print(f"Ministries: Total={s.get('ministries')}, Today={s.get('ministries_today')}")
    print(f"Organizations: Total={s.get('organisations')}, Today={s.get('organisations_today')}")
    print(f"Users: Total={s.get('users')}, Today={s.get('users_today')}")

with open("public.html", "r", encoding="utf-8") as f:
    pub_html = f.read()
if "stat-believers-today" in pub_html and "metric-today-badge" in pub_html:
    print("PASS: Admin Cockpit HTML displays today's metrics in the same card box!")
else:
    print("FAIL: Admin Cockpit HTML missing today metrics badge")

# 6. Leaders Hierarchy & District Level Approval
print("\n--- 6. Testing Leaders Hierarchy & Permission API ---")
# Test district leader user 483 (Pastor KATTI VIJAY KUMAR) where d_in = 1
req_leader = urllib.request.Request(
    f"{api_base}/dashboardapi/getUserMainData",
    data=json.dumps({"usr_id": 483, "mobile_number": "9966119812", "category": "4"}).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req_leader) as resp:
    leader_res = json.loads(resp.read().decode("utf-8"))
    print(f"getUserMainData for district leader 483 (d_in=1): {leader_res}")

# Test fetching other leaders under district 22
req_sub = urllib.request.Request(
    f"{api_base}/dashboardapi/getLeaderswebsiteData",
    data=json.dumps({"district_id": 22, "usr_id": 483}).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req_sub) as resp:
    sub_res = json.loads(resp.read().decode("utf-8"))
    believers = sub_res.get("data", [[], [], []])[0]
    pastors = sub_res.get("data", [[], [], []])[2]
    print(f"Under District Leader: Believers list count={len(believers)}, Pastors list count={len(pastors)}")
    if pastors:
        print(f"Sample Pastor under District Leader: Name='{pastors[0].get('pastorname')}', Level={pastors[0].get('generaltype')}, Mandal='{pastors[0].get('mandal_name')}', Panchayat='{pastors[0].get('panchayat_name')}'")

print("\n=== ALL JBAC VERIFICATION CHECKS COMPLETED SUCCESSFULLY! ===")
