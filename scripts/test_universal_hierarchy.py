def get_canonical_level(val):
    if val is None or val == '' or str(val).strip() in ['null', 'undefined']:
        return None
    s = str(val).strip().lower()
    if 'state' in s or 'రాష్ట్ర' in s or s == '0':
        return 1
    if 'dist' in s or 'జిల్లా' in s or s == '1':
        return 2
    if 'const' in s or 'నియోజకవర్గ' in s or s == '2':
        return 3
    if 'mandal' in s or 'municip' in s or 'మండల' in s or s == '3':
        return 4
    if 'panchayat' in s or 'పంచాయతి' in s or 'village' in s or 'గ్రామ' in s or s == '4':
        return 5
    if 'ward' in s or 'వార్డు' in s or s in ['5', '6']:
        return 6
    return None

def test_mappings():
    test_cases = [
        # (input, expected_canonical)
        (0, 1),
        ("State Level", 1),
        ("రాష్ట్ర నాయకుడు", 1),
        (1, 2),
        ("District Level", 2),
        ("జిల్లా నాయకుడు", 2),
        (2, 3),
        ("Constituency Level", 3),
        ("నియోజకవర్గం  నాయకుడు", 3),
        (3, 4),
        ("Municipality / Mandal Level", 4),
        ("మండలం నాయకుడు", 4),
        (4, 5),
        ("Ward / Panchayati Level", 5),
        ("పంచాయతి నాయకుడు", 5),
        (5, 6),
        ("వార్డు నాయకుడు", 6),
        (6, 6),
        ("Sub Ward", 6)
    ]
    for inp, expected in test_cases:
        res = get_canonical_level(inp)
        assert res == expected, f"Failed for {inp}: got {res}, expected {expected}"
    print("All canonical level mappings passed!")

if __name__ == '__main__':
    test_mappings()

