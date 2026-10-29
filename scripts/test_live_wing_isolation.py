import urllib.request
import json

url = "https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/getLeaderswebsiteData"

# Test 1: Advocate Wing District Leader in district 17 (sample10, usr_id: 245)
payload1 = json.dumps({
    "usr_id": "245",
    "district_id": "17",
    "generaltype": 1,
    "leadertype": 2,
    "wingtypes": "6"
}).encode('utf-8')

req1 = urllib.request.Request(url, data=payload1, headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req1, timeout=8) as resp:
        data1 = json.loads(resp.read().decode())
        believers = data1.get("data", [])[0]
        students = data1.get("data", [])[3] if len(data1.get("data", [])) > 3 else []
        print("[Test 1 - Advocate Wing Leader]")
        print("  Believers returned:", len(believers))
        for b in believers:
            print("   - Believer:", b.get("fname"), "wing_name:", b.get("wing_name"), "wingtypes:", b.get("wingtypes"))
        print("  Students returned (should be 0 for Advocate Wing):", len(students))
except Exception as e:
    print("Test 1 error:", e)

# Test 2: Student Wing District Leader in district 13
payload2 = json.dumps({
    "district_id": "13",
    "generaltype": 1,
    "leadertype": 2,
    "wingtypes": "1"
}).encode('utf-8')

req2 = urllib.request.Request(url, data=payload2, headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req2, timeout=8) as resp:
        data2 = json.loads(resp.read().decode())
        believers = data2.get("data", [])[0]
        students = data2.get("data", [])[3] if len(data2.get("data", [])) > 3 else []
        print("\n[Test 2 - Student Wing Leader]")
        print("  Believers returned (Student Wing only):", len(believers))
        print("  Students returned (Student Wing):", len(students))
        for s in students[:5]:
            print("   - Student:", s.get("fname"), "wing_name:", s.get("wing_name"))
except Exception as e:
    print("Test 2 error:", e)
