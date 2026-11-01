import urllib.request
import json

url = 'https://1a8kqxawxd.execute-api.ap-southeast-2.amazonaws.com/dashboardapi/getLeaderswebsiteData'

def run():
    print("=" * 70)
    print("LIVE AWS LAMBDA VERIFICATION FOR USER TYPE ISOLATION")
    print("=" * 70)

    # 1. Test Pastor Sample (1438) - Default behavior (no user_type specified, should isolate to pastor)
    payload1 = {'usr_id': '1438', 'category_id': '4'}
    req1 = urllib.request.Request(url, data=json.dumps(payload1).encode(), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req1, timeout=15) as resp:
        res1 = json.loads(resp.read().decode())
        print("\n[TEST 1] Pastor 1438 without explicit user_type (auto-resolved):")
        print(f"  selected_user_type: {res1.get('selected_user_type')}")
        believers = res1['data'][0]
        pastors = res1['data'][2]
        students = res1['data'][3] if len(res1['data']) > 3 else []
        print(f"  Believers count: {len(believers)}")
        print(f"  Pastors count: {len(pastors)}")
        print(f"  Students count: {len(students)}")
        assert res1.get('selected_user_type') == 'pastor', "Expected selected_user_type == 'pastor'"
        assert len(believers) == 0, "Believers must be empty for pastor type"
        assert len(students) == 0, "Students must be empty for pastor type"
        assert len(pastors) > 0, "Expected pastor subordinates"
        print(f"  Returned pastor subordinate: {pastors[0]['pastorname']} (ID {pastors[0]['id']})")
        print("  >>> TEST 1 PASSED: Only Pastor requests returned; Believers & Students completely removed!")

    # 2. Test explicit user_type: 'pastor'
    payload2 = {'usr_id': '1438', 'user_type': 'pastor', 'district_id': 40, 'logged_in_level_id': 2}
    req2 = urllib.request.Request(url, data=json.dumps(payload2).encode(), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req2, timeout=15) as resp:
        res2 = json.loads(resp.read().decode())
        print("\n[TEST 2] Explicit user_type = 'pastor':")
        believers = res2['data'][0]
        pastors = res2['data'][2]
        students = res2['data'][3] if len(res2['data']) > 3 else []
        print(f"  Believers count: {len(believers)}, Pastors count: {len(pastors)}, Students count: {len(students)}")
        assert len(believers) == 0 and len(students) == 0 and len(pastors) > 0
        print("  >>> TEST 2 PASSED: Only Pastor requests returned!")

    # 3. Test explicit user_type: 'student'
    payload3 = {'usr_id': '1438', 'user_type': 'student', 'district_id': 17, 'logged_in_level_id': 2}
    req3 = urllib.request.Request(url, data=json.dumps(payload3).encode(), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req3, timeout=15) as resp:
        res3 = json.loads(resp.read().decode())
        print("\n[TEST 3] Explicit user_type = 'student':")
        believers = res3['data'][0]
        pastors = res3['data'][2]
        students = res3['data'][3] if len(res3['data']) > 3 else []
        print(f"  Believers count: {len(believers)}, Pastors count: {len(pastors)}, Students count: {len(students)}")
        assert len(believers) == 0, "Believers must be empty for student type"
        assert len(pastors) == 0, "Pastors must be empty for student type"
        print(f"  Students returned: {len(students)}")
        print("  >>> TEST 3 PASSED: Only Student requests returned; Believers & Pastors completely removed!")

    # 4. Test explicit user_type: 'believer'
    payload4 = {'usr_id': '1438', 'user_type': 'believer', 'district_id': 40, 'logged_in_level_id': 2}
    req4 = urllib.request.Request(url, data=json.dumps(payload4).encode(), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req4, timeout=15) as resp:
        res4 = json.loads(resp.read().decode())
        print("\n[TEST 4] Explicit user_type = 'believer':")
        believers = res4['data'][0]
        pastors = res4['data'][2]
        students = res4['data'][3] if len(res4['data']) > 3 else []
        print(f"  Believers count: {len(believers)}, Pastors count: {len(pastors)}, Students count: {len(students)}")
        assert len(pastors) == 0, "Pastors must be empty for believer type"
        assert len(students) == 0, "Students must be empty for believer type"
        print("  >>> TEST 4 PASSED: Only Believer requests returned; Pastors & Students completely removed!")

    print("\n" + "=" * 70)
    print("ALL LIVE USER TYPE ISOLATION TESTS PASSED 100%!")
    print("=" * 70)

if __name__ == '__main__':
    run()
