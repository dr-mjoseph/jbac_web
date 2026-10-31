import urllib.request
import json
import time

url = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/getLeaderswebsiteData'

def run_tests():
    print("=" * 70)
    print("RUNNING LIVE AWS LAMBDA VERIFICATION FOR UNIVERSAL HIERARCHY")
    print("=" * 70)

    # -------------------------------------------------------------
    # TEST 1: Pastor 1438 (Sample) - EXACT CASE FROM USER SCREENSHOT
    # -------------------------------------------------------------
    payload1 = {
        'usr_id': '1438',
        'category_id': '4'
    }
    req1 = urllib.request.Request(url, data=json.dumps(payload1).encode(), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req1, timeout=12) as resp:
            data1 = json.loads(resp.read().decode())
            pastors = data1['data'][2]
            believers = data1['data'][0]
            students = data1['data'][3] if len(data1['data']) > 3 else []

            print("\n[TEST 1] District Leader Sample (ID 1438) in District 40:")
            print(f"  Total Pastors returned: {len(pastors)}")
            pastor_names = [p.get('pastorname') for p in pastors]
            print(f"  Pastor names: {pastor_names}")

            # Verification:
            # 1. sample1 (Constituency Leader) MUST be present
            # 2. sample7 (Wing Leader) MUST NOT be present
            # 3. sample3 (Mandal Leader) MUST NOT be present
            # 4. Sample (1438, self) MUST NOT be present
            assert 'sample1' in pastor_names, "FAIL: sample1 (Constituency Leader) should be present"
            assert 'sample7' not in pastor_names, "FAIL: sample7 (Wing Leader) must be excluded from General Leader view"
            assert 'sample3' not in pastor_names, "FAIL: sample3 (Mandal Leader) must be excluded from District Leader view"
            assert 'Sample' not in pastor_names, "FAIL: Self should be excluded"
            print("  >>> TEST 1 PASSED: Only sample1 (Constituency Leader) returned! sample7 & sample3 excluded!")
    except Exception as e:
        print("  TEST 1 ERROR:", e)

    # -------------------------------------------------------------
    # TEST 2: Student Level Filtering in District 17
    # -------------------------------------------------------------
    # District Leader in district 17 looking for Constituency-level students (Level 3)
    payload2 = {
        'district_id': '17',
        'generaltype': 1, # District Leader
        'leadertype': 1
    }
    req2 = urllib.request.Request(url, data=json.dumps(payload2).encode(), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req2, timeout=12) as resp:
            data2 = json.loads(resp.read().decode())
            students2 = data2['data'][3] if len(data2['data']) > 3 else []
            print(f"\n[TEST 2] District 17 General Leader viewing Students:")
            print(f"  Total Students returned: {len(students2)}")
            for s in students2:
                print(f"   - {s.get('id')}: {s.get('fname')} | {s.get('generaltype')} | Const: {s.get('constituency_id')}")
            
            # Verify only Constituency Level students are returned
            student_levels = [s.get('generaltype') for s in students2]
            for lvl in student_levels:
                assert lvl in ['Constituency Level', 'Constituency level', '2'], f"FAIL: Unexpected student level {lvl}"
            print("  >>> TEST 2 PASSED: Only Constituency-level students returned!")
    except Exception as e:
        print("  TEST 2 ERROR:", e)

    # -------------------------------------------------------------
    # TEST 3: Advocate Wing Leader in District 20
    # -------------------------------------------------------------
    payload3 = {
        'district_id': '20',
        'generaltype': 1,
        'leadertype': 2,
        'wingtypes': '6' # Advocate Wing
    }
    req3 = urllib.request.Request(url, data=json.dumps(payload3).encode(), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req3, timeout=12) as resp:
            data3 = json.loads(resp.read().decode())
            pastors3 = data3['data'][2]
            print(f"\n[TEST 3] District 20 Advocate Wing Leader viewing Pastors:")
            print(f"  Total Pastors returned: {len(pastors3)}")
            for p in pastors3:
                print(f"   - {p.get('id')}: {p.get('pastorname')} | {p.get('wing_name')} | {p.get('wingtypes')}")
            assert len(pastors3) == 1 and pastors3[0]['id'] == 1261, "FAIL: Expected only Pastor 1261 (Rajesh chadamala)"
            print("  >>> TEST 3 PASSED: Exact Advocate Wing isolation preserved!")
    except Exception as e:
        print("  TEST 3 ERROR:", e)

if __name__ == '__main__':
    run_tests()

