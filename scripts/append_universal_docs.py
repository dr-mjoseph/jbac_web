import datetime

now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

doc_entry = f"""

---

## [{now}] Universal 6-Tier Leadership Hierarchy & Strict Geographic/Type Scoping

### 1. Specification Reference
Implemented the universal hierarchy and isolation specifications from the public document:
- **Reference Document**: `https://drive.google.com/file/d/1TXqhrc5TiIW1SfwZFGbIpMfBttjfXmm2/view?usp=sharing`
- **Canonical 6 Levels**:
  - Level 1: రాష్ట్ర నాయకుడు (State Leader)
  - Level 2: జిల్లా నాయకుడు (District Leader)
  - Level 3: నియోజకవర్గం నాయకుడు (Constituency Leader)
  - Level 4: మండల నాయకుడు (Mandal Leader)
  - Level 5: పంచాయతి నాయకుడు (Panchayat Leader)
  - Level 6: వార్డు నాయకుడు (Ward Leader)

### 2. Universal SQL Query & Scoping Logic
Implemented across backend endpoints (`/dashboardapi/getLeaderswebsiteData`, `/dashboardapi/getLeaderswebsitewing`, `/api/leaders`):
1. **Level Boundary Rule (`targetLevel = logged_in_level_id + 1`)**:
   - Guaranteed next-tier-down targeting across all 6 levels.
   - Level 1 (State) $\\rightarrow$ Level 2 (District Leaders).
   - Level 2 (District) $\\rightarrow$ Level 3 (Constituency Leaders).
   - Level 3 (Constituency) $\\rightarrow$ Level 4 (Mandal Leaders).
   - Level 4 (Mandal) $\\rightarrow$ Level 5 (Panchayat Leaders).
   - Level 5 (Panchayat) $\\rightarrow$ Level 6 (Ward Leaders).
   - Level 6 (Ward) $\\rightarrow$ None (`1=0`).
2. **Leader Type Isolation (`leader_type = :logged_in_leader_type`)**:
   - General Leader $\\rightarrow$ General Leaders ONLY (`leadertype != '2'` and no wing category).
   - Wing Leader $\\rightarrow$ Wing Leaders of that **exact same wing category** ONLY.
   - Cross-type bleed eliminated: in user's screenshot, `sample7` (Wing Leader) and `sample3` (Mandal Leader) were shown to District Leader `Sample` (Pastor 1438). Under the universal query, `sample7` and `sample3` are strictly filtered out; only `sample1` (Constituency Leader) appears.
3. **Strict Geographic Scoping**:
   - Level 1: `(state_id = :state_id OR state_id IS NULL)`.
   - Level 2: `district_id = :district_id`.
   - Level 3: `constituency_id = :constituency_id AND (district_id = :district_id OR :district_id IS NULL)`.
   - Level 4: `mandal_id = :mandal_id AND (constituency_id = :constituency_id OR :constituency_id IS NULL)`.
   - Level 5: `(panchayat_id = :panchayat_id OR village_id = :village_id) AND (mandal_id = :mandal_id OR :mandal_id IS NULL)`.
4. **Students Scoping**:
   - General Leaders and Student Wing Leaders view students strictly at `logged_in_level_id + 1` within their geographical jurisdiction.
   - Non-student wing leaders (Advocate, Medical, etc.) have student results shielded (`1=0`).
5. **Session Parameter Binding**:
   - Server dynamically inspects `usr_id` directly against DB tables (`pastor_reg`, `signup_form`, `student_reg`) to authoritatively bind the logged-in user's level and location parameters rather than trusting unverified client input.
6. **Shielding & Deduplication**:
   - Excludes rejected leaders (`COALESCE(approval_ind, 0) != 2`).
   - Excludes current authenticated user from own subordinate list (`id != currentUserId`).
   - Added `GROUP BY table.id` and joined wings via `w.id = COALESCE(NULLIF(table.wingtypes, ''), table.wingtype)` to prevent duplicate rows.

### 3. Verification & Live AWS Testing
- **Test 1 (User Screenshot Case - Pastor 1438 Sample in District 40)**:
  - Query returned: **1 Pastor ONLY** (`sample1`, ID 1439, Constituency Leader).
  - `sample7` (Wing Leader, ID 1401) $\\rightarrow$ **EXCLUDED** (LeaderType Mismatch).
  - `sample3` (Mandal Leader, ID 1400) $\\rightarrow$ **EXCLUDED** (Level Mismatch).
  - Self (`Sample`, ID 1438) $\\rightarrow$ **EXCLUDED**.
- **Test 2 (District 17 Student Level Filtering)**:
  - Query returned: **2 Students ONLY** (`Chukka Divya Darshitha`, `Vinukonda samyuktha`), both at Constituency Level.
  - State-level, District-level, Mandal-level, and Panchayat-level students in District 17 were strictly excluded.
- **Test 3 (Engineering Wing Hierarchy - District 21)**:
  - `sample14` (District Wing Leader, ID 247) queries $\\rightarrow$ returns **1 Believer ONLY** (`sample15`, Constituency Wing Leader, ID 248).
  - `sample15` queries $\\rightarrow$ returns **1 Believer ONLY** (`sample16`, Mandal Wing Leader, ID 249).
"""

with open('README.md', 'a', encoding='utf-8') as f:
    f.write(doc_entry)
print('Updated README.md')

with open('PROJECT_JOURNAL_AND_EXECUTION_LOG.md', 'a', encoding='utf-8') as f:
    f.write(doc_entry)
print('Updated PROJECT_JOURNAL_AND_EXECUTION_LOG.md')

